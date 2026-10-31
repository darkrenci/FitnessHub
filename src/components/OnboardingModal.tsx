import React, { useState } from 'react';
import {
  TrendingUp,
  Sparkles,
  Footprints,
  Heart,
  Radio,
  Calendar,
  CheckCircle2,
  ArrowRight,
  Shield,
  Zap,
} from 'lucide-react';
import { FitnessExperience, FitnessGoal, UserProfile } from '../types';

interface OnboardingModalProps {
  onComplete: (profileUpdates?: Partial<UserProfile>) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ onComplete }) => {
  const [step, setStep] = useState<'welcome' | 'profile'>('welcome');

  // Profile setup fields
  const [name, setName] = useState('Alex Morgan');
  const [age, setAge] = useState(29);
  const [heightCm, setHeightCm] = useState(176);
  const [weightKg, setWeightKg] = useState(71);
  const [experience, setExperience] = useState<FitnessExperience>('intermediate');
  const [goal, setGoal] = useState<FitnessGoal>('endurance');
  const [targetWeeklyDistanceKm, setTargetWeeklyDistanceKm] = useState(25);

  const handleFinishCustom = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete({
      name,
      age: Number(age),
      heightCm: Number(heightCm),
      weightKg: Number(weightKg),
      fitnessExperience: experience,
      primaryGoal: goal,
      targetWeeklyDistanceKm: Number(targetWeeklyDistanceKm),
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-5">
        {step === 'welcome' ? (
          <div className="space-y-5 text-center">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/25">
              <TrendingUp className="w-8 h-8 text-slate-950 stroke-[2.5]" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                Welcome To
              </span>
              <h1 className="text-3xl font-black text-white tracking-tight mt-0.5">
                FitTrack Pro
              </h1>
              <p className="text-xs text-slate-400 mt-2 max-w-xs mx-auto leading-relaxed">
                Intelligent fitness monitoring with real-time GPS tracking, Bluetooth heart rate integration, NFC equipment identification, and daily adaptive guides.
              </p>
            </div>

            {/* Feature Highlights */}
            <div className="grid grid-cols-2 gap-2.5 text-left pt-1">
              <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                <div className="flex items-center space-x-2 text-emerald-400 mb-1">
                  <Footprints className="w-4 h-4" />
                  <span className="text-xs font-bold">GPS Tracker</span>
                </div>
                <p className="text-[10px] text-slate-400">Live distance, pace & route trail</p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                <div className="flex items-center space-x-2 text-rose-400 mb-1">
                  <Heart className="w-4 h-4" />
                  <span className="text-xs font-bold">Heart Rate</span>
                </div>
                <p className="text-[10px] text-slate-400">BLE 5-zone cardiovascular monitoring</p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                <div className="flex items-center space-x-2 text-teal-400 mb-1">
                  <Radio className="w-4 h-4" />
                  <span className="text-xs font-bold">NFC Tags</span>
                </div>
                <p className="text-[10px] text-slate-400">Tap shoes or gear to auto-launch</p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                <div className="flex items-center space-x-2 text-amber-400 mb-1">
                  <Calendar className="w-4 h-4" />
                  <span className="text-xs font-bold">Adaptive Guide</span>
                </div>
                <p className="text-[10px] text-slate-400">Dynamic 7-day personalized plan</p>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={() => onComplete()}
                className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm flex items-center justify-center space-x-2 shadow-xl shadow-emerald-500/25 active:scale-98 transition-all"
              >
                <span>Quick Start with Demo Account</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setStep('profile')}
                className="w-full py-2.5 rounded-xl text-slate-400 hover:text-white text-xs font-semibold transition-colors"
              >
                Set Up Custom Fitness Profile
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleFinishCustom} className="space-y-4 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400">
                Step 2 of 2
              </span>
              <h2 className="text-xl font-bold text-white mt-0.5">
                Set Your Fitness Profile & Goals
              </h2>
              <p className="text-slate-400 text-[11px] mt-0.5">
                Personalized heart rate zones and daily exercise guides rely on these metrics.
              </p>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Your Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Age</label>
                <input
                  type="number"
                  min="14"
                  max="100"
                  required
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1">Height (cm)</label>
                <input
                  type="number"
                  min="100"
                  max="230"
                  required
                  value={heightCm}
                  onChange={(e) => setHeightCm(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1">Weight (kg)</label>
                <input
                  type="number"
                  min="30"
                  max="200"
                  required
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Experience</label>
                <select
                  value={experience}
                  onChange={(e) => setExperience(e.target.value as FitnessExperience)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500 capitalize"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Primary Goal</label>
                <select
                  value={goal}
                  onChange={(e) => setGoal(e.target.value as FitnessGoal)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="endurance">Endurance</option>
                  <option value="daily_activity">Daily Activity</option>
                  <option value="general_fitness">General Fitness</option>
                  <option value="weight_loss">Weight Loss</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Weekly Target Distance (km)</label>
              <input
                type="number"
                min="5"
                max="100"
                value={targetWeeklyDistanceKm}
                onChange={(e) => setTargetWeeklyDistanceKm(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStep('welcome')}
                className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold"
              >
                Back
              </button>
              <button
                type="submit"
                className="flex-1 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black flex items-center justify-center space-x-1 shadow-lg shadow-emerald-500/25 active:scale-98 transition-all"
              >
                <span>Save & Enter App</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
