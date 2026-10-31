import React, { useState } from 'react';
import {
  Heart,
  BarChart2,
  Lightbulb,
} from 'lucide-react';
import { HeartRateReading, BleHeartRate } from '../services/bleHeartRate';
import { StatusBar } from './StatusBar';

interface HeartRateScreenProps {
  heartRate: HeartRateReading | null;
  onBack: () => void;
}

export const HeartRateScreen: React.FC<HeartRateScreenProps> = ({
  heartRate,
  onBack,
}) => {
  const [showHardwareOptions, setShowHardwareOptions] = useState(false);
  const currentBpm = heartRate ? heartRate.bpm : 128;
  const isSimulated = heartRate?.source === 'simulated';

  const handleToggleSim = () => {
    if (isSimulated) {
      BleHeartRate.disconnect();
    } else {
      BleHeartRate.startSimulation(128, 'moderate');
    }
  };

  const handleConnectBle = async () => {
    try {
      await BleHeartRate.connectRealDevice();
    } catch (e: any) {
      console.warn(e.message || 'Bluetooth connection failed');
    }
  };

  return (
    <div className="flex flex-col min-h-[760px] bg-[#f8fafc] text-slate-800 px-5 pb-6">
      <StatusBar
        title="Heart Rate"
        onBack={onBack}
        rightAction={
          <button
            onClick={() => setShowHardwareOptions(!showHardwareOptions)}
            aria-label="Toggle wearable hardware menu"
            className="p-1 text-slate-600 hover:text-slate-900 rounded-lg"
          >
            <BarChart2 className="w-5 h-5" />
          </button>
        }
      />

      {/* Hardware Pairing Pop-down */}
      {showHardwareOptions && (
        <div className="mb-4 p-3 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between text-xs">
          <div className="text-slate-600 font-medium">
            {heartRate ? `Active: ${heartRate.deviceName}` : 'No sensor connected'}
          </div>
          <div className="flex space-x-1.5">
            <button
              onClick={handleToggleSim}
              className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 font-bold"
            >
              {isSimulated ? 'Stop Sim' : 'Simulate 128 BPM'}
            </button>
            <button
              onClick={handleConnectBle}
              className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold"
            >
              BLE
            </button>
          </div>
        </div>
      )}

      {/* Speedometer Circular Arc Meter */}
      <div className="flex flex-col items-center justify-center pt-4 pb-2">
        <div className="relative w-56 h-56 flex items-center justify-center">
          <svg className="w-56 h-56" viewBox="0 0 200 200">
            <defs>
              <linearGradient id="hrGaugeGradLight" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="50%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#f43f5e" />
              </linearGradient>
            </defs>
            {/* Background Track Arc */}
            <path
              d="M 30 150 A 80 80 0 1 1 170 150"
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="11"
              strokeLinecap="round"
            />
            {/* Colored Gauge Arc */}
            <path
              d="M 30 150 A 80 80 0 1 1 170 150"
              fill="none"
              stroke="url(#hrGaugeGradLight)"
              strokeWidth="11"
              strokeDasharray="360"
              strokeDashoffset="110"
              strokeLinecap="round"
            />
          </svg>

          {/* Center Text inside Arc */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
            <Heart className="w-6 h-6 fill-rose-500 text-rose-500 animate-heart-pulse mb-1" />
            <span className="text-4xl font-black text-slate-900 font-mono leading-none tracking-tight">
              {currentBpm}
            </span>
            <span className="text-xs font-bold text-slate-500 mt-1">
              BPM
            </span>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 mt-1">
              In Zone: Cardio
            </span>
          </div>
        </div>
      </div>

      {/* Live ECG Waveform Graphic */}
      <div className="w-full my-3 p-3 bg-rose-50/50 border border-rose-100 rounded-2xl">
        <svg viewBox="0 0 320 60" className="w-full h-12" fill="none">
          <path
            d="M0 30H50L60 26L70 34L80 18L90 44L100 8L112 50L122 30H170L180 26L190 34L200 18L210 44L220 8L232 50L242 30H320"
            stroke="#f43f5e"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* 2 Metric Cards: Avg & Max */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* Avg */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm text-center">
          <div className="text-xs text-slate-500 font-semibold mb-1">
            Avg
          </div>
          <div className="text-xl font-black text-slate-900 font-mono">
            115 <span className="text-xs font-semibold text-slate-500">BPM</span>
          </div>
        </div>

        {/* Max */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm text-center">
          <div className="text-xs text-slate-500 font-semibold mb-1">
            Max
          </div>
          <div className="text-xl font-black text-slate-900 font-mono">
            142 <span className="text-xs font-semibold text-slate-500">BPM</span>
          </div>
        </div>
      </div>

      {/* Advice Card */}
      <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center space-x-3 mt-auto shadow-sm">
        <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0">
          <Lightbulb className="w-5 h-5 fill-emerald-500 text-emerald-500" />
        </div>
        <div className="text-xs">
          <div className="font-bold text-slate-900">Great pace!</div>
          <div className="text-slate-600 mt-0.5">You're in the optimal cardio aerobic zone.</div>
        </div>
      </div>
    </div>
  );
};
