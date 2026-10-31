import React from 'react';
import {
  Star,
  Footprints,
  Droplet,
  BarChart2,
} from 'lucide-react';
import { StatusBar } from './StatusBar';

interface RecommendationsScreenProps {
  onBack: () => void;
}

export const RecommendationsScreen: React.FC<RecommendationsScreenProps> = ({
  onBack,
}) => {
  return (
    <div className="flex flex-col min-h-[760px] bg-[#f8fafc] text-slate-800 px-5 pb-6">
      <StatusBar title="Personalized Recommendations" onBack={onBack} transparent />

      {/* Primary Highlight Card */}
      <div className="p-5 rounded-3xl bg-emerald-50/80 border border-emerald-200 shadow-sm mb-6 mt-1">
        <div className="flex items-start space-x-3.5">
          {/* Green Star Badge */}
          <div className="w-11 h-11 rounded-2xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700 flex-shrink-0">
            <Star className="w-5 h-5 fill-emerald-600 text-emerald-600" />
          </div>

          <div>
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">
              You're doing great!
            </h2>
            <p className="text-xs text-slate-700 mt-1 leading-relaxed font-medium">
              Try increasing your workout duration to 30 minutes this week.
            </p>
          </div>
        </div>
      </div>

      {/* Other Suggestions Section */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Other Suggestions:
        </h3>

        {/* Suggestion 1: Rest day */}
        <div className="p-4 rounded-3xl bg-white border border-slate-200/90 flex items-center space-x-3.5 shadow-sm">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 flex-shrink-0">
            <Footprints className="w-5 h-5" />
          </div>
          <span className="text-xs text-slate-800 font-semibold">
            Take a rest day if you feel tired.
          </span>
        </div>

        {/* Suggestion 2: Hydration */}
        <div className="p-4 rounded-3xl bg-white border border-slate-200/90 flex items-center space-x-3.5 shadow-sm">
          <div className="w-10 h-10 rounded-2xl bg-sky-50 flex items-center justify-center text-sky-600 flex-shrink-0">
            <Droplet className="w-5 h-5 fill-sky-500 text-sky-500" />
          </div>
          <span className="text-xs text-slate-800 font-semibold">
            Stay hydrated before and after exercise.
          </span>
        </div>

        {/* Suggestion 3: Daily Steps */}
        <div className="p-4 rounded-3xl bg-white border border-slate-200/90 flex items-center space-x-3.5 shadow-sm">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 flex-shrink-0">
            <BarChart2 className="w-5 h-5" />
          </div>
          <span className="text-xs text-slate-800 font-semibold">
            Aim for 7,000+ steps daily.
          </span>
        </div>
      </div>
    </div>
  );
};
