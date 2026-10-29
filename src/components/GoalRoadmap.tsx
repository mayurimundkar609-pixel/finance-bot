import { Target, CheckCircle2, Clock, Calendar, Sparkles } from "lucide-react";
import { formatMoney, type Milestone } from "../services/api";

interface GoalRoadmapProps {
  goalName: string;
  targetAmount: number;
  currentSavings: number;
  targetDate: string;
  monthlySavings: number;
  milestones?: Milestone[];
  currency: string;
}

export function GoalRoadmap({
  goalName,
  targetAmount,
  currentSavings,
  targetDate,
  monthlySavings,
  milestones,
  currency
}: GoalRoadmapProps) {
  const goalPct = targetAmount > 0 ? Math.min(100, (currentSavings / targetAmount) * 100) : 0;
  const remaining = Math.max(0, targetAmount - currentSavings);
  const monthsRemaining = monthlySavings > 0 ? (remaining / monthlySavings).toFixed(1) : "—";

  const defaultMilestones: Milestone[] = [
    { percent: 25, target_amount: targetAmount * 0.25, achieved: currentSavings >= targetAmount * 0.25, months_away: 0 },
    { percent: 50, target_amount: targetAmount * 0.50, achieved: currentSavings >= targetAmount * 0.50, months_away: 0 },
    { percent: 75, target_amount: targetAmount * 0.75, achieved: currentSavings >= targetAmount * 0.75, months_away: 0 },
    { percent: 100, target_amount: targetAmount, achieved: currentSavings >= targetAmount, months_away: Number(monthsRemaining) || 0 }
  ];

  const items = milestones && milestones.length > 0 ? milestones : defaultMilestones;

  return (
    <div className="glass-panel glass-card rounded-2xl p-6 shadow-soft">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-5 gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
            <Target size={18} />
          </div>
          <div>
            <h3 className="font-heading font-bold text-slate-900 dark:text-white text-base">
              Milestone Roadmap: {goalName || "Primary Savings Goal"}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Interactive horizon & wealth checkpoint tracker
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
          <Calendar size={14} className="text-indigo-500" />
          <span>Target Deadline: {targetDate || "Open-ended"}</span>
        </div>
      </div>

      {/* Main Goal Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="p-3.5 rounded-xl bg-slate-50/70 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-800/60">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Current Saved</span>
          <div className="text-xl font-black text-slate-900 dark:text-white mt-1">
            {formatMoney(currentSavings, currency)}
          </div>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-50/70 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-800/60">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Target Objective</span>
          <div className="text-xl font-black text-slate-900 dark:text-white mt-1">
            {formatMoney(targetAmount, currency)}
          </div>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-50/70 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-800/60">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Remaining</span>
          <div className="text-xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
            {formatMoney(remaining, currency)}
          </div>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-50/70 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-800/60">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Est. Timeline</span>
          <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {monthsRemaining} months
          </div>
        </div>
      </div>

      {/* Main Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-300 mb-2">
          <span>Overall Progression</span>
          <span className="text-indigo-600 dark:text-indigo-400">{goalPct.toFixed(1)}% Completed</span>
        </div>
        <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 transition-all duration-700"
            style={{ width: `${goalPct}%` }}
          />
        </div>
      </div>

      {/* Milestone checkpoints */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {items.map((m, idx) => (
          <div
            key={idx}
            className={`p-3.5 rounded-xl border transition-all ${
              m.achieved
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-300"
                : "bg-slate-50/80 dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800/80 text-slate-600 dark:text-slate-400"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold font-heading">Checkpoint {m.percent}%</span>
              {m.achieved ? (
                <CheckCircle2 size={16} className="text-emerald-500" />
              ) : (
                <Clock size={16} className="text-slate-400" />
              )}
            </div>
            <div className="text-sm font-black text-slate-900 dark:text-white">
              {formatMoney(m.target_amount, currency)}
            </div>
            <div className="text-[11px] mt-1 font-semibold">
              {m.achieved ? "Unlocked!" : `~${m.months_away} mo away`}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
