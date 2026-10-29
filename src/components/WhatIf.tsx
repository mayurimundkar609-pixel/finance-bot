import { useMemo, useState } from "react";
import { Calculator, TrendingUp, Sparkles, RefreshCw, Zap } from "lucide-react";
import type { FinanceData } from "../services/api";
import { formatMoney } from "../services/api";

export function WhatIf({ finance, currency }: { finance: FinanceData; currency: string }) {
  const baseIncome = (Number(finance.income) || 0) + (Number(finance.otherIncome) || 0);
  const baseExpenses = Object.values(finance.expenses || {}).reduce((a, b) => a + (Number(b) || 0), 0);
  const baseBalance = Math.max(0, baseIncome - baseExpenses);
  const baseDefaultSavings = Math.max(500, Math.round(baseBalance * 0.35));

  const [income, setIncome] = useState(baseIncome);
  const [expenses, setExpenses] = useState(baseExpenses);
  const [savings, setSavings] = useState(baseDefaultSavings);

  // Dynamic slider upper limits based on currency magnitude
  const isUSDorEUR = ["USD", "EUR", "GBP"].includes(finance.currency);
  const incomeMax = isUSDorEUR ? Math.max(20000, baseIncome * 2.5) : Math.max(300000, baseIncome * 2.5);
  const expenseMax = isUSDorEUR ? Math.max(15000, baseExpenses * 2.5) : Math.max(250000, baseExpenses * 2.5);
  const savingsMax = isUSDorEUR ? Math.max(10000, baseIncome * 1.5) : Math.max(150000, baseIncome * 1.5);
  const step = isUSDorEUR ? 50 : 500;

  const calc = useMemo(() => {
    const balance = Math.max(income - expenses, 0);
    const rate = income > 0 ? (savings / income) * 100 : 0;
    const currentRemain = Math.max(Number(finance.targetAmount || 0) - Number(finance.currentSavings || 0), 0);
    const months = savings > 0 ? currentRemain / savings : Infinity;
    return { balance, rate, months };
  }, [income, expenses, savings, finance]);

  const baselineMonths = baseDefaultSavings > 0 
    ? Math.max(Number(finance.targetAmount || 0) - Number(finance.currentSavings || 0), 0) / baseDefaultSavings 
    : Infinity;

  const earlierMonths = Math.max(0, baselineMonths - calc.months);
  const laterMonths = Math.max(0, calc.months - baselineMonths);

  // Quick preset shortcuts
  const trimExpenses = () => setExpenses(Math.round(baseExpenses * 0.88));
  const boostIncome = () => setIncome(Math.round(baseIncome * 1.15));
  const maxSavings = () => setSavings(Math.round(calc.balance * 0.60));
  const resetAll = () => {
    setIncome(baseIncome);
    setExpenses(baseExpenses);
    setSavings(baseDefaultSavings);
  };

  return (
    <section id="whatif" className="glass-panel glass-card rounded-2xl p-6 shadow-soft">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-6 gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
            <Calculator size={20} />
          </div>
          <div>
            <h3 className="font-heading font-bold text-slate-900 dark:text-white text-lg">
              Interactive What-If Scenario Simulator
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Test how variable cash flow impacts your timeline in real time
            </p>
          </div>
        </div>

        {/* Preset Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={trimExpenses}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors"
          >
            <Zap size={13} /> -12% Expenses
          </button>
          <button
            onClick={boostIncome}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors"
          >
            <TrendingUp size={13} /> +15% Income
          </button>
          <button
            onClick={resetAll}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <RefreshCw size={13} /> Reset
          </button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Sliders */}
        <div className="space-y-6">
          {/* Monthly Income Slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Simulated Monthly Income
              </span>
              <span className="font-heading text-base font-black text-slate-900 dark:text-white">
                {formatMoney(income, currency)}
              </span>
            </div>
            <input
              type="range"
              min={Math.round(baseIncome * 0.4)}
              max={incomeMax}
              step={step}
              value={income}
              onChange={(e) => setIncome(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-1">
              <span>{formatMoney(Math.round(baseIncome * 0.4), currency)}</span>
              <span>{formatMoney(incomeMax, currency)}</span>
            </div>
          </div>

          {/* Monthly Expenses Slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Simulated Monthly Outflow
              </span>
              <span className="font-heading text-base font-black text-slate-900 dark:text-white">
                {formatMoney(expenses, currency)}
              </span>
            </div>
            <input
              type="range"
              min={Math.round(baseExpenses * 0.3)}
              max={expenseMax}
              step={step}
              value={expenses}
              onChange={(e) => setExpenses(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-1">
              <span>{formatMoney(Math.round(baseExpenses * 0.3), currency)}</span>
              <span>{formatMoney(expenseMax, currency)}</span>
            </div>
          </div>

          {/* Monthly Savings Target Slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Monthly Savings Allocation
              </span>
              <span className="font-heading text-base font-black text-emerald-600 dark:text-emerald-400">
                {formatMoney(savings, currency)}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={savingsMax}
              step={step}
              value={savings}
              onChange={(e) => setSavings(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-1">
              <span>{formatMoney(0, currency)}</span>
              <span>{formatMoney(savingsMax, currency)}</span>
            </div>
          </div>
        </div>

        {/* Live Simulation Results Panel */}
        <div className="rounded-2xl bg-gradient-to-br from-slate-50 to-indigo-50/40 dark:from-slate-900/80 dark:to-indigo-950/30 p-5 border border-slate-200/70 dark:border-slate-800">
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="rounded-xl bg-white dark:bg-slate-800/80 p-3.5 border border-slate-100 dark:border-slate-700/60 shadow-sm">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Simulated Surplus
              </span>
              <div className="text-xl font-black text-slate-900 dark:text-white mt-1">
                {formatMoney(calc.balance, currency)}
              </div>
              <span className="text-[10px] text-slate-400">per month margin</span>
            </div>
            <div className="rounded-xl bg-white dark:bg-slate-800/80 p-3.5 border border-slate-100 dark:border-slate-700/60 shadow-sm">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Savings Velocity
              </span>
              <div className="text-xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
                {calc.rate.toFixed(1)}%
              </div>
              <span className="text-[10px] text-slate-400">of total monthly income</span>
            </div>
          </div>

          <div className="rounded-xl bg-white dark:bg-slate-800/80 p-4 border border-slate-100 dark:border-slate-700/60 shadow-sm mb-4">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Projected Time to Target ({formatMoney(Number(finance.targetAmount || 0), currency)})
            </span>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              {isFinite(calc.months) ? `${calc.months.toFixed(1)} months` : "Unreachable with current savings"}
            </div>
          </div>

          {/* Delta Callout */}
          {earlierMonths > 0.1 && (
            <div className="flex items-start gap-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3.5 text-xs text-emerald-800 dark:text-emerald-300">
              <TrendingUp size={18} className="shrink-0 text-emerald-500 mt-0.5" />
              <span>
                Under this scenario, you will reach your goal{" "}
                <strong className="font-black text-emerald-600 dark:text-emerald-400">
                  {earlierMonths.toFixed(1)} months sooner
                </strong>{" "}
                compared to your baseline pace!
              </span>
            </div>
          )}

          {laterMonths > 0.5 && (
            <div className="flex items-start gap-3 rounded-xl bg-amber-500/10 border border-amber-500/20 p-3.5 text-xs text-amber-800 dark:text-amber-300">
              <Sparkles size={18} className="shrink-0 text-amber-500 mt-0.5" />
              <span>
                Lowering your monthly savings pace pushes your goal horizon out by{" "}
                <strong className="font-black">{laterMonths.toFixed(1)} months</strong>.
              </span>
            </div>
          )}

          <p className="mt-4 text-[11px] leading-relaxed text-slate-400 dark:text-slate-500">
            Calculations represent mathematical forward projections. Actual timeline varies with inflation, unexpected emergencies, and return on savings accounts.
          </p>
        </div>
      </div>
    </section>
  );
}
