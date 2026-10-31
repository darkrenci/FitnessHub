import React, { useState } from 'react';
import {
  Bell,
  Star,
  Heart,
  Info,
} from 'lucide-react';
import { StatusBar } from './StatusBar';
import { NotificationAudio } from '../services/notificationAudio';

interface NotificationsScreenProps {
  onBack: () => void;
}

export const NotificationsScreen: React.FC<NotificationsScreenProps> = ({
  onBack,
}) => {
  const [workoutReminders, setWorkoutReminders] = useState(true);
  const [achievementAlerts, setAchievementAlerts] = useState(true);
  const [heartRateAlerts, setHeartRateAlerts] = useState(true);

  const handleToggle = (type: 'workout' | 'achievement' | 'heartRate') => {
    if (type === 'workout') {
      setWorkoutReminders(!workoutReminders);
      NotificationAudio.playCountdownPip();
    } else if (type === 'achievement') {
      setAchievementAlerts(!achievementAlerts);
      NotificationAudio.playCountdownPip();
    } else {
      setHeartRateAlerts(!heartRateAlerts);
      NotificationAudio.playCountdownPip();
    }
  };

  return (
    <div className="flex flex-col min-h-[760px] bg-[#f8fafc] text-slate-800 px-5 pb-6">
      <StatusBar title="Notifications" onBack={onBack} transparent />

      {/* Notifications Toggle List */}
      <div className="space-y-3 mt-2">
        {/* Workout Reminders */}
        <div className="p-4 rounded-3xl bg-white border border-slate-200/90 flex items-center justify-between shadow-sm">
          <div className="flex items-start space-x-3.5 pr-2">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 flex-shrink-0 mt-0.5">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">Workout Reminders</div>
              <div className="text-[11px] text-slate-500 mt-0.5 leading-tight">
                Get notified before your scheduled workout.
              </div>
            </div>
          </div>

          <button
            onClick={() => handleToggle('workout')}
            aria-label="Toggle workout reminders"
            className={`w-12 h-6 rounded-full transition-colors relative flex items-center px-0.5 flex-shrink-0 ${
              workoutReminders ? 'bg-emerald-500' : 'bg-slate-200'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-200 ${
                workoutReminders ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Achievement Alerts */}
        <div className="p-4 rounded-3xl bg-white border border-slate-200/90 flex items-center justify-between shadow-sm">
          <div className="flex items-start space-x-3.5 pr-2">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 flex-shrink-0 mt-0.5">
              <Star className="w-5 h-5 fill-amber-500" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">Achievement Alerts</div>
              <div className="text-[11px] text-slate-500 mt-0.5 leading-tight">
                Celebrate your personal workout milestones!
              </div>
            </div>
          </div>

          <button
            onClick={() => handleToggle('achievement')}
            aria-label="Toggle achievement alerts"
            className={`w-12 h-6 rounded-full transition-colors relative flex items-center px-0.5 flex-shrink-0 ${
              achievementAlerts ? 'bg-emerald-500' : 'bg-slate-200'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-200 ${
                achievementAlerts ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Heart Rate Alerts */}
        <div className="p-4 rounded-3xl bg-white border border-slate-200/90 flex items-center justify-between shadow-sm">
          <div className="flex items-start space-x-3.5 pr-2">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500 flex-shrink-0 mt-0.5">
              <Heart className="w-5 h-5 fill-rose-500" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">Heart Rate Alerts</div>
              <div className="text-[11px] text-slate-500 mt-0.5 leading-tight">
                Get notified if your heart rate is too high.
              </div>
            </div>
          </div>

          <button
            onClick={() => handleToggle('heartRate')}
            aria-label="Toggle heart rate alerts"
            className={`w-12 h-6 rounded-full transition-colors relative flex items-center px-0.5 flex-shrink-0 ${
              heartRateAlerts ? 'bg-emerald-500' : 'bg-slate-200'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-200 ${
                heartRateAlerts ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Info Callout Card */}
      <div className="p-4 rounded-3xl bg-sky-50 border border-sky-200 flex items-center space-x-3.5 mt-auto shadow-sm">
        <div className="w-9 h-9 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 flex-shrink-0">
          <Info className="w-5 h-5" />
        </div>
        <p className="text-xs text-slate-700 font-medium leading-relaxed">
          Your notifications help you stay on track and maintain consistent workout discipline!
        </p>
      </div>
    </div>
  );
};
