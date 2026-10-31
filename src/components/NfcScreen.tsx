import React, { useState } from 'react';
import {
  CheckCircle2,
} from 'lucide-react';
import { StatusBar } from './StatusBar';
import { NFCDevice } from '../types';

interface NfcScreenProps {
  devices: NFCDevice[];
  onBack: () => void;
  onTapSimulate?: () => void;
}

export const NfcScreen: React.FC<NfcScreenProps> = ({
  devices,
  onBack,
  onTapSimulate,
}) => {
  const [showManageModal, setShowManageModal] = useState(false);

  return (
    <div className="flex flex-col min-h-[760px] bg-[#f8fafc] text-slate-800 px-5 pb-6">
      <StatusBar title="NFC Device" onBack={onBack} transparent />

      {/* Main Illustration Area */}
      <div className="flex-1 flex flex-col items-center justify-center text-center my-6">
        {/* Phone + NFC Waves Graphic */}
        <div className="relative w-44 h-44 flex items-center justify-center mb-6">
          <svg viewBox="0 0 160 160" className="w-40 h-40">
            {/* Phone outline */}
            <rect
              x="25"
              y="20"
              width="60"
              height="110"
              rx="12"
              fill="#0f172a"
              stroke="#0284c7"
              strokeWidth="2.5"
              transform="rotate(-12 55 75)"
            />
            {/* Phone screen inner */}
            <rect
              x="30"
              y="30"
              width="50"
              height="90"
              rx="8"
              fill="#1e293b"
              transform="rotate(-12 55 75)"
            />
            {/* NFC Wave arcs radiating to tag */}
            <path
              d="M 95 60 A 25 25 0 0 1 95 90"
              fill="none"
              stroke="#0284c7"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d="M 103 52 A 38 38 0 0 1 103 98"
              fill="none"
              stroke="#0284c7"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.6"
            />
            {/* Circular NFC Tag Badge */}
            <circle cx="125" cy="75" r="22" fill="#0284c7" />
            <circle cx="125" cy="75" r="16" fill="#0369a1" />
            {/* NFC wave inside tag */}
            <path
              d="M 118 78 A 8 8 0 0 1 126 70 M 121 82 A 12 12 0 0 1 131 72"
              fill="none"
              stroke="#ffffff"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Heading */}
        <h2 className="text-base font-bold text-slate-900 max-w-[220px] leading-snug">
          Tap an NFC Tag or compatible device
        </h2>
        <p className="text-xs text-slate-500 mt-2 max-w-[240px] leading-relaxed font-medium">
          Hold your phone near the NFC tag to pair or identify your fitness equipment.
        </p>
      </div>

      {/* Registered Devices Status Card */}
      <div className="p-4 rounded-3xl bg-white border border-slate-200/90 flex items-center justify-between mb-4 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-5 h-5 fill-emerald-500 text-white" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900">Registered Devices</div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              {devices.length > 0 ? `${devices.length} active device` : '1 active device'}
            </div>
          </div>
        </div>

        {onTapSimulate && (
          <button
            onClick={onTapSimulate}
            className="px-3 py-1 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold hover:bg-emerald-100 transition-colors"
          >
            Simulate Tap
          </button>
        )}
      </div>

      {/* Manage Devices Button */}
      <div className="mt-auto">
        <button
          onClick={() => setShowManageModal(true)}
          className="w-full py-3.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-bold text-xs flex items-center justify-center space-x-2 shadow-sm transition-all active:scale-[0.99]"
        >
          <span>Manage Devices</span>
        </button>
      </div>

      {/* Quick Manage Modal */}
      {showManageModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-5 w-full max-w-sm space-y-3 shadow-xl">
            <h3 className="text-sm font-bold text-slate-900">Registered NFC Hardware</h3>
            <div className="space-y-2 text-xs">
              {devices.map((d) => (
                <div key={d.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex justify-between items-center">
                  <div>
                    <div className="font-bold text-slate-900">{d.name}</div>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">{d.tagId}</div>
                  </div>
                  <span className="text-[10px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-bold">
                    Active
                  </span>
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowManageModal(false)}
              className="w-full py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-sm"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
