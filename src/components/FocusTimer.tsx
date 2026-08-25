import React from "react";
import { type FocusSession } from "../types/focus";
import { formatFocusTimeRemaining } from "../utils/focusFormatters";

export interface FocusTimerProps {
  session: FocusSession;
  onPause?: () => void;
  onStop?: () => void;
}

export const FocusTimer: React.FC<FocusTimerProps> = ({ session, onPause, onStop }) => {
  const totalSeconds = session.targetDurationMinutes * 60;
  const remainingSeconds = Math.max(0, totalSeconds - session.elapsedSeconds);
  const progressPercentage = Math.min(100, (session.elapsedSeconds / totalSeconds) * 100);

  return (
    <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm space-y-6 flex flex-col items-center text-center">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
          Focus Session Active
        </span>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">{session.title}</h2>
      </div>

      {/* Circular / Large Timer Display */}
      <div className="flex flex-col items-center justify-center w-40 h-40 rounded-full border-4 border-blue-500 bg-blue-50/40 dark:bg-blue-950/20">
        <span className="text-4xl font-black font-mono text-slate-900 dark:text-white">
          {formatFocusTimeRemaining(remainingSeconds)}
        </span>
        <span className="text-[11px] text-slate-400 mt-1">
          {session.state === "FOCUSING" ? "Feeds Blocked 🔒" : session.state}
        </span>
      </div>

      <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
        <div
          className="bg-blue-600 h-full rounded-full transition-all duration-300 ease-linear"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      <div className="flex items-center gap-3">
        {onPause && (
          <button
            onClick={onPause}
            className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-xl text-xs hover:bg-slate-200"
          >
            {session.state === "FOCUSING" ? "Pause" : "Resume"}
          </button>
        )}
        {onStop && (
          <button
            onClick={onStop}
            className="px-4 py-2 bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 font-semibold rounded-xl text-xs hover:bg-rose-100"
          >
            End Early
          </button>
        )}
      </div>
    </div>
  );
};
