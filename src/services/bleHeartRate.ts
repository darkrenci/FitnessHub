/**
 * Web Bluetooth and Simulated Heart Rate Monitor Service
 * Connects to standard Bluetooth SIG Heart Rate GATT devices (Service: 0x180D)
 * like Polar H10, Garmin HRM-Pro, Wahoo TICKR, Apple Watch companion, etc.
 */

export interface HeartRateReading {
  bpm: number;
  timestamp: number;
  sensorLocation?: string;
  source: 'ble_sensor' | 'simulated';
  deviceName?: string;
  contactDetected?: boolean;
}

type HeartRateCallback = (reading: HeartRateReading) => void;
type ConnectionCallback = (connected: boolean, deviceName: string, error?: string) => void;

class BleHeartRateService {
  private device: any = null;
  private server: any = null;
  private characteristic: any = null;
  private callbacks: Set<HeartRateCallback> = new Set();
  private connectionCallbacks: Set<ConnectionCallback> = new Set();

  private isSimulated = false;
  private simulationInterval: any = null;
  private simulatedBpm = 72;
  private simulatedTargetBpm = 135;
  private deviceName = '';

  public isAvailable(): boolean {
    return typeof navigator !== 'undefined' && 'bluetooth' in navigator;
  }

  public isConnected(): boolean {
    return !!this.characteristic || this.isSimulated;
  }

  public getDeviceName(): string {
    return this.deviceName || (this.isSimulated ? 'Virtual Polar H10 Sensor' : 'None');
  }

  public getSource(): 'ble_sensor' | 'simulated' | 'disconnected' {
    if (this.characteristic) return 'ble_sensor';
    if (this.isSimulated) return 'simulated';
    return 'disconnected';
  }

  public subscribe(cb: HeartRateCallback): () => void {
    this.callbacks.add(cb);
    return () => this.callbacks.delete(cb);
  }

  public onConnectionChange(cb: ConnectionCallback): () => void {
    this.connectionCallbacks.add(cb);
    return () => this.connectionCallbacks.delete(cb);
  }

  private notifyConnection(connected: boolean, name: string, error?: string) {
    this.connectionCallbacks.forEach((cb) => cb(connected, name, error));
  }

  private emitReading(reading: HeartRateReading) {
    this.callbacks.forEach((cb) => cb(reading));
  }

  /**
   * Connect to real physical Bluetooth Heart Rate Sensor
   */
  public async connectRealDevice(): Promise<boolean> {
    if (!this.isAvailable()) {
      throw new Error('Web Bluetooth API is not supported in this browser. Please use Chrome on Android, Mac, or Windows.');
    }

    try {
      this.disconnect();

      // Standard Bluetooth SIG Heart Rate Service UUID: 0x180D
      const nav = navigator as any;
      const device = await nav.bluetooth.requestDevice({
        filters: [{ services: ['heart_rate'] }],
        optionalServices: ['battery_service', 'device_information'],
      });

      this.device = device;
      this.deviceName = device.name || 'Bluetooth Heart Rate Monitor';

      device.addEventListener('gattserverdisconnected', () => {
        this.characteristic = null;
        this.notifyConnection(false, this.deviceName, 'Device disconnected');
      });

      const server = await device.gatt.connect();
      this.server = server;

      const service = await server.getPrimaryService('heart_rate');
      // Heart Rate Measurement characteristic: 0x2A37
      const characteristic = await service.getCharacteristic('heart_rate_measurement');
      this.characteristic = characteristic;

      await characteristic.startNotifications();
      characteristic.addEventListener('characteristicvaluechanged', (event: any) => {
        const value = event.target.value;
        const reading = this.parseHeartRate(value);
        this.emitReading({
          ...reading,
          source: 'ble_sensor',
          deviceName: this.deviceName,
        });
      });

      this.isSimulated = false;
      this.notifyConnection(true, this.deviceName);
      return true;
    } catch (err: any) {
      this.notifyConnection(false, '', err.message);
      throw err;
    }
  }

  /**
   * Parses standard Bluetooth SIG Heart Rate Measurement Characteristic (0x2A37)
   */
  private parseHeartRate(dataView: DataView): { bpm: number; timestamp: number; contactDetected?: boolean } {
    const flags = dataView.getUint8(0);
    // Bit 0: 0 = 8-bit BPM, 1 = 16-bit BPM
    const is16Bit = (flags & 0x01) !== 0;
    // Bit 1 & 2: Contact status
    const contactSupported = (flags & 0x04) !== 0;
    const contactDetected = contactSupported ? (flags & 0x02) !== 0 : true;

    let bpm = 0;
    if (is16Bit) {
      bpm = dataView.getUint16(1, true); // Little endian
    } else {
      bpm = dataView.getUint8(1);
    }

    return {
      bpm,
      timestamp: Date.now(),
      contactDetected,
    };
  }

  /**
   * Connect to simulated Heart Rate Sensor with realistic human physiological response
   */
  public startSimulation(initialBpm: number = 75, workoutIntensity: 'resting' | 'light' | 'moderate' | 'high' = 'moderate') {
    this.disconnect();
    this.isSimulated = true;
    this.deviceName = 'Virtual Polar H10 (BLE)';
    this.simulatedBpm = initialBpm;

    if (workoutIntensity === 'resting') this.simulatedTargetBpm = 68;
    else if (workoutIntensity === 'light') this.simulatedTargetBpm = 115;
    else if (workoutIntensity === 'moderate') this.simulatedTargetBpm = 142;
    else if (workoutIntensity === 'high') this.simulatedTargetBpm = 168;

    this.notifyConnection(true, this.deviceName);

    // Realistic heart rate drift and sinus arrhythmia
    this.simulationInterval = setInterval(() => {
      // Step closer to target with gentle noise
      const diff = this.simulatedTargetBpm - this.simulatedBpm;
      const step = Math.sign(diff) * Math.min(Math.abs(diff), 2) + (Math.random() * 2 - 1);
      this.simulatedBpm = Math.max(55, Math.min(195, Math.round(this.simulatedBpm + step)));

      this.emitReading({
        bpm: this.simulatedBpm,
        timestamp: Date.now(),
        source: 'simulated',
        deviceName: this.deviceName,
        contactDetected: true,
      });
    }, 1000);
  }

  public setWorkoutIntensity(intensity: 'resting' | 'light' | 'moderate' | 'high') {
    if (intensity === 'resting') this.simulatedTargetBpm = 70;
    else if (intensity === 'light') this.simulatedTargetBpm = 118;
    else if (intensity === 'moderate') this.simulatedTargetBpm = 145;
    else if (intensity === 'high') this.simulatedTargetBpm = 172;
  }

  public disconnect() {
    if (this.simulationInterval) {
      clearInterval(this.simulationInterval);
      this.simulationInterval = null;
    }
    this.isSimulated = false;

    if (this.characteristic) {
      try {
        this.characteristic.stopNotifications();
      } catch (e) {}
      this.characteristic = null;
    }

    if (this.server && this.server.connected) {
      try {
        this.server.disconnect();
      } catch (e) {}
      this.server = null;
    }

    if (this.device) {
      this.device = null;
    }

    const prevName = this.deviceName;
    this.deviceName = '';
    this.notifyConnection(false, prevName);
  }
}

export const BleHeartRate = new BleHeartRateService();
