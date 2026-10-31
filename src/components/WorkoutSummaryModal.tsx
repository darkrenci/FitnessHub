import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Award,
  CheckCircle2,
  Share2,
} from 'lucide-react';
import { UserProfile, Workout } from '../types';
import { calculatePace, formatDuration, getZoneForBpm } from '../utils/fitness';
import { GpsMap } from './GpsMap';

interface WorkoutSummaryModalProps {
  workout: Workout;
  profile: UserProfile;
  onClose: () => void;
  onSaveNotes: (notes: string, effort: number) => void;
}

export const WorkoutSummaryModal: React.FC<WorkoutSummaryModalProps> = ({
  workout,
  profile,
  onClose,
  onSaveNotes,
}) => {
  const [notes, setNotes] = useState(workout.notes || '');
  const [effort, setEffort] = useState(workout.perceivedEffort || 7);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#10b981', '#06b6d4', '#f59e0b', '#3b82f6'],
      });
    } catch (e) {}
  }, []);

  const pace = calculatePace(workout.distanceKm, workout.durationSeconds);
  const hrZone = workout.avgHeartRate ? getZoneForBpm(workout.avgHeartRate, profile.age) : null;

  const handleShare = () => {
    const text = `I just finished a ${workout.distanceKm.toFixed(2)} km ${workout.activityType} in ${formatDuration(workout.durationSeconds)} with FitTrack! 🏃🔥`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleFinish = () => {
    onSaveNotes(notes, effort);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg max-h-[92vh] overflow-y-auto p-5 sm:p-6 shadow-2xl space-y-4">
        {/* Header Celebration */}
        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto mb-2 shadow-sm">
            <Award className="w-6 h-6" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
            Workout Completed!
          </span>
          <h2 className="text-2xl font-black text-slate-900">
            Outstanding Effort!
          </h2>
          <p className="text-xs text-slate-500">
            Your workout has been saved to your personal activity history.
          </p>
        </div>

        {/* GPS Route Map Preview */}
        {workout.routeCoordinates && workout.routeCoordinates.length > 0 && (
          <div className="h-44 w-full rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
            <GpsMap
              coordinates={workout.routeCoordinates}
              className="h-full w-full"
            />
          </div>
        )}

        {/* Primary Metrics Grid */}
        <div className="grid grid-cols-3 gap-2.5 bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-center">
          <div>
            <div className="text-[10px] text-slate-500 uppercase font-bold">Distance</div>
            <div className="text-2xl font-black font-mono text-slate-900 mt-0.5">
              {workout.distanceKm.toFixed(2)}
            </div>
            <div className="text-[10px] text-slate-500">Kilometers</div>
          </div>

          <div className="border-l border-slate-200">
            <div className="text-[10px] text-slate-500 uppercase font-bold">Duration</div>
            <div className="text-2xl font-black font-mono text-slate-900 mt-0.5">
              {formatDuration(workout.durationSeconds)}
            </div>
            <div className="text-[10px] text-slate-500">Time</div>
          </div>

          <div className="border-l border-slate-200">
            <div className="text-[10px] text-slate-500 uppercase font-bold">Calories</div>
            <div className="text-2xl font-black font-mono text-amber-600 mt-0.5">
              {workout.caloriesBurned}
            </div>
            <div className="text-[10px] text-slate-500">Kcal</div>
          </div>

          <div className="pt-2.5 border-t border-slate-200">
            <div className="text-[10px] text-slate-500 uppercase font-bold">Average Pace</div>
            <div className="text-base font-black font-mono text-emerald-600 mt-0.5">
              {pace.formatted}
            </div>
          </div>

          <div className="pt-2.5 border-t border-slate-200 border-l border-slate-200">
            <div className="text-[10px] text-slate-500 uppercase font-bold">Heart Rate</div>
            <div className="text-base font-black font-mono text-rose-500 mt-0.5">
              {workout.avgHeartRate ? `${workout.avgHeartRate} bpm` : 'No sensor'}
            </div>
            {hrZone && (
              <div className="text-[9px] text-slate-500">
                {hrZone.name.split(':')[0]}
              </div>
            )}
          </div>

          <div className="pt-2.5 border-t border-slate-200 border-l border-slate-200">
            <div className="text-[10px] text-slate-500 uppercase font-bold">Total Steps</div>
            <div className="text-base font-black font-mono text-sky-600 mt-0.5">
              {workout.steps}
            </div>
          </div>
        </div>

        {/* Perceived Exertion (RPE 1-10) */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
          <div className="flex justify-between items-center">
            <span className="text-slate-700 font-semibold">Perceived Exertion (RPE):</span>
            <span className="font-mono font-bold text-emerald-600">{effort} / 10</span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            value={effort}
            onChange={(e) => setEffort(Number(e.target.value))}
            aria-label="Perceived exertion slider"
            className="w-full accent-emerald-500 cursor-pointer"
          />
        </div>

        {/* Workout Notes */}
        <div>
          <label className="block text-slate-600 text-xs font-semibold mb-1">
            Workout Notes / How did you feel?
          </label>
          <input
            type="text"
            placeholder="e.g. Great morning tempo, felt very relaxed, smooth cadence..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 shadow-sm"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <button
            onClick={handleShare}
            className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors border border-slate-300"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copied ? 'Copied!' : 'Share'}</span>
          </button>

          <button
            onClick={handleFinish}
            className="flex-1 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/25 active:scale-[0.99] transition-all"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Save & Return to Home</span>
          </button>
        </div>
      </div>
    </div>
  );
};
