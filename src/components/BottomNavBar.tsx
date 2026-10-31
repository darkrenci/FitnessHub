import React from 'react';
import { Home, Footprints, BarChart2, Calendar, User } from 'lucide-react';

export type TabKey = 'home' | 'track' | 'progress' | 'schedule' | 'profile';

interface BottomNavBarProps {
  activeTab: TabKey;
  onSelectTab: (tab: TabKey) => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab,
  onSelectTab,
}) => {
  const tabs = [
    { key: 'home' as TabKey, label: 'Home', icon: Home },
    { key: 'track' as TabKey, label: 'Track', icon: Footprints },
    { key: 'progress' as TabKey, label: 'Progress', icon: BarChart2 },
    { key: 'schedule' as TabKey, label: 'Schedule', icon: Calendar },
    { key: 'profile' as TabKey, label: 'Profile', icon: User },
  ];

  return (
    <nav
      aria-label="Bottom Navigation"
      className="sticky bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-slate-200/90 px-2 py-2 safe-bottom shadow-[0_-2px_10px_rgba(0,0,0,0.03)]"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {tabs.map(({ key, label, icon: Icon }) => {
          const isActive = activeTab === key;
          return (
            <button
              key={key}
              onClick={() => onSelectTab(key)}
              aria-label={label}
              className={`flex flex-col items-center justify-center flex-1 py-1.5 transition-all ${
                isActive ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <div className={`relative p-1 rounded-full transition-all ${isActive ? 'bg-emerald-50 text-emerald-600' : ''}`}>
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 stroke-[2.4]' : 'stroke-[1.8]'}`} />
              </div>
              <span className={`text-[11px] font-semibold mt-0.5 ${isActive ? 'text-emerald-600 font-bold' : 'text-slate-500'}`}>
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
