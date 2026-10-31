import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Footprints,
  Plus,
} from 'lucide-react';
import { StatusBar } from './StatusBar';

interface ScheduleScreenProps {
  onBack?: () => void;
  onViewAll?: () => void;
  onAddScheduleClick?: () => void;
}

export const ScheduleScreen: React.FC<ScheduleScreenProps> = ({
  onBack,
  onViewAll,
  onAddScheduleClick,
}) => {
  const [selectedDay, setSelectedDay] = useState(30);

  const [workoutsList, setWorkoutsList] = useState([
    {
      id: '1',
      title: 'Run • 30 min',
      timeText: 'Today • 6:00 PM',
      type: 'running',
      enabled: true,
    },
    {
      id: '2',
      title: 'Walk • 20 min',
      timeText: 'Sat, Nov 1 • 7:00 AM',
      type: 'walking',
      enabled: true,
    },
  ]);

  const toggleWorkout = (id: string) => {
    setWorkoutsList((prev) =>
      prev.map((w) => (w.id === id ? { ...w, enabled: !w.enabled } : w))
    );
  };

  const calendarDays = [
    { dayName: 'Sun', date: 26 },
    { dayName: 'Mon', date: 27 },
    { dayName: 'Tue', date: 28 },
    { dayName: 'Wed', date: 29 },
    { dayName: 'Thu', date: 30 },
    { dayName: 'Fri', date: 31 },
    { dayName: 'Sat', date: 1 },
  ];

  return (
    <div className="flex flex-col min-h-[740px] bg-[#f8fafc] text-slate-800 px-5 pb-6">
      <StatusBar title="Schedule" onBack={onBack} transparent />

      {/* Calendar Widget Card */}
      <div className="p-4 rounded-3xl bg-white border border-slate-200/90 mb-5 shadow-sm">
        {/* Month Navigation */}
        <div className="flex items-center justify-between px-2 mb-3">
          <button aria-label="Previous Month" className="p-1 text-slate-500 hover:text-slate-800 rounded-lg">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-bold text-slate-900 tracking-wide">
            October 2026
          </span>
          <button aria-label="Next Month" className="p-1 text-slate-500 hover:text-slate-800 rounded-lg">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Days of Week and Numbers Row */}
        <div className="grid grid-cols-7 gap-1 text-center">
          {calendarDays.map((d) => (
            <div key={d.dayName + d.date} className="text-[10px] text-slate-400 font-semibold pb-1">
              {d.dayName}
            </div>
          ))}

          {calendarDays.map((d) => {
            const isSelected = d.date === selectedDay;
            return (
              <button
                key={'date-' + d.date}
                onClick={() => setSelectedDay(d.date)}
                className="flex items-center justify-center py-1"
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-emerald-500 text-white shadow-sm'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {d.date}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Your Workouts Section */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-slate-900">Your Workouts</h3>
        <button
          onClick={onViewAll}
          className="text-xs text-emerald-600 hover:underline font-semibold"
        >
          View All &gt;
        </button>
      </div>

      {/* Workout Items List */}
      <div className="space-y-3 mb-6">
        {workoutsList.map((w) => (
          <div
            key={w.id}
            className="p-4 rounded-3xl bg-white border border-slate-200/90 flex items-center justify-between shadow-sm"
          >
            <div className="flex items-center space-x-3.5">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  w.type === 'running'
                    ? 'bg-emerald-50 text-emerald-600'
                    : 'bg-sky-50 text-sky-600'
                }`}
              >
                <Footprints className="w-5 h-5" />
              </div>

              <div>
                <div className="text-xs font-bold text-slate-900">{w.title}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">{w.timeText}</div>
              </div>
            </div>

            {/* iOS-style Toggle Switch */}
            <button
              onClick={() => toggleWorkout(w.id)}
              aria-label={`Toggle reminder for ${w.title}`}
              className={`w-12 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
                w.enabled ? 'bg-emerald-500' : 'bg-slate-200'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-200 ${
                  w.enabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        ))}
      </div>

      {/* Bottom Button: + Add Schedule */}
      <div className="mt-auto">
        <button
          onClick={onAddScheduleClick}
          className="w-full py-3.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-bold text-xs flex items-center justify-center space-x-1.5 shadow-sm active:scale-[0.99] transition-all"
        >
          <Plus className="w-4 h-4 text-emerald-600" />
          <span>Add Schedule</span>
        </button>
      </div>
    </div>
  );
};
