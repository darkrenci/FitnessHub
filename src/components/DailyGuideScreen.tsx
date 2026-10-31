import React, { useState } from 'react';
import {
  Calendar,
  Check,
  Lightbulb,
} from 'lucide-react';
import { StatusBar } from './StatusBar';

interface DailyGuideScreenProps {
  onBack: () => void;
  onCompleted?: () => void;
}

export const DailyGuideScreen: React.FC<DailyGuideScreenProps> = ({
  onBack,
  onCompleted,
}) => {
  const [isDone, setIsDone] = useState(false);

  const handleMarkCompleted = () => {
    setIsDone(true);
    if (onCompleted) onCompleted();
  };

  return (
    <div className="flex flex-col min-h-[760px] bg-[#f8fafc] text-slate-800 px-5 pb-6">
      <StatusBar title="Daily Exercise Guide" onBack={onBack} transparent />

      {/* Date Pill */}
      <div className="flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 w-fit mb-4 mt-2 shadow-sm">
        <Calendar className="w-3.5 h-3.5 text-amber-500" />
        <span className="text-xs font-bold text-slate-700">
          Today, Oct 30 (Fri)
        </span>
      </div>

      {/* Main Exercise Card */}
      <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm mb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-xl font-black text-slate-900 tracking-tight leading-snug">
              20-Minute
              <br />
              Brisk Walk
            </h2>
          </div>

          {/* Park Walking Illustration Graphic */}
          <div className="w-24 h-24 relative flex-shrink-0">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <circle cx="80" cy="40" r="18" fill="#d1fae5" />
              <circle cx="65" cy="48" r="14" fill="#a7f3d0" />
              <circle cx="50" cy="24" r="6" fill="#f59e0b" />
              <path d="M44 32L56 32L58 52L42 52Z" fill="#10b981" />
              <path d="M42 52L58 52L56 64L44 64Z" fill="#334155" />
              <path d="M46 64L40 82M54 64L62 82" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
              <path d="M44 36L36 48M56 36L64 46" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Checkbox Items */}
        <div className="mt-5 space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-5 h-5 rounded-full bg-sky-100 border border-sky-300 flex items-center justify-center text-sky-600">
              <Check className="w-3 h-3 stroke-[3]" />
            </div>
            <span className="text-xs text-slate-700 font-semibold">
              Warm-up: 3-5 min
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <div className="w-5 h-5 rounded-full bg-sky-100 border border-sky-300 flex items-center justify-center text-sky-600">
              <Check className="w-3 h-3 stroke-[3]" />
            </div>
            <span className="text-xs text-slate-700 font-semibold">
              Walk at a moderate pace
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <div className="w-5 h-5 rounded-full bg-sky-100 border border-sky-300 flex items-center justify-center text-sky-600">
              <Check className="w-3 h-3 stroke-[3]" />
            </div>
            <span className="text-xs text-slate-700 font-semibold">
              Cool-down: 3-5 min
            </span>
          </div>
        </div>

        {/* Why this helps insight */}
        <div className="mt-5 p-3.5 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 flex-shrink-0">
            <Lightbulb className="w-4 h-4 fill-amber-500 text-amber-500" />
          </div>
          <p className="text-[11px] text-slate-700 font-medium leading-relaxed">
            <strong className="text-slate-900 font-bold">Why?</strong> Helps improve cardiovascular endurance and steady heart recovery.
          </p>
        </div>
      </div>

      {/* Bottom Button: Mark as Completed */}
      <div className="mt-auto pt-3">
        <button
          onClick={handleMarkCompleted}
          disabled={isDone}
          className={`w-full py-4 rounded-2xl font-black text-sm flex items-center justify-center space-x-2 transition-all ${
            isDone
              ? 'bg-slate-200 text-slate-500 border border-slate-300'
              : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/25 active:scale-[0.99]'
          }`}
        >
          <Check className="w-4 h-4 stroke-[3]" />
          <span>{isDone ? 'Completed for Today!' : 'Mark as Completed'}</span>
        </button>
      </div>
    </div>
  );
};
