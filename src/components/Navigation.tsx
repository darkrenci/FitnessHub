import React from 'react';
import {
  Home,
  PlayCircle,
  TrendingUp,
  Calendar,
  User,
  Heart,
  Radio,
  Smartphone,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { HeartRateReading } from '../services/bleHeartRate';

interface NavigationProps {
  activeTab: 'home' | 'track' | 'progress' | 'schedule' | 'profile';
  onSelectTab: (tab: 'home' | 'track' | 'progress' | 'schedule' | 'profile') => void;
  isTracking: boolean;
  heartRate: HeartRateReading | null;
  onOpenHeartRateModal: () => void;
  onOpenNfcModal: () => void;
  isMobileFrame: boolean;
  onToggleFrame: () => void;
  hasUnreadRecommendations?: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onSelectTab,
  isTracking,
  heartRate,
  onOpenHeartRateModal,
  onOpenNfcModal,
  isMobileFrame,
  onToggleFrame,
}) => {
  return (
    <>
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <TrendingUp className="w-4 h-4 text-slate-950 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                FitTrack
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 tracking-wider">
                PRO
              </span>
            </div>
          </div>
        </div>

        {/* Status Pills */}
        <div className="flex items-center space-x-2">
          {/* Heart Rate Status Pill */}
          <button
            onClick={onOpenHeartRateModal}
            aria-label="Heart rate monitor settings"
            className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium border transition-all ${
              heartRate
                ? 'bg-rose-950/40 border-rose-800/50 text-rose-300 hover:bg-rose-900/50'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Heart
              className={`w-3.5 h-3.5 ${
                heartRate ? 'text-rose-500 fill-rose-500 animate-heart-pulse' : 'text-slate-500'
              }`}
            />
            <span className="font-mono">
              {heartRate ? `${heartRate.bpm} BPM` : 'No HR'}
            </span>
          </button>

          {/* NFC Pill */}
          <button
            onClick={onOpenNfcModal}
            aria-label="NFC tags and devices"
            className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium bg-slate-900/60 border border-slate-800 text-slate-300 hover:text-teal-400 hover:border-teal-500/40 transition-all"
          >
            <Radio className="w-3.5 h-3.5 text-teal-400" />
            <span className="hidden sm:inline">NFC</span>
          </button>

          {/* Frame Toggle */}
          <button
            onClick={onToggleFrame}
            aria-label={isMobileFrame ? 'Expand to responsive desktop layout' : 'Switch to mobile device frame'}
            title={isMobileFrame ? 'Expand layout' : 'Mobile phone preview'}
            className="p-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
          >
            {isMobileFrame ? <Maximize2 className="w-4 h-4" /> : <Smartphone className="w-4 h-4 text-emerald-400" />}
          </button>
        </div>
      </header>

      {/* Bottom Navigation Bar */}
      <nav
        aria-label="Bottom Navigation"
        className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/90 max-w-md mx-auto sm:max-w-none px-2 py-2 safe-bottom"
        style={{ maxWidth: isMobileFrame ? '430px' : '100%' }}
      >
        <div className="flex items-center justify-around max-w-lg mx-auto">
          {/* Home */}
          <button
            onClick={() => onSelectTab('home')}
            aria-label="Home Dashboard"
            className={`flex flex-col items-center justify-center flex-1 py-1 px-2 rounded-xl transition-all ${
              activeTab === 'home'
                ? 'text-emerald-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Home className={`w-5 h-5 transition-transform ${activeTab === 'home' ? 'scale-110' : ''}`} />
            <span className="text-[11px] font-semibold mt-1">Home</span>
          </button>

          {/* Track (Central highlighted action) */}
          <button
            onClick={() => onSelectTab('track')}
            aria-label="Live Activity Tracker"
            className={`flex flex-col items-center justify-center flex-1 py-1 px-2 relative transition-all ${
              activeTab === 'track'
                ? 'text-emerald-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div
              className={`relative p-2 rounded-full transition-transform ${
                isTracking
                  ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30 animate-pulse'
                  : activeTab === 'track'
                  ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/30'
                  : 'bg-slate-800 text-slate-300'
              }`}
            >
              <PlayCircle className="w-5 h-5 fill-current" />
              {isTracking && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-400 rounded-full animate-ping" />
              )}
            </div>
            <span className="text-[11px] font-semibold mt-0.5">
              {isTracking ? 'Live' : 'Track'}
            </span>
          </button>

          {/* Progress */}
          <button
            onClick={() => onSelectTab('progress')}
            aria-label="Progress & Analytics"
            className={`flex flex-col items-center justify-center flex-1 py-1 px-2 rounded-xl transition-all ${
              activeTab === 'progress'
                ? 'text-emerald-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <TrendingUp className={`w-5 h-5 transition-transform ${activeTab === 'progress' ? 'scale-110' : ''}`} />
            <span className="text-[11px] font-semibold mt-1">Progress</span>
          </button>

          {/* Schedule */}
          <button
            onClick={() => onSelectTab('schedule')}
            aria-label="Exercise Schedule & Alarms"
            className={`flex flex-col items-center justify-center flex-1 py-1 px-2 rounded-xl transition-all ${
              activeTab === 'schedule'
                ? 'text-emerald-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calendar className={`w-5 h-5 transition-transform ${activeTab === 'schedule' ? 'scale-110' : ''}`} />
            <span className="text-[11px] font-semibold mt-1">Schedule</span>
          </button>

          {/* Profile */}
          <button
            onClick={() => onSelectTab('profile')}
            aria-label="User Profile & Settings"
            className={`flex flex-col items-center justify-center flex-1 py-1 px-2 rounded-xl transition-all ${
              activeTab === 'profile'
                ? 'text-emerald-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className={`w-5 h-5 transition-transform ${activeTab === 'profile' ? 'scale-110' : ''}`} />
            <span className="text-[11px] font-semibold mt-1">Profile</span>
          </button>
        </div>
      </nav>
    </>
  );
};
