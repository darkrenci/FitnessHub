import React from 'react';
import { ChevronLeft } from 'lucide-react';

interface StatusBarProps {
  title?: string;
  onBack?: () => void;
  rightAction?: React.ReactNode;
  transparent?: boolean;
}

/**
 * Top App Navigation Header.
 * Renders screen navigation (back button, title, and action buttons).
 * Does not render any fake OS status indicators (clock, battery, signal).
 */
export const StatusBar: React.FC<StatusBarProps> = ({
  title,
  onBack,
  rightAction,
  transparent = false,
}) => {
  // If no navigation controls or title are needed, render nothing
  if (!title && !onBack && !rightAction) {
    return null;
  }

  return (
    <div
      className={`w-full z-30 select-none ${
        transparent
          ? 'bg-transparent'
          : 'bg-[#f8fafc]/95 backdrop-blur-md border-b border-slate-200/60'
      }`}
    >
      <div className="flex items-center justify-between px-4 py-2.5 min-h-[48px]">
        {/* Back Button */}
        <div className="w-10 flex items-center">
          {onBack ? (
            <button
              type="button"
              onClick={onBack}
              aria-label="Back"
              className="p-1.5 -ml-1 text-slate-700 hover:text-slate-900 transition-colors rounded-xl hover:bg-slate-200/60 active:scale-95"
            >
              <ChevronLeft className="w-6 h-6 stroke-[2.2]" />
            </button>
          ) : null}
        </div>

        {/* Screen Title */}
        <div className="flex-1 text-center font-bold text-base text-slate-900 tracking-tight truncate px-1">
          {title}
        </div>

        {/* Right Action Button / Slot */}
        <div className="w-10 flex items-center justify-end">
          {rightAction}
        </div>
      </div>
    </div>
  );
};
