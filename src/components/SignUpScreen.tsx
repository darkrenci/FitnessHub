import React, { useState } from 'react';
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Dumbbell,
  ArrowRight,
  ArrowLeft,
  Check,
  CheckCircle2,
  AlertCircle,
  Activity,
  Sparkles,
} from 'lucide-react';
import { StatusBar } from './StatusBar';
import { FitnessExperience, FitnessGoal, UserProfile } from '../types';
import { StorageService } from '../services/storage';

interface SignUpScreenProps {
  onBack: () => void;
  onSignUpSuccess: (profile: UserProfile) => void;
  onLoginClick: () => void;
}

export const SignUpScreen: React.FC<SignUpScreenProps> = ({
  onBack,
  onSignUpSuccess,
  onLoginClick,
}) => {
  const [step, setStep] = useState<1 | 2>(1);

  // Step 1: Account credentials
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Step 2: Health & Goals
  const [age, setAge] = useState<number>(26);
  const [heightCm, setHeightCm] = useState<number>(172);
  const [weightKg, setWeightKg] = useState<number>(68);
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('male');
  const [fitnessExperience, setFitnessExperience] = useState<FitnessExperience>('intermediate');
  const [primaryGoal, setPrimaryGoal] = useState<FitnessGoal>('endurance');
  const [preferredDays, setPreferredDays] = useState<string[]>(['Monday', 'Wednesday', 'Friday']);
  const [preferredDuration, setPreferredDuration] = useState<number>(30);

  // UI state
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const daysOfWeek = [
    { label: 'Mon', value: 'Monday' },
    { label: 'Tue', value: 'Tuesday' },
    { label: 'Wed', value: 'Wednesday' },
    { label: 'Thu', value: 'Thursday' },
    { label: 'Fri', value: 'Friday' },
    { label: 'Sat', value: 'Saturday' },
    { label: 'Sun', value: 'Sunday' },
  ];

  const goalsList: { id: FitnessGoal; title: string; desc: string; icon: string }[] = [
    { id: 'endurance', title: 'Improve Endurance', desc: 'Build stamina for longer runs & walks', icon: '🏃‍♂️' },
    { id: 'daily_activity', title: 'Daily Activity', desc: 'Stay active, hit step & movement goals', icon: '⚡' },
    { id: 'general_fitness', title: 'General Fitness', desc: 'Balanced cardio, strength & flexibility', icon: '💪' },
    { id: 'weight_loss', title: 'Weight Management', desc: 'Optimize calorie burn and healthy deficit', icon: '🔥' },
  ];

  const handleToggleDay = (day: string) => {
    if (preferredDays.includes(day)) {
      if (preferredDays.length > 1) {
        setPreferredDays(preferredDays.filter((d) => d !== day));
      }
    } else {
      setPreferredDays([...preferredDays, day]);
    }
  };

  const handleFillSample = () => {
    setName('Alex Johnson');
    setEmail('alex.johnson@example.com');
    setPassword('fitness2026');
    setConfirmPassword('fitness2026');
    setAge(27);
    setHeightCm(175);
    setWeightKg(69);
    setFitnessExperience('intermediate');
    setPrimaryGoal('endurance');
    setErrorMsg(null);
  };

  const validateStep1 = () => {
    setErrorMsg(null);
    if (!name.trim()) {
      setErrorMsg('Please enter your full name.');
      return false;
    }
    if (!email.trim() || !email.includes('@') || !email.includes('.')) {
      setErrorMsg('Please enter a valid email address.');
      return false;
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return false;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please re-enter.');
      return false;
    }

    // Check if email already taken
    const existing = StorageService.getUsers().find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase()
    );
    if (existing) {
      setErrorMsg('An account with this email already exists. Please log in.');
      return false;
    }

    return true;
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const res = StorageService.registerUser({
      name: name.trim(),
      email: email.trim(),
      password,
      profileData: {
        age: Number(age) || 25,
        heightCm: Number(heightCm) || 170,
        weightKg: Number(weightKg) || 70,
        gender,
        fitnessExperience,
        primaryGoal,
        preferredDays,
        preferredDurationMinutes: preferredDuration,
        targetWeeklyWorkouts: preferredDays.length,
        targetWeeklyDistanceKm: primaryGoal === 'endurance' ? 24 : 15,
        maxHeartRateThreshold: Math.round(220 - (Number(age) || 25) * 0.85),
      },
    });

    if (!res.success || !res.user) {
      setErrorMsg(res.error || 'Failed to create account. Please try again.');
      return;
    }

    setSuccessMsg('Account created successfully! Welcome to FitTrack.');
    setTimeout(() => {
      onSignUpSuccess(res.user!.profile);
    }, 600);
  };

  return (
    <div className="relative min-h-[780px] h-full flex flex-col justify-between bg-[#f8fafc] text-slate-800 px-5 pb-8 overflow-y-auto">
      <StatusBar
        title={step === 1 ? 'Create Account' : 'Fitness Profile'}
        onBack={() => {
          if (step === 2) setStep(1);
          else onBack();
        }}
        transparent
      />

      <div className="flex-1 flex flex-col justify-start max-w-sm mx-auto w-full py-2">
        {/* Step Progress Pills */}
        <div className="flex items-center justify-between mb-4 px-1">
          <div className="flex items-center space-x-2">
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black transition-colors ${
                step >= 1 ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'
              }`}
            >
              1
            </span>
            <span className="text-xs font-bold text-slate-700">Account</span>
          </div>

          <div className="flex-1 h-0.5 mx-3 bg-slate-200">
            <div
              className={`h-full bg-emerald-500 transition-all duration-300 ${
                step === 2 ? 'w-full' : 'w-0'
              }`}
            />
          </div>

          <div className="flex items-center space-x-2">
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black transition-colors ${
                step === 2 ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'
              }`}
            >
              2
            </span>
            <span className="text-xs font-bold text-slate-700">Goals</span>
          </div>
        </div>

        {/* Feedback Alerts */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* STEP 1: CREDENTIALS */}
        {step === 1 && (
          <form onSubmit={handleNextStep} className="space-y-3.5">
            <div className="text-left mb-2">
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                Join FitTrack
              </h2>
              <p className="text-xs text-slate-500">
                Track your workouts, pulse, and daily fitness routines.
              </p>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1 ml-1 uppercase tracking-wider">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Johnson"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-2xl pl-11 pr-4 py-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 shadow-sm transition-colors"
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1 ml-1 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                <input
                  type="email"
                  required
                  placeholder="alex@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-2xl pl-11 pr-4 py-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 shadow-sm transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1 ml-1 uppercase tracking-wider">
                Password (min 6 characters)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-2xl pl-11 pr-11 py-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 shadow-sm transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1 ml-1 uppercase tracking-wider">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Repeat your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-2xl pl-11 pr-4 py-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 shadow-sm transition-colors"
                />
              </div>
            </div>

            {/* Quick Demo Pre-fill Button */}
            <div className="pt-1 flex justify-end">
              <button
                type="button"
                onClick={handleFillSample}
                className="text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 flex items-center space-x-1"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Fill sample data</span>
              </button>
            </div>

            {/* Continue Button */}
            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-sm tracking-wide shadow-lg shadow-emerald-500/25 active:scale-[0.99] transition-all flex items-center justify-center space-x-2 mt-2"
            >
              <span>Next: Body & Goals</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </form>
        )}

        {/* STEP 2: BODY & GOALS */}
        {step === 2 && (
          <form onSubmit={handleFinalSubmit} className="space-y-4">
            <div className="text-left mb-1">
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                Personalize Your Plan
              </h2>
              <p className="text-xs text-slate-500">
                Helps calculate accurate calories, heart rate zones, and schedules.
              </p>
            </div>

            {/* Age, Height, Weight Grid */}
            <div className="grid grid-cols-3 gap-2.5">
              <div className="bg-white p-3 rounded-2xl border border-slate-300 shadow-sm text-center">
                <label className="block text-[10px] font-bold text-slate-500 uppercase">Age</label>
                <input
                  type="number"
                  min="12"
                  max="100"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full text-center font-black text-base text-slate-900 focus:outline-none pt-1"
                />
                <span className="text-[10px] text-slate-400">years</span>
              </div>

              <div className="bg-white p-3 rounded-2xl border border-slate-300 shadow-sm text-center">
                <label className="block text-[10px] font-bold text-slate-500 uppercase">Height</label>
                <input
                  type="number"
                  min="100"
                  max="240"
                  value={heightCm}
                  onChange={(e) => setHeightCm(Number(e.target.value))}
                  className="w-full text-center font-black text-base text-slate-900 focus:outline-none pt-1"
                />
                <span className="text-[10px] text-slate-400">cm</span>
              </div>

              <div className="bg-white p-3 rounded-2xl border border-slate-300 shadow-sm text-center">
                <label className="block text-[10px] font-bold text-slate-500 uppercase">Weight</label>
                <input
                  type="number"
                  min="30"
                  max="250"
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                  className="w-full text-center font-black text-base text-slate-900 focus:outline-none pt-1"
                />
                <span className="text-[10px] text-slate-400">kg</span>
              </div>
            </div>

            {/* Fitness Experience Level */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1.5 ml-1 uppercase tracking-wider">
                Fitness Experience
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['beginner', 'intermediate', 'advanced'] as FitnessExperience[]).map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setFitnessExperience(level)}
                    className={`py-2 px-2 rounded-xl text-xs font-bold capitalize transition-all border ${
                      fitnessExperience === level
                        ? 'bg-emerald-500 text-white border-emerald-600 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Primary Fitness Goal */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1.5 ml-1 uppercase tracking-wider">
                Primary Fitness Goal
              </label>
              <div className="space-y-2">
                {goalsList.map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setPrimaryGoal(g.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-2xl border text-left transition-all ${
                      primaryGoal === g.id
                        ? 'bg-emerald-50/80 border-emerald-500 text-emerald-950 shadow-sm ring-1 ring-emerald-500'
                        : 'bg-white border-slate-300/80 hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">{g.icon}</span>
                      <div>
                        <div className="text-xs font-bold text-slate-900">{g.title}</div>
                        <div className="text-[10px] text-slate-500">{g.desc}</div>
                      </div>
                    </div>
                    {primaryGoal === g.id && (
                      <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Preferred Workout Days */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1.5 ml-1 uppercase tracking-wider">
                Preferred Exercise Days
              </label>
              <div className="grid grid-cols-7 gap-1">
                {daysOfWeek.map((day) => {
                  const active = preferredDays.includes(day.value);
                  return (
                    <button
                      key={day.value}
                      type="button"
                      onClick={() => handleToggleDay(day.value)}
                      className={`py-2 rounded-xl text-[11px] font-bold transition-all ${
                        active
                          ? 'bg-emerald-500 text-white shadow-sm'
                          : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {day.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Preferred Duration */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1.5 ml-1 uppercase tracking-wider">
                Target Workout Duration
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[15, 30, 45, 60].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setPreferredDuration(mins)}
                    className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                      preferredDuration === mins
                        ? 'bg-emerald-500 text-white border-emerald-600 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {mins} min
                  </button>
                ))}
              </div>
            </div>

            {/* Buttons */}
            <div className="pt-2 space-y-2">
              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-sm tracking-wide shadow-lg shadow-emerald-500/25 active:scale-[0.99] transition-all flex items-center justify-center space-x-2"
              >
                <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                <span>Complete Registration & Start</span>
              </button>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full py-2.5 rounded-2xl bg-transparent hover:bg-slate-100 text-slate-600 font-semibold text-xs transition-colors flex items-center justify-center space-x-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Account Details</span>
              </button>
            </div>
          </form>
        )}

        {/* Switch to Log In */}
        <div className="text-center mt-6 pt-3 border-t border-slate-200/80">
          <span className="text-xs text-slate-500">Already have an account? </span>
          <button
            type="button"
            onClick={onLoginClick}
            className="text-xs font-bold text-emerald-600 hover:text-emerald-700"
          >
            Log In
          </button>
        </div>
      </div>
    </div>
  );
};
