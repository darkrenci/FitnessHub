import React from 'react';
import {
  Heart,
  Flame,
  Footprints,
  Play,
  ArrowRight,
  Lightbulb,
} from 'lucide-react';
import { DailyExerciseItem, UserProfile, Workout } from '../types';
import { HeartRateReading } from '../services/bleHeartRate';
import { StatusBar } from './StatusBar';

interface HomeScreenProps {
  profile: UserProfile;
  workouts: Workout[];
  todayGuide?: DailyExerciseItem;
  heartRate: HeartRateReading | null;
  onStartWorkout: () => void;
  onOpenGuide: () => void;
  onOpenHeartRate: () => void;
  onOpenProfile: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  profile,
  workouts,
  todayGuide,
  heartRate,
  onStartWorkout,
  onOpenGuide,
  onOpenHeartRate,
  onOpenProfile,
}) => {
  // Today's aggregated activity
  const todayWorkouts = workouts.filter(
    (w) => new Date(w.startTime).toDateString() === new Date().toDateString()
  );

  const todayDistance = todayWorkouts.length > 0
    ? todayWorkouts.reduce((acc, w) => acc + w.distanceKm, 0)
    : 3.25;

  const todayMinutes = todayWorkouts.length > 0
    ? Math.round(todayWorkouts.reduce((acc, w) => acc + w.durationSeconds, 0) / 60)
    : 28;

  const todayCalories = todayWorkouts.length > 0
    ? todayWorkouts.reduce((acc, w) => acc + w.caloriesBurned, 0)
    : 312;

  const todaySteps = todayWorkouts.length > 0
    ? todayWorkouts.reduce((acc, w) => acc + (w.steps || Math.round(w.distanceKm * 1250)), 0)
    : 4892;

  const currentBpm = heartRate ? heartRate.bpm : 72;

  return (
    <div className="flex-1 min-h-[640px] flex flex-col justify-between bg-[#f8fafc] text-slate-800 px-5 pb-5">
      {/* Greeting Header */}
      <div className="flex items-center justify-between pt-5 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Hello, {profile.name ? profile.name.split(' ')[0] : 'John'}!
          </h1>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            Keep going! You're on track! 💪
          </p>
        </div>

        {/* Profile Avatar */}
        <button
          onClick={onOpenProfile}
          aria-label="Open Profile"
          className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-slate-200 hover:border-emerald-500 transition-colors bg-white flex items-center justify-center shadow-sm"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="50" fill="#e2e8f0" />
            <path d="M26 40C26 24 38 18 50 18C62 18 74 24 74 40C74 42 70 34 50 34C30 34 26 42 26 40Z" fill="#1e293b" />
            <circle cx="50" cy="52" r="24" fill="#ffdbac" />
            <ellipse cx="42" cy="50" rx="3" ry="4" fill="#1e293b" />
            <ellipse cx="58" cy="50" rx="3" ry="4" fill="#1e293b" />
            <path d="M43 60C46 64 54 64 57 60" stroke="#c05621" strokeWidth="2" strokeLinecap="round" />
            <path d="M20 95C25 80 40 76 50 76C60 76 75 80 80 95Z" fill="#059669" />
          </svg>
        </button>
      </div>

      {/* Today's Activity Card */}
      <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm mb-4 flex items-center justify-between">
        <div>
          <span className="text-xs text-slate-500 font-semibold tracking-wide uppercase">
            Today's Activity
          </span>
          <div className="flex items-baseline space-x-1.5 mt-1">
            <span className="text-3xl font-black text-slate-900 font-mono tracking-tight">
              {todayDistance.toFixed(2)}
            </span>
            <span className="text-sm font-bold text-slate-600">km</span>
          </div>
          <div className="text-xs text-slate-500 font-medium mt-1">
            {todayMinutes} min • {todayCalories} cal
          </div>
        </div>

        {/* Circular Progress Ring */}
        <div className="relative w-20 h-20 flex items-center justify-center">
          <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
            {/* Background Track */}
            <circle
              cx="40"
              cy="40"
              r="32"
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="6"
            />
            {/* Progress Arc (~65%) */}
            <circle
              cx="40"
              cy="40"
              r="32"
              fill="none"
              stroke="#10b981"
              strokeWidth="6"
              strokeDasharray="201"
              strokeDashoffset="65"
              strokeLinecap="round"
            />
          </svg>
          {/* Inner Runner Icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
              <Footprints className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* 3 Metric Cards Row (Heart Rate, Cal, Steps) */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {/* Heart Rate Card */}
        <div
          onClick={onOpenHeartRate}
          className="cursor-pointer p-3.5 rounded-2xl bg-white border border-slate-200/90 hover:border-rose-300 shadow-sm transition-all flex flex-col items-center justify-center text-center group"
        >
          <div className="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 mb-1.5">
            <Heart className="w-4 h-4 fill-rose-500 text-rose-500 animate-heart-pulse" />
          </div>
          <div className="text-lg font-black text-slate-900 font-mono leading-tight">
            {currentBpm}
          </div>
          <div className="text-[10px] font-bold text-slate-500 mt-0.5">
            BPM
          </div>
        </div>

        {/* Calories Card */}
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col items-center justify-center text-center">
          <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center text-amber-500 mb-1.5">
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>
          <div className="text-lg font-black text-slate-900 font-mono leading-tight">
            {todayCalories}
          </div>
          <div className="text-[10px] font-bold text-slate-500 mt-0.5">
            Cal
          </div>
        </div>

        {/* Steps Card */}
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col items-center justify-center text-center">
          <div className="w-8 h-8 rounded-full bg-sky-50 flex items-center justify-center text-sky-600 mb-1.5">
            <Footprints className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-lg font-black text-slate-900 font-mono leading-tight">
            {todaySteps.toLocaleString()}
          </div>
          <div className="text-[10px] font-bold text-slate-500 mt-0.5">
            Steps
          </div>
        </div>
      </div>

      {/* Today's Guide Card */}
      <div
        onClick={onOpenGuide}
        className="cursor-pointer p-4 rounded-3xl bg-amber-50/70 border border-amber-200/70 hover:border-amber-300 transition-all flex items-center justify-between mb-5 shadow-sm"
      >
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 flex-shrink-0">
            <Lightbulb className="w-5 h-5 fill-amber-500 text-amber-500" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900">Today's Guide</div>
            <div className="text-[11px] text-slate-600 mt-0.5">
              {todayGuide?.title || 'Try a 20-min brisk walk for better endurance.'}
            </div>
          </div>
        </div>

        <div className="w-7 h-7 rounded-full bg-white shadow-sm flex items-center justify-center text-amber-600">
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>

      {/* Big Start Workout Button */}
      <div className="mt-auto pt-2">
        <button
          onClick={onStartWorkout}
          className="w-full py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-sm flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/25 active:scale-[0.99] transition-all"
        >
          <Play className="w-4 h-4 fill-white text-white" />
          <span>Start Workout</span>
        </button>
      </div>
    </div>
  );
};
