import { Scale, CheckCircle2, AlertCircle } from "lucide-react";
import { formatMoney } from "../services/api";

interface BudgetBenchmarkProps {
  needs: number;
  wants: number;
  savings: number;
  totalIncome: number;
  currency: string;
}

export function BudgetBenchmark({
  needs,
  wants,
  savings,
  totalIncome,
  currency
}: BudgetBenchmarkProps) {
  const inc = totalIncome || 1;
  const actualNeedsPct = Math.round((needs / inc) * 100);
  const actualWantsPct = Math.round((wants / inc) * 100);
  const actualSavingsPct = Math.round((savings / inc) * 100);

  const targetNeeds = totalIncome * 0.50;
  const targetWants = totalIncome * 0.30;
  const targetSavings = totalIncome * 0.20;

  return (
    <div className="glass-panel glass-card rounded-2xl p-6 shadow-soft">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
            <Scale size={18} />
          </div>
          <div>
            <h3 className="font-heading font-bold text-slate-900 dark:text-white text-base">
              50 / 30 / 20 Budget Rule Benchmark
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Gold standard financial allocation framework
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Needs */}
        <div className="rounded-xl p-4 bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/80">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Essential Needs (50%)
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              actualNeedsPct <= 50 ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"
            }`}>
              {actualNeedsPct <= 50 ? "Within Budget" : "Exceeds 50%"}
            </span>
          </div>
          <div className="text-lg font-black text-slate-900 dark:text-white">
            {formatMoney(needs, currency)}
          </div>
          <div className="flex justify-between text-xs text-slate-400 mt-1 mb-2">
            <span>Actual: {actualNeedsPct}%</span>
            <span>Target: {formatMoney(targetNeeds, currency)}</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
            <div
              className={`h-full rounded-full ${actualNeedsPct <= 50 ? "bg-indigo-600" : "bg-amber-500"}`}
              style={{ width: `${Math.min(100, actualNeedsPct)}%` }}
            />
          </div>
        </div>

        {/* Wants */}
        <div className="rounded-xl p-4 bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/80">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Lifestyle Wants (30%)
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              actualWantsPct <= 30 ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
            }`}>
              {actualWantsPct <= 30 ? "Balanced" : "High Discretionary"}
            </span>
          </div>
          <div className="text-lg font-black text-slate-900 dark:text-white">
            {formatMoney(wants, currency)}
          </div>
          <div className="flex justify-between text-xs text-slate-400 mt-1 mb-2">
            <span>Actual: {actualWantsPct}%</span>
            <span>Target: {formatMoney(targetWants, currency)}</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
            <div
              className={`h-full rounded-full ${actualWantsPct <= 30 ? "bg-purple-600" : "bg-rose-500"}`}
              style={{ width: `${Math.min(100, actualWantsPct)}%` }}
            />
          </div>
        </div>

        {/* Savings */}
        <div className="rounded-xl p-4 bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/80">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Wealth Savings (20%)
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              actualSavingsPct >= 20 ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"
            }`}>
              {actualSavingsPct >= 20 ? "Strong Velocity" : "Below 20% Goal"}
            </span>
          </div>
          <div className="text-lg font-black text-slate-900 dark:text-white">
            {formatMoney(savings, currency)}
          </div>
          <div className="flex justify-between text-xs text-slate-400 mt-1 mb-2">
            <span>Actual: {actualSavingsPct}%</span>
            <span>Target: {formatMoney(targetSavings, currency)}</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
            <div
              className={`h-full rounded-full ${actualSavingsPct >= 20 ? "bg-emerald-500" : "bg-amber-500"}`}
              style={{ width: `${Math.min(100, actualSavingsPct)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
