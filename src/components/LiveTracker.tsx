import React, { useState, useEffect, useRef } from 'react';
import {
  MapPin,
  Pause,
  Play,
  Square,
  Heart,
} from 'lucide-react';
import { GPSCoordinate, UserProfile, Workout } from '../types';
import { HeartRateReading } from '../services/bleHeartRate';
import { GpsMap } from './GpsMap';
import { calculateCalories } from '../utils/fitness';
import { NotificationAudio } from '../services/notificationAudio';
import { StatusBar } from './StatusBar';

interface LiveTrackerProps {
  profile: UserProfile;
  heartRate: HeartRateReading | null;
  onFinishWorkout: (workout: Workout) => void;
  onBack: () => void;
}

// Scenic central park loop coordinates
const DEFAULT_MAP_PATH: GPSCoordinate[] = [
  { lat: 40.782091, lng: -73.968285, timestamp: Date.now() },
  { lat: 40.783134, lng: -73.966955, timestamp: Date.now() },
  { lat: 40.784523, lng: -73.965321, timestamp: Date.now() },
  { lat: 40.785842, lng: -73.964112, timestamp: Date.now() },
  { lat: 40.787112, lng: -73.963245, timestamp: Date.now() },
  { lat: 40.788534, lng: -73.963876, timestamp: Date.now() },
  { lat: 40.789812, lng: -73.965543, timestamp: Date.now() },
  { lat: 40.790923, lng: -73.967523, timestamp: Date.now() },
  { lat: 40.791591, lng: -73.969112, timestamp: Date.now() },
  { lat: 40.791812, lng: -73.971324, timestamp: Date.now() },
  { lat: 40.791211, lng: -73.973243, timestamp: Date.now() },
];

export const LiveTracker: React.FC<LiveTrackerProps> = ({
  profile,
  heartRate,
  onFinishWorkout,
  onBack,
}) => {
  const [isPaused, setIsPaused] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(754); // 00:12:34
  const [distanceKm, setDistanceKm] = useState(1.52); // 1.52 km
  const [coordinates, setCoordinates] = useState<GPSCoordinate[]>(DEFAULT_MAP_PATH);
  const [hrReadings, setHrReadings] = useState<number[]>([]);

  const intervalRef = useRef<any>(null);

  useEffect(() => {
    if (!isPaused) {
      intervalRef.current = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
        setDistanceKm((prev) => +(prev + 0.002).toFixed(2));
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPaused]);

  useEffect(() => {
    if (heartRate && heartRate.bpm > 0) {
      setHrReadings((prev) => [...prev, heartRate.bpm]);
    }
  }, [heartRate]);

  const handleTogglePause = () => {
    if (!isPaused) {
      setIsPaused(true);
      NotificationAudio.playPauseTone();
    } else {
      setIsPaused(false);
      NotificationAudio.playStartFanfare();
    }
  };

  const handleStop = () => {
    NotificationAudio.playVictoryFanfare();
    const finalCalories = calculateCalories('running', elapsedSeconds, profile.weightKg || 70, 8.5);
    const avgHr = hrReadings.length > 0
      ? Math.round(hrReadings.reduce((a, b) => a + b, 0) / hrReadings.length)
      : (heartRate?.bpm || 128);

    const workout: Workout = {
      id: `wkt_${Date.now()}`,
      userId: profile.id,
      activityType: 'running',
      title: `Outdoor Run (${distanceKm.toFixed(2)} km)`,
      startTime: Date.now() - elapsedSeconds * 1000,
      endTime: Date.now(),
      durationSeconds: elapsedSeconds,
      distanceKm: Number(distanceKm.toFixed(2)),
      caloriesBurned: finalCalories || 112,
      steps: Math.round(distanceKm * 1250),
      avgPaceSecondsPerKm: 470, // 7:50
      bestPaceSecondsPerKm: 430,
      avgHeartRate: avgHr,
      maxHeartRate: Math.max(avgHr + 14, 142),
      routeCoordinates: coordinates,
    };

    onFinishWorkout(workout);
  };

  const currentBpm = heartRate ? heartRate.bpm : 128;

  return (
    <div className="flex-1 min-h-[640px] flex flex-col justify-between bg-[#f8fafc] text-slate-800 px-5 pb-4">
      {/* Header */}
      <StatusBar
        title="Running"
        onBack={onBack}
        rightAction={
          <div className="flex items-center space-x-1 text-emerald-600 text-xs font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            <MapPin className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" />
            <span>GPS</span>
          </div>
        }
      />

      {/* Main Digital Clock Timer (00:12:34) */}
      <div className="text-center pt-3 pb-4">
        <div className="text-5xl font-black text-slate-900 font-mono tracking-tight">
          {(() => {
            const h = Math.floor(elapsedSeconds / 3600);
            const m = Math.floor((elapsedSeconds % 3600) / 60);
            const s = elapsedSeconds % 60;
            return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
          })()}
        </div>
        <div className="text-xs text-slate-500 font-medium mt-1">
          Time Elapsed
        </div>
      </div>

      {/* 3 Metric Cards Row: Distance, Pace, Heart Rate */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {/* Distance */}
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-sm text-center">
          <div className="text-lg font-black text-slate-900 font-mono leading-tight">
            {distanceKm.toFixed(2)}
          </div>
          <div className="text-[10px] text-slate-500 font-bold mt-0.5">
            km
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            Distance
          </div>
        </div>

        {/* Pace */}
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-sm text-center">
          <div className="text-lg font-black text-slate-900 font-mono leading-tight">
            7:50
          </div>
          <div className="text-[10px] text-slate-500 font-bold mt-0.5">
            min/km
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            Pace
          </div>
        </div>

        {/* Heart Rate */}
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-sm text-center">
          <div className="flex items-center justify-center space-x-1">
            <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500 animate-heart-pulse" />
            <span className="text-lg font-black text-slate-900 font-mono leading-tight">
              {currentBpm}
            </span>
          </div>
          <div className="text-[10px] text-slate-500 font-bold mt-0.5">
            BPM
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            Heart Rate
          </div>
        </div>
      </div>

      {/* Street Route Map View */}
      <div className="h-52 w-full rounded-3xl overflow-hidden border border-slate-200/90 shadow-sm mb-4 relative flex-shrink-0">
        <GpsMap
          coordinates={coordinates}
          interactive={true}
          className="h-full w-full"
        />
      </div>

      {/* Bottom Action Controls: Pause & Stop */}
      <div className="grid grid-cols-2 gap-3 mt-auto mb-2">
        <button
          onClick={handleTogglePause}
          className="py-3.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-bold text-xs flex items-center justify-center space-x-2 shadow-sm transition-all active:scale-[0.99]"
        >
          {isPaused ? <Play className="w-4 h-4 fill-slate-800 text-slate-800" /> : <Pause className="w-4 h-4 fill-slate-800 text-slate-800" />}
          <span>{isPaused ? 'Resume' : 'Pause'}</span>
        </button>

        <button
          onClick={handleStop}
          className="py-3.5 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-md shadow-rose-500/25 transition-all active:scale-[0.99]"
        >
          <Square className="w-4 h-4 fill-white" />
          <span>Stop</span>
        </button>
      </div>
    </div>
  );
};
