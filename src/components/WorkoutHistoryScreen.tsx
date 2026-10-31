import React, { useState } from 'react';
import {
  History,
  Footprints,
  Zap,
  Calendar,
  Clock,
  Gauge,
  Flame,
  Heart,
  Search,
  Filter,
  ChevronRight,
  Trash2,
  Share2,
  X,
  Radio,
} from 'lucide-react';
import { ActivityType, Workout } from '../types';
import { formatDuration, calculatePace } from '../utils/fitness';
import { GpsMap } from './GpsMap';

interface WorkoutHistoryScreenProps {
  workouts: Workout[];
  onDeleteWorkout: (id: string) => void;
  onSelectWorkoutForDetail?: (workout: Workout) => void;
}

export const WorkoutHistoryScreen: React.FC<WorkoutHistoryScreenProps> = ({
  workouts,
  onDeleteWorkout,
  onSelectWorkoutForDetail,
}) => {
  const [filterType, setFilterType] = useState<'all' | ActivityType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModalWorkout, setActiveModalWorkout] = useState<Workout | null>(null);

  const filtered = workouts.filter((w) => {
    if (filterType !== 'all' && w.activityType !== filterType) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return (
        w.title.toLowerCase().includes(q) ||
        (w.notes && w.notes.toLowerCase().includes(q)) ||
        w.activityType.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalDistance = filtered.reduce((acc, w) => acc + w.distanceKm, 0);
  const totalCalories = filtered.reduce((acc, w) => acc + w.caloriesBurned, 0);
  const totalDuration = filtered.reduce((acc, w) => acc + w.durationSeconds, 0);

  return (
    <div className="space-y-6 pb-24 pt-2">
      {/* Title */}
      <div>
        <span className="text-xs uppercase font-bold tracking-wider text-emerald-400">
          Activity Log
        </span>
        <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
          Workout History
          <History className="w-5 h-5 text-emerald-400" />
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Review your completed runs, fitness walks, GPS routes, and biometrics.
        </p>
      </div>

      {/* Aggregate Stats */}
      <div className="grid grid-cols-3 gap-2.5 bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-sm">
        <div className="text-center">
          <div className="text-[10px] uppercase font-bold text-slate-500">Sessions</div>
          <div className="text-lg font-black font-mono text-slate-900 mt-0.5">
            {filtered.length}
          </div>
        </div>
        <div className="text-center border-l border-slate-200">
          <div className="text-[10px] uppercase font-bold text-slate-500">Distance</div>
          <div className="text-lg font-black font-mono text-emerald-600 mt-0.5">
            {totalDistance.toFixed(1)} <span className="text-xs font-semibold text-slate-500">km</span>
          </div>
        </div>
        <div className="text-center border-l border-slate-200">
          <div className="text-[10px] uppercase font-bold text-slate-500">Burned</div>
          <div className="text-lg font-black font-mono text-amber-600 mt-0.5">
            {totalCalories} <span className="text-xs font-semibold text-slate-500">kcal</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-2.5">
        <div className="flex gap-2">
          {(['all', 'running', 'walking'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`py-1.5 px-3 rounded-xl text-xs font-bold capitalize transition-all ${
                filterType === type
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search workouts or notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 shadow-sm"
          />
        </div>
      </div>

      {/* Workout Cards */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-12 bg-slate-900/40 border border-slate-800/80 rounded-3xl p-6">
            <History className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-300">No workouts found</h3>
            <p className="text-xs text-slate-500 mt-1">
              Start tracking a new run or walk to populate your history log!
            </p>
          </div>
        ) : (
          filtered.map((w) => {
            const pace = calculatePace(w.distanceKm, w.durationSeconds);
            return (
              <div
                key={w.id}
                onClick={() => setActiveModalWorkout(w)}
                className="cursor-pointer bg-slate-900/80 border border-slate-800 rounded-3xl p-4.5 hover:border-slate-700 transition-all shadow-md group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2.5 rounded-2xl ${
                      w.activityType === 'running'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                    }`}>
                      {w.activityType === 'running' ? <Zap className="w-5 h-5" /> : <Footprints className="w-5 h-5" />}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                        {w.title}
                      </h3>
                      <div className="text-[11px] text-slate-400 flex items-center space-x-2 mt-0.5">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(w.startTime).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                        <span>•</span>
                        <span>{new Date(w.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                  </div>

                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
                </div>

                {/* Metrics 4-Col */}
                <div className="grid grid-cols-4 gap-2 mt-3.5 pt-3 border-t border-slate-800/80 text-center">
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Distance</div>
                    <div className="text-xs font-mono font-bold text-white mt-0.5">
                      {w.distanceKm.toFixed(2)} km
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Time</div>
                    <div className="text-xs font-mono font-bold text-white mt-0.5">
                      {formatDuration(w.durationSeconds)}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Pace</div>
                    <div className="text-xs font-mono font-bold text-emerald-400 mt-0.5">
                      {pace.formatted}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Heart Rate</div>
                    <div className="text-xs font-mono font-bold text-rose-400 mt-0.5 flex items-center justify-center gap-1">
                      {w.avgHeartRate ? `${w.avgHeartRate} bpm` : '--'}
                    </div>
                  </div>
                </div>

                {/* NFC Tag or Notes Snippet */}
                {w.nfcTagId && (
                  <div className="mt-2.5 flex items-center space-x-1.5 text-[10px] text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded-md w-fit">
                    <Radio className="w-2.5 h-2.5" />
                    <span>NFC Session: {w.nfcTagId}</span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Workout Detail Modal */}
      {activeModalWorkout && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                  {activeModalWorkout.activityType === 'running' ? <Zap className="w-5 h-5" /> : <Footprints className="w-5 h-5" />}
                </span>
                <div>
                  <h3 className="text-base font-bold text-white">{activeModalWorkout.title}</h3>
                  <div className="text-xs text-slate-400">
                    {new Date(activeModalWorkout.startTime).toLocaleString()}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setActiveModalWorkout(null)}
                aria-label="Close workout details"
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* GPS Map View */}
            {activeModalWorkout.routeCoordinates && activeModalWorkout.routeCoordinates.length > 0 && (
              <div className="h-52 w-full rounded-2xl overflow-hidden border border-slate-800">
                <GpsMap
                  coordinates={activeModalWorkout.routeCoordinates}
                  className="h-full w-full"
                />
              </div>
            )}

            {/* Complete Metrics Breakdown */}
            <div className="grid grid-cols-3 gap-2.5 bg-slate-950/70 border border-slate-800 rounded-2xl p-3.5 text-center">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Distance</span>
                <div className="text-base font-mono font-black text-white mt-0.5">
                  {activeModalWorkout.distanceKm.toFixed(2)} km
                </div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Duration</span>
                <div className="text-base font-mono font-black text-white mt-0.5">
                  {formatDuration(activeModalWorkout.durationSeconds)}
                </div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Calories</span>
                <div className="text-base font-mono font-black text-rose-400 mt-0.5">
                  {activeModalWorkout.caloriesBurned} kcal
                </div>
              </div>
              <div className="pt-2 border-t border-slate-800/80">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Avg Pace</span>
                <div className="text-base font-mono font-black text-emerald-400 mt-0.5">
                  {calculatePace(activeModalWorkout.distanceKm, activeModalWorkout.durationSeconds).formatted}
                </div>
              </div>
              <div className="pt-2 border-t border-slate-800/80">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Avg Heart Rate</span>
                <div className="text-base font-mono font-black text-rose-400 mt-0.5">
                  {activeModalWorkout.avgHeartRate ? `${activeModalWorkout.avgHeartRate} bpm` : 'N/A'}
                </div>
              </div>
              <div className="pt-2 border-t border-slate-800/80">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Steps</span>
                <div className="text-base font-mono font-black text-cyan-400 mt-0.5">
                  {activeModalWorkout.steps || Math.round(activeModalWorkout.distanceKm * 1250)}
                </div>
              </div>
            </div>

            {/* Notes & Effort */}
            {activeModalWorkout.notes && (
              <div className="p-3 rounded-2xl bg-slate-950/50 border border-slate-800 text-xs">
                <span className="font-semibold text-slate-300">Workout Notes:</span>
                <p className="text-slate-400 mt-1 italic">"{activeModalWorkout.notes}"</p>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  onDeleteWorkout(activeModalWorkout.id);
                  setActiveModalWorkout(null);
                }}
                className="py-2.5 px-4 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Session</span>
              </button>

              <button
                onClick={() => setActiveModalWorkout(null)}
                className="flex-1 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
