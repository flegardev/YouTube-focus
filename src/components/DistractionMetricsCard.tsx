import React from "react";
import { type DistractionMetrics } from "../types/focus";
import { formatHoursAndMinutes } from "../utils/focusFormatters";

export interface DistractionMetricsCardProps {
  metrics: DistractionMetrics;
}

export const DistractionMetricsCard: React.FC<DistractionMetricsCardProps> = ({ metrics }) => {
  return (
    <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Productivity & Time Saved</h3>
          <p className="text-xs text-slate-400">Algorithmic feed interceptor analytics</p>
        </div>
        <div className="px-3 py-1 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 rounded-full text-xs font-bold">
          {metrics.focusEfficiencyRatio}% Efficiency
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl">
          <div className="text-xs text-slate-400">Total Focus Time</div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1 font-mono">
            {metrics.totalFocusHours} hrs
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl">
          <div className="text-xs text-slate-400">Distractions Blocked</div>
          <div className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1 font-mono">
            {metrics.totalDistractionsBlocked}
          </div>
        </div>

        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl border border-emerald-100 dark:border-emerald-900/30">
          <div className="text-xs text-emerald-700 dark:text-emerald-300">Est. Time Reclaimed</div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1 font-mono">
            {formatHoursAndMinutes(metrics.estimatedTimeSavedMinutes)}
          </div>
        </div>
      </div>
    </div>
  );
};
