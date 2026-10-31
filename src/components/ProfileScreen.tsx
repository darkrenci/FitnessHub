import React, { useState } from 'react';
import {
  Flame,
  Settings,
  HelpCircle,
  LogOut,
  ChevronRight,
  Radio,
  Bell,
  User,
  Edit3,
  X,
  Check,
  CheckCircle2,
} from 'lucide-react';
import { StatusBar } from './StatusBar';
import { FitnessExperience, FitnessGoal, UserProfile, Workout } from '../types';
import { StorageService } from '../services/storage';

interface ProfileScreenProps {
  profile: UserProfile;
  workouts?: Workout[];
  onBack?: () => void;
  onUpdateProfile?: (updated: UserProfile) => void;
  onNavigateSettings?: () => void;
  onNavigateNfc?: () => void;
  onNavigateNotifications?: () => void;
  onLogOut?: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  profile,
  workouts = [],
  onBack,
  onUpdateProfile,
  onNavigateSettings,
  onNavigateNfc,
  onNavigateNotifications,
  onLogOut,
}) => {
  const [showEditModal, setShowEditModal] = useState(false);

  // Edit form state
  const [editName, setEditName] = useState(profile.name || '');
  const [editAge, setEditAge] = useState(profile.age || 28);
  const [editHeight, setEditHeight] = useState(profile.heightCm || 178);
  const [editWeight, setEditWeight] = useState(profile.weightKg || 73);
  const [editExperience, setEditExperience] = useState<FitnessExperience>(
    profile.fitnessExperience || 'intermediate'
  );
  const [editGoal, setEditGoal] = useState<FitnessGoal>(profile.primaryGoal || 'endurance');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Computed metrics
  const totalWorkouts = workouts.length > 0 ? workouts.length : 32;
  const totalDistanceKm =
    workouts.length > 0
      ? workouts.reduce((acc, w) => acc + (w.distanceKm || 0), 0).toFixed(1)
      : '87.4';

  const handleOpenEdit = () => {
    setEditName(profile.name);
    setEditAge(profile.age);
    setEditHeight(profile.heightCm);
    setEditWeight(profile.weightKg);
    setEditExperience(profile.fitnessExperience);
    setEditGoal(profile.primaryGoal);
    setShowEditModal(true);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = StorageService.updateProfile({
      name: editName.trim() || profile.name,
      age: Number(editAge) || profile.age,
      heightCm: Number(editHeight) || profile.heightCm,
      weightKg: Number(editWeight) || profile.weightKg,
      fitnessExperience: editExperience,
      primaryGoal: editGoal,
      maxHeartRateThreshold: Math.round(220 - (Number(editAge) || 28) * 0.85),
    });

    if (onUpdateProfile) {
      onUpdateProfile(updated);
    }

    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setShowEditModal(false);
    }, 600);
  };

  const goalDisplayNames: Record<FitnessGoal, string> = {
    endurance: 'Improve Endurance',
    daily_activity: 'Daily Activity',
    general_fitness: 'General Fitness',
    weight_loss: 'Weight Management',
  };

  return (
    <div className="flex flex-col min-h-[740px] bg-[#f8fafc] text-slate-800 px-5 pb-6">
      <StatusBar title="Profile" onBack={onBack} transparent />

      {/* Profile Header Avatar & Name */}
      <div className="flex flex-col items-center justify-center text-center pt-2 pb-5">
        <div className="relative mb-3">
          <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-slate-200 bg-white shadow-sm flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <circle cx="50" cy="50" r="50" fill="#e2e8f0" />
              <path d="M26 40C26 24 38 18 50 18C62 18 74 24 74 40C74 42 70 34 50 34C30 34 26 42 26 40Z" fill="#1e293b" />
              <circle cx="50" cy="52" r="24" fill="#ffdbac" />
              <ellipse cx="42" cy="50" rx="3" ry="4" fill="#1e293b" />
              <ellipse cx="58" cy="50" rx="3" ry="4" fill="#1e293b" />
              <path d="M43 60C46 64 54 64 57 60" stroke="#c05621" strokeWidth="2" strokeLinecap="round" />
              <path d="M20 95C25 80 40 76 50 76C60 76 75 80 80 95Z" fill="#059669" />
            </svg>
          </div>
          <button
            onClick={handleOpenEdit}
            title="Edit Profile"
            className="absolute bottom-0 right-0 p-1.5 rounded-full bg-emerald-500 text-white shadow-md hover:bg-emerald-600 transition-transform active:scale-95"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
        </div>

        <h2 className="text-base font-bold text-slate-900 tracking-tight">
          {profile.name || 'John Bill M. Barangan'}
        </h2>
        <span className="text-xs text-slate-500 font-medium mt-0.5">
          {profile.email || 'john.barangan@example.com'}
        </span>
        <div className="flex items-center gap-1.5 mt-1.5">
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/90 px-2 py-0.5 rounded-full capitalize">
            {profile.fitnessExperience || 'intermediate'}
          </span>
          <span className="text-[10px] font-semibold text-slate-600 bg-slate-200/80 px-2 py-0.5 rounded-full">
            {profile.age || 28} yrs • {profile.weightKg || 73} kg
          </span>
        </div>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-sm text-center">
          <div className="text-lg font-black text-slate-900 font-mono leading-tight">
            {totalWorkouts}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Workouts</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-sm text-center">
          <div className="text-lg font-black text-slate-900 font-mono leading-tight">
            {totalDistanceKm} <span className="text-[10px] font-semibold text-slate-500">km</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Total Distance</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-sm text-center">
          <div className="text-lg font-black text-slate-900 font-mono leading-tight">
            12 days
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Streak</div>
        </div>
      </div>

      {/* Settings / Menu List Container */}
      <div className="rounded-3xl bg-white border border-slate-200/90 p-2 space-y-1 shadow-sm mb-4">
        {/* Edit Profile & Personal Info */}
        <button
          onClick={handleOpenEdit}
          className="w-full flex items-center justify-between p-3.5 rounded-2xl hover:bg-slate-50 transition-colors text-left"
        >
          <div className="flex items-center space-x-3">
            <User className="w-5 h-5 text-emerald-600" />
            <div>
              <span className="text-xs font-bold text-slate-900 block">Personal Profile</span>
              <span className="text-[10px] text-slate-500">Update name, age, height & weight</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        {/* My Goals */}
        <button
          onClick={handleOpenEdit}
          className="w-full flex items-center justify-between p-3.5 rounded-2xl hover:bg-slate-50 transition-colors text-left"
        >
          <div className="flex items-center space-x-3">
            <Flame className="w-5 h-5 text-amber-500 fill-amber-500" />
            <span className="text-xs font-bold text-slate-900">My Goals</span>
          </div>
          <div className="flex items-center space-x-1.5 text-xs text-slate-500">
            <span>{goalDisplayNames[profile.primaryGoal] || 'Improve Endurance'}</span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>
        </button>

        {/* Settings */}
        {onNavigateSettings && (
          <button
            onClick={onNavigateSettings}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <Settings className="w-5 h-5 text-slate-600" />
              <span className="text-xs font-bold text-slate-900">Settings</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>
        )}

        {/* NFC Devices */}
        {onNavigateNfc && (
          <button
            onClick={onNavigateNfc}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <Radio className="w-5 h-5 text-teal-600" />
              <span className="text-xs font-bold text-slate-900">NFC Hardware & Devices</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>
        )}

        {/* Notifications */}
        {onNavigateNotifications && (
          <button
            onClick={onNavigateNotifications}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <Bell className="w-5 h-5 text-indigo-600" />
              <span className="text-xs font-bold text-slate-900">Notification Alerts</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>
        )}

        {/* Help & Support */}
        <div className="w-full flex items-center justify-between p-3.5 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer">
          <div className="flex items-center space-x-3">
            <HelpCircle className="w-5 h-5 text-slate-600" />
            <span className="text-xs font-bold text-slate-900">Help & Support</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </div>

        {/* Log Out */}
        <button
          onClick={onLogOut}
          className="w-full flex items-center space-x-3 p-3.5 rounded-2xl hover:bg-rose-50 text-rose-600 transition-colors"
        >
          <LogOut className="w-5 h-5 text-rose-600" />
          <span className="text-xs font-bold text-rose-600">Log Out</span>
        </button>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl border border-slate-200 p-6 w-full max-w-sm space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Edit Profile & Goals</h3>
                  <p className="text-[11px] text-slate-500">Update your biometric details</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {saveSuccess && (
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-semibold flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Profile updated successfully!</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1">
                    Age (yrs)
                  </label>
                  <input
                    type="number"
                    min="12"
                    max="100"
                    value={editAge}
                    onChange={(e) => setEditAge(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-2 text-xs text-slate-900 text-center font-bold focus:bg-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1">
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    min="100"
                    max="240"
                    value={editHeight}
                    onChange={(e) => setEditHeight(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-2 text-xs text-slate-900 text-center font-bold focus:bg-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    min="30"
                    max="250"
                    value={editWeight}
                    onChange={(e) => setEditWeight(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-2 text-xs text-slate-900 text-center font-bold focus:bg-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Primary Fitness Goal
                </label>
                <select
                  value={editGoal}
                  onChange={(e) => setEditGoal(e.target.value as FitnessGoal)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="endurance">Improve Endurance (Stamina)</option>
                  <option value="daily_activity">Increase Daily Activity</option>
                  <option value="general_fitness">General Fitness & Health</option>
                  <option value="weight_loss">Weight Management & Calorie Burn</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Experience Level
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['beginner', 'intermediate', 'advanced'] as FitnessExperience[]).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setEditExperience(lvl)}
                      className={`py-1.5 rounded-lg text-xs font-bold capitalize transition-colors ${
                        editExperience === lvl
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex space-x-2">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-md shadow-emerald-500/20"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
