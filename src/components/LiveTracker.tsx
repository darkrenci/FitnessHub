import React, { useState, useEffect, useRef } from 'react';
import {
  MapPin,
  Pause,
  Play,
  Square,
  Heart,
  Navigation,
  Footprints,
  Flame,
  Clock,
  RotateCcw,
  CheckCircle2,
  Trash2,
  AlertTriangle,
  Radio,
} from 'lucide-react';
import { ActivityType, GPSCoordinate, UserProfile, Workout } from '../types';
import { HeartRateReading } from '../services/bleHeartRate';
import { GpsMap } from './GpsMap';
import { calculateCalories, calculateDistanceKm } from '../utils/fitness';
import { NotificationAudio } from '../services/notificationAudio';
import { StatusBar } from './StatusBar';

interface LiveTrackerProps {
  profile: UserProfile;
  heartRate: HeartRateReading | null;
  onFinishWorkout: (workout: Workout) => void;
  onBack: () => void;
}

type WorkoutState = 'ready' | 'running' | 'paused' | 'stopped';

export const LiveTracker: React.FC<LiveTrackerProps> = ({
  profile,
  heartRate,
  onFinishWorkout,
  onBack,
}) => {
  const [workoutState, setWorkoutState] = useState<WorkoutState>('ready');
  const [activityType, setActivityType] = useState<ActivityType>('running');

  // Workout metrics starting at zero
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [distanceKm, setDistanceKm] = useState(0);
  const [coordinates, setCoordinates] = useState<GPSCoordinate[]>([]);
  const [currentGps, setCurrentGps] = useState<GPSCoordinate | null>(null);
  const [gpsStatus, setGpsStatus] = useState<'acquiring' | 'locked' | 'unavailable'>('acquiring');
  const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(null);
  const [simulateMovement, setSimulateMovement] = useState<boolean>(false);
  const [hrReadings, setHrReadings] = useState<number[]>([]);

  const timerRef = useRef<any>(null);
  const watchIdRef = useRef<number | null>(null);
  const lastCoordRef = useRef<GPSCoordinate | null>(null);
  const simOriginRef = useRef<GPSCoordinate | null>(null);
  const simCoordRef = useRef<GPSCoordinate | null>(null);

  // Initialize Real Device GPS Geolocation
  useEffect(() => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      setGpsStatus('unavailable');
      return;
    }

    // Initial fix
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coord: GPSCoordinate = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          timestamp: pos.timestamp || Date.now(),
        };
        setCurrentGps(coord);
        setGpsAccuracy(Math.round(pos.coords.accuracy));
        setGpsStatus('locked');
      },
      (err) => {
        console.warn('Geolocation error:', err.message);
        setGpsStatus('unavailable');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 5000 }
    );
  }, []);

  // Heart Rate recording during active workout
  useEffect(() => {
    if (workoutState === 'running') {
      if (heartRate && heartRate.bpm > 0) {
        setHrReadings((prev) => [...prev, heartRate.bpm]);
      } else if (simulateMovement) {
        // Natural runner pulse simulation when indoors without hardware strap
        const baseBpm = activityType === 'running' ? 142 : 105;
        const jitter = Math.round(Math.sin(elapsedSeconds / 4) * 4);
        setHrReadings((prev) => [...prev, baseBpm + jitter]);
      }
    }
  }, [heartRate, workoutState, simulateMovement, elapsedSeconds, activityType]);

  // Main Timer & GPS Tracking Loop
  useEffect(() => {
    if (workoutState === 'running') {
      // Tick every second
      timerRef.current = setInterval(() => {
        setElapsedSeconds((s) => s + 1);

        // If indoor simulation is toggled on (realistic neighborhood street loop)
        if (simulateMovement) {
          const speedKmh = activityType === 'running' ? 9.6 : 4.8;
          const distDeltaKm = speedKmh / 3600; // ~0.00266 km/sec

          // Do NOT round prematurely to 2 decimals, or (0 + 0.0026).toFixed(2) returns 0 forever!
          setDistanceKm((prev) => prev + distDeltaKm);

          setCurrentGps((prev) => {
            if (!simOriginRef.current) {
              simOriginRef.current = prev || { lat: 14.5995, lng: 120.9842, timestamp: Date.now() };
              simCoordRef.current = { ...simOriginRef.current };
            }

            // Simulate turning at street corners around a 160-meter city block (4 legs of 20 seconds each)
            const legDuration = 20; // seconds per block side
            const currentLeg = Math.floor(elapsedSeconds / legDuration) % 4;
            const stepDeg = activityType === 'running' ? 0.000025 : 0.000013;

            let dLat = 0;
            let dLng = 0;

            if (currentLeg === 0) {
              // Leg 1: Run East along the street
              dLng = stepDeg;
            } else if (currentLeg === 1) {
              // Leg 2: Turn South down the cross street
              dLat = -stepDeg;
            } else if (currentLeg === 2) {
              // Leg 3: Turn West along parallel street
              dLng = -stepDeg;
            } else {
              // Leg 4: Turn North along return avenue back toward starting intersection
              dLat = stepDeg;
            }

            const current = simCoordRef.current || simOriginRef.current;
            const nextCoord: GPSCoordinate = {
              lat: +(current.lat + dLat).toFixed(7),
              lng: +(current.lng + dLng).toFixed(7),
              timestamp: Date.now(),
            };

            simCoordRef.current = nextCoord;
            setCoordinates((c) => [...c, nextCoord]);
            return nextCoord;
          });
        }
      }, 1000);

      // Start Real GPS Position Watcher if not simulating
      if (!simulateMovement && navigator.geolocation) {
        watchIdRef.current = navigator.geolocation.watchPosition(
          (pos) => {
            const newCoord: GPSCoordinate = {
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
              timestamp: pos.timestamp || Date.now(),
              accuracy: pos.coords.accuracy,
            } as any;

            setCurrentGps(newCoord);
            setGpsAccuracy(Math.round(pos.coords.accuracy));
            setGpsStatus('locked');

            if (lastCoordRef.current) {
              const deltaKm = calculateDistanceKm(
                lastCoordRef.current.lat,
                lastCoordRef.current.lng,
                newCoord.lat,
                newCoord.lng
              );
              // Only add if movement exceeds GPS jitter (> 2.5 meters)
              if (deltaKm > 0.0025) {
                // Keep exact floating point precision without premature truncation
                setDistanceKm((prev) => prev + deltaKm);
                setCoordinates((prev) => [...prev, newCoord]);
                lastCoordRef.current = newCoord;
              }
            } else {
              lastCoordRef.current = newCoord;
              setCoordinates((prev) => [...prev, newCoord]);
            }
          },
          (err) => {
            console.warn('GPS Watch error:', err);
            setGpsStatus('unavailable');
          },
          { enableHighAccuracy: true, maximumAge: 2000, timeout: 8000 }
        );
      }
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      if (watchIdRef.current !== null && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (watchIdRef.current !== null && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  }, [workoutState, simulateMovement, activityType, elapsedSeconds]);

  const handleStartWorkout = () => {
    setWorkoutState('running');
    NotificationAudio.playStartFanfare();
  };

  const handleTogglePause = () => {
    if (workoutState === 'running') {
      setWorkoutState('paused');
      NotificationAudio.playPauseTone();
    } else if (workoutState === 'paused') {
      setWorkoutState('running');
      NotificationAudio.playStartFanfare();
    }
  };

  const handleTriggerStop = () => {
    setWorkoutState('stopped');
  };

  const handleResumeFromModal = () => {
    setWorkoutState('running');
  };

  const handleDiscard = () => {
    // Reset back to ready without saving or polluting today's stats
    setWorkoutState('ready');
    setElapsedSeconds(0);
    setDistanceKm(0);
    setCoordinates([]);
    lastCoordRef.current = null;
  };

  const handleConfirmSave = () => {
    NotificationAudio.playVictoryFanfare();
    const finalCalories = calculateCalories(
      activityType,
      elapsedSeconds,
      profile.weightKg || 70,
      distanceKm > 0 ? (distanceKm / (elapsedSeconds / 3600)) : (activityType === 'running' ? 8.5 : 4.5)
    );

    const avgHr = hrReadings.length > 0
      ? Math.round(hrReadings.reduce((a, b) => a + b, 0) / hrReadings.length)
      : (heartRate?.bpm || undefined);

    const paceSecPerKm = distanceKm > 0 ? Math.round(elapsedSeconds / distanceKm) : 0;

    const workout: Workout = {
      id: `wkt_${Date.now()}`,
      userId: profile.id,
      activityType,
      title: `${activityType === 'running' ? 'Outdoor Run' : 'Outdoor Walk'} (${distanceKm.toFixed(2)} km)`,
      startTime: Date.now() - elapsedSeconds * 1000,
      endTime: Date.now(),
      durationSeconds: elapsedSeconds,
      distanceKm: Number(distanceKm.toFixed(2)),
      caloriesBurned: finalCalories || Math.round(distanceKm * 65),
      steps: Math.round(distanceKm * (activityType === 'running' ? 1200 : 1350)),
      avgPaceSecondsPerKm: paceSecPerKm,
      bestPaceSecondsPerKm: Math.max(0, paceSecPerKm - 25),
      avgHeartRate: avgHr,
      maxHeartRate: avgHr ? avgHr + 12 : undefined,
      routeCoordinates: coordinates,
    };

    onFinishWorkout(workout);
  };

  // Format pace as M:SS / km
  const formatPace = () => {
    if (distanceKm < 0.05 || elapsedSeconds < 5) return `--'--"`;
    const secPerKm = Math.round(elapsedSeconds / distanceKm);
    const m = Math.floor(secPerKm / 60);
    const s = secPerKm % 60;
    return `${m}'${s.toString().padStart(2, '0')}"`;
  };

  const formatTimer = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const currentBpmDisplay = heartRate && heartRate.bpm > 0 ? `${heartRate.bpm}` : '--';

  return (
    <div className="flex-1 min-h-[640px] flex flex-col justify-between bg-[#f8fafc] text-slate-800 px-5 pb-4">
      {/* Header */}
      <StatusBar
        title={activityType === 'running' ? 'Running Tracker' : 'Walking Tracker'}
        onBack={onBack}
        rightAction={
          <div
            className={`flex items-center space-x-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border transition-colors ${
              gpsStatus === 'locked'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : gpsStatus === 'acquiring'
                ? 'bg-amber-50 text-amber-700 border-amber-200'
                : 'bg-slate-100 text-slate-600 border-slate-200'
            }`}
            title={gpsAccuracy ? `Accuracy: ±${gpsAccuracy}m` : 'GPS Status'}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                gpsStatus === 'locked'
                  ? 'bg-emerald-500 animate-pulse'
                  : gpsStatus === 'acquiring'
                  ? 'bg-amber-500'
                  : 'bg-slate-400'
              }`}
            />
            <span>{gpsStatus === 'locked' ? 'GPS Active' : gpsStatus === 'acquiring' ? 'Searching GPS' : 'GPS Off'}</span>
          </div>
        }
      />

      {/* Main Digital Clock Timer */}
      <div className="text-center pt-2 pb-3">
        <div className="text-5xl font-black text-slate-900 font-mono tracking-tight">
          {formatTimer(elapsedSeconds)}
        </div>
        <div className="text-xs text-slate-500 font-semibold mt-1">
          {workoutState === 'ready'
            ? 'Ready to Start'
            : workoutState === 'paused'
            ? 'Workout Paused'
            : 'Time Elapsed'}
        </div>
      </div>

      {/* 3 Metric Cards: Distance, Pace, Heart Rate */}
      <div className="grid grid-cols-3 gap-3 mb-3">
        {/* Distance */}
        <div className="p-3 rounded-2xl bg-white border border-slate-200/90 shadow-sm text-center">
          <div className="text-lg font-black text-slate-900 font-mono leading-tight">
            {distanceKm.toFixed(2)}
          </div>
          <div className="text-[10px] text-slate-500 font-bold mt-0.5">km</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Distance</div>
        </div>

        {/* Pace */}
        <div className="p-3 rounded-2xl bg-white border border-slate-200/90 shadow-sm text-center">
          <div className="text-lg font-black text-slate-900 font-mono leading-tight">
            {formatPace()}
          </div>
          <div className="text-[10px] text-slate-500 font-bold mt-0.5">min/km</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Pace</div>
        </div>

        {/* Heart Rate */}
        <div className="p-3 rounded-2xl bg-white border border-slate-200/90 shadow-sm text-center">
          <div className="flex items-center justify-center space-x-1">
            <Heart
              className={`w-3.5 h-3.5 ${
                heartRate ? 'fill-rose-500 text-rose-500 animate-heart-pulse' : 'text-slate-400'
              }`}
            />
            <span className="text-lg font-black text-slate-900 font-mono leading-tight">
              {currentBpmDisplay}
            </span>
          </div>
          <div className="text-[10px] text-slate-500 font-bold mt-0.5">BPM</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Heart Rate</div>
        </div>
      </div>

      {/* Street Route Map View */}
      <div className="h-48 w-full rounded-3xl overflow-hidden border border-slate-200/90 shadow-sm mb-3 relative flex-shrink-0">
        <GpsMap
          coordinates={coordinates}
          currentLocation={currentGps}
          interactive={true}
          className="h-full w-full"
        />

        {/* Live GPS info overlay */}
        <div className="absolute top-2 left-2 z-20 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full border border-slate-200/80 text-[10px] text-slate-600 font-semibold shadow-sm flex items-center space-x-1">
          <MapPin className="w-3 h-3 text-emerald-600" />
          <span>
            {currentGps
              ? `${currentGps.lat.toFixed(4)}, ${currentGps.lng.toFixed(4)}`
              : 'Detecting Location...'}
          </span>
        </div>
      </div>

      {/* Mode Selectors in READY state */}
      {workoutState === 'ready' && (
        <div className="space-y-3 mt-auto">
          {/* Running vs Walking Toggle */}
          <div className="grid grid-cols-2 gap-2 bg-slate-200/70 p-1 rounded-2xl">
            <button
              type="button"
              onClick={() => setActivityType('running')}
              className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
                activityType === 'running'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Navigation className="w-3.5 h-3.5 text-emerald-600" />
              <span>Running</span>
            </button>
            <button
              type="button"
              onClick={() => setActivityType('walking')}
              className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
                activityType === 'walking'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Footprints className="w-3.5 h-3.5 text-teal-600" />
              <span>Walking</span>
            </button>
          </div>

          {/* Tracking Mode Card (Outdoor Real GPS vs Indoor Simulation) */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-3 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
                  <span>{simulateMovement ? 'Indoor Demo Simulation' : 'Outdoor Real GPS'}</span>
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full uppercase ${
                      simulateMovement
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {simulateMovement ? 'Demo Mode' : 'Real Hardware'}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  {simulateMovement
                    ? 'Simulates a neighborhood block jogging loop (for testing without walking).'
                    : 'Uses real phone satellite GPS as you walk or run along streets and sidewalks.'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSimulateMovement(!simulateMovement)}
                className={`w-10 h-5 rounded-full transition-colors relative p-0.5 shrink-0 ml-2 ${
                  simulateMovement ? 'bg-amber-500' : 'bg-slate-300'
                }`}
                title="Toggle between Real Outdoor GPS and Indoor Demo Simulation"
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    simulateMovement ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Main START WORKOUT Button */}
          <button
            type="button"
            onClick={handleStartWorkout}
            className="w-full py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-sm tracking-wide shadow-lg shadow-emerald-500/30 active:scale-[0.99] transition-all flex items-center justify-center space-x-2"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Start Workout</span>
          </button>
        </div>
      )}

      {/* Controls while RUNNING or PAUSED */}
      {(workoutState === 'running' || workoutState === 'paused') && (
        <div className="grid grid-cols-2 gap-3 mt-auto mb-1">
          <button
            type="button"
            onClick={handleTogglePause}
            className="py-3.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-bold text-xs flex items-center justify-center space-x-2 shadow-sm transition-all active:scale-[0.99]"
          >
            {workoutState === 'paused' ? (
              <>
                <Play className="w-4 h-4 fill-emerald-600 text-emerald-600" />
                <span className="text-emerald-700">Resume</span>
              </>
            ) : (
              <>
                <Pause className="w-4 h-4 fill-slate-800 text-slate-800" />
                <span>Pause</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleTriggerStop}
            className="py-3.5 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-md shadow-rose-500/25 transition-all active:scale-[0.99]"
          >
            <Square className="w-4 h-4 fill-white" />
            <span>Stop Workout</span>
          </button>
        </div>
      )}

      {/* WORKOUT STOP CONFIRMATION MODAL */}
      {workoutState === 'stopped' && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl border border-slate-200 p-6 w-full max-w-sm space-y-4 shadow-2xl animate-fade-in">
            <div className="text-center">
              <h3 className="text-lg font-black text-slate-900">
                {distanceKm < 0.05 && elapsedSeconds < 15
                  ? 'Workout Incomplete'
                  : 'Workout Summary'}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {distanceKm < 0.05 && elapsedSeconds < 15
                  ? 'Activity was stopped quickly (< 15 seconds).'
                  : 'Great effort! Review your session before saving.'}
              </p>
            </div>

            {/* Summary Metrics */}
            <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-200/90 text-center">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Time</span>
                <div className="text-sm font-black text-slate-900 font-mono">
                  {formatTimer(elapsedSeconds)}
                </div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Distance</span>
                <div className="text-sm font-black text-slate-900 font-mono">
                  {distanceKm.toFixed(2)} km
                </div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Burned</span>
                <div className="text-sm font-black text-slate-900 font-mono">
                  {Math.round(distanceKm * 65)} cal
                </div>
              </div>
            </div>

            {/* Warning if under 15s */}
            {distanceKm < 0.05 && elapsedSeconds < 15 && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  Discarding this session will prevent adding blank 0.00 km workouts to today's activity.
                </span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-2 pt-1">
              {/* Save Button */}
              <button
                type="button"
                onClick={handleConfirmSave}
                className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-md shadow-emerald-500/25 flex items-center justify-center space-x-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Save to Today's Activity</span>
              </button>

              {/* Discard Button (Prevents adding unwanted activity) */}
              <button
                type="button"
                onClick={handleDiscard}
                className="w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center space-x-2 transition-colors"
              >
                <Trash2 className="w-4 h-4 text-rose-500" />
                <span>Discard (Do Not Add to Today)</span>
              </button>

              {/* Resume button if stopped by accident */}
              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={handleResumeFromModal}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800"
                >
                  Resume tracking
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
