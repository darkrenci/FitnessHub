import React, { useState } from 'react';
import { Footprints } from 'lucide-react';
import { StatusBar } from './StatusBar';

interface ProgressScreenProps {
  onBack?: () => void;
}

export const ProgressScreen: React.FC<ProgressScreenProps> = ({ onBack }) => {
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('week');

  const chartData = [
    { day: 'Mon', val: 3.2 },
    { day: 'Tue', val: 4.0 },
    { day: 'Wed', val: 5.6 },
    { day: 'Thu', val: 4.1 },
    { day: 'Fri', val: 4.8 },
    { day: 'Sat', val: 3.5 },
    { day: 'Sun', val: 5.0 },
  ];

  return (
    <div className="flex flex-col min-h-[740px] bg-[#f8fafc] text-slate-800 px-5 pb-6">
      <StatusBar title="Your Progress" onBack={onBack} transparent />

      {/* Segmented Control Pill: Week | Month | Year */}
      <div className="flex items-center justify-between p-1 bg-slate-200/70 border border-slate-300/40 rounded-2xl mb-5 mt-1">
        {(['week', 'month', 'year'] as const).map((p) => {
          const isActive = period === p;
          return (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`flex-1 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
                isActive
                  ? 'bg-white text-emerald-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {p}
            </button>
          );
        })}
      </div>

      {/* Bar Chart Card */}
      <div className="p-5 rounded-3xl bg-white border border-slate-200/90 mb-4 shadow-sm">
        <div className="relative h-44 flex items-end">
          {/* Y-Axis Grid Lines & Numbers */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none text-[10px] text-slate-400 font-mono pr-2">
            <div className="border-b border-slate-100 w-full flex items-center justify-start pb-0.5">
              <span>6</span>
            </div>
            <div className="border-b border-slate-100 w-full flex items-center justify-start pb-0.5">
              <span>4</span>
            </div>
            <div className="border-b border-slate-100 w-full flex items-center justify-start pb-0.5">
              <span>2</span>
            </div>
            <div className="border-b border-slate-100 w-full flex items-center justify-start pb-0.5">
              <span>0</span>
            </div>
          </div>

          {/* Bars */}
          <div className="w-full flex items-end justify-between pl-6 pr-2 h-36 z-10">
            {chartData.map((item) => {
              const barHeightPx = Math.round((item.val / 6) * 110);
              return (
                <div key={item.day} className="flex flex-col items-center flex-1 h-full justify-end">
                  <div
                    className="w-4 rounded-full bg-gradient-to-t from-emerald-600 to-teal-400 transition-all duration-500 shadow-sm"
                    style={{ height: `${barHeightPx}px` }}
                  />
                  <span className="text-[10px] text-slate-500 font-semibold mt-2">
                    {item.day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3 Metric Cards: 18.7 km, 2.5 hrs, 5 Workouts */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-sm text-center">
          <div className="text-base font-black text-slate-900 font-mono leading-tight">
            18.7 <span className="text-[10px] font-semibold text-slate-500">km</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-1">
            Total Distance
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-sm text-center">
          <div className="text-base font-black text-slate-900 font-mono leading-tight">
            2.5 <span className="text-[10px] font-semibold text-slate-500">hrs</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-1">
            Total Time
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-sm text-center">
          <div className="text-base font-black text-slate-900 font-mono leading-tight">
            5
          </div>
          <div className="text-[10px] text-slate-500 mt-1">
            Workouts
          </div>
        </div>
      </div>

      {/* Goal Progress Card */}
      <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm mt-auto">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-900">Goal Progress</span>
          <span className="text-[11px] font-bold text-emerald-600">74%</span>
        </div>

        <div className="flex items-center space-x-3 mb-2.5">
          <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 flex-shrink-0">
            <Footprints className="w-4 h-4" />
          </div>
          <div className="text-xs text-slate-600 font-medium">
            18.7 of 25 km weekly goal
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
          <div
            className="bg-emerald-500 h-2.5 rounded-full transition-all duration-700"
            style={{ width: '74%' }}
          />
        </div>
      </div>
    </div>
  );
};
