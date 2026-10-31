/**
 * Web NFC (Near Field Communication) Service
 * Supports NDEFReader API on compatible Android devices running Chrome/Edge.
 * Includes interactive test emulator for development, desktop, and iOS environments.
 */

export interface NfcScanEvent {
  serialNumber: string;
  records: Array<{
    recordType: string;
    mediaType?: string;
    data?: string;
  }>;
  timestamp: number;
  source: 'hardware_nfc' | 'emulator';
}

type ScanCallback = (event: NfcScanEvent) => void;
type StatusCallback = (status: 'ready' | 'reading' | 'unsupported' | 'permission_denied' | 'error', message?: string) => void;

class NfcService {
  private ndef: any = null;
  private abortController: AbortController | null = null;
  private scanListeners: Set<ScanCallback> = new Set();
  private statusListeners: Set<StatusCallback> = new Set();
  private isScanning = false;

  public isSupported(): boolean {
    return typeof window !== 'undefined' && 'NDEFReader' in window;
  }

  public subscribe(cb: ScanCallback): () => void {
    this.scanListeners.add(cb);
    return () => this.scanListeners.delete(cb);
  }

  public onStatusChange(cb: StatusCallback): () => void {
    this.statusListeners.add(cb);
    return () => this.statusListeners.delete(cb);
  }

  private emitScan(event: NfcScanEvent) {
    this.scanListeners.forEach((cb) => cb(event));
  }

  private emitStatus(status: 'ready' | 'reading' | 'unsupported' | 'permission_denied' | 'error', msg?: string) {
    this.statusListeners.forEach((cb) => cb(status, msg));
  }

  /**
   * Start hardware Web NFC scanner
   */
  public async startScan(): Promise<void> {
    if (!this.isSupported()) {
      this.emitStatus('unsupported', 'Web NFC is not supported on this browser or platform. Requires Chrome on Android with NFC hardware.');
      return;
    }

    try {
      this.abortController = new AbortController();
      const NDEFReaderClass = (window as any).NDEFReader;
      this.ndef = new NDEFReaderClass();

      await this.ndef.scan({ signal: this.abortController.signal });
      this.isScanning = true;
      this.emitStatus('reading', 'Hold your device near an NFC tag or wearable...');

      this.ndef.addEventListener('reading', ({ serialNumber, message }: any) => {
        const records: any[] = [];
        for (const record of message.records) {
          let textData = '';
          if (record.recordType === 'text') {
            const textDecoder = new TextDecoder(record.encoding || 'utf-8');
            textData = textDecoder.decode(record.data);
          }
          records.push({
            recordType: record.recordType,
            mediaType: record.mediaType,
            data: textData || '[Binary Payload]',
          });
        }

        this.emitScan({
          serialNumber: serialNumber || '04:' + Math.random().toString(16).substring(2, 10).toUpperCase(),
          records,
          timestamp: Date.now(),
          source: 'hardware_nfc',
        });
      });

      this.ndef.addEventListener('readingerror', () => {
        this.emitStatus('error', 'Cannot read data from the NFC tag. Try moving closer or repositioning.');
      });
    } catch (err: any) {
      this.isScanning = false;
      if (err.name === 'NotAllowedError') {
        this.emitStatus('permission_denied', 'NFC permission was denied by the user or security settings.');
      } else {
        this.emitStatus('error', err.message || 'Failed to start NFC scan.');
      }
    }
  }

  public stopScan() {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
    this.isScanning = false;
    this.emitStatus('ready', 'NFC scanner idle');
  }

  /**
   * Simulate a physical NFC tag tap (for desktop, iOS, or testing)
   */
  public simulateTagTap(tagId: string, deviceName: string, defaultActivity: string = 'running') {
    this.emitScan({
      serialNumber: tagId,
      records: [
        {
          recordType: 'text',
          data: `FitTrack-Action:${defaultActivity}|Name:${deviceName}`,
        },
      ],
      timestamp: Date.now(),
      source: 'emulator',
    });
  }
}

export const Nfc = new NfcService();
