import { FormEvent, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  CircleDollarSign,
  Flag,
  Plus,
  Trash2,
  Sparkles,
  UserCheck,
  Building,
  Home,
  Briefcase
} from "lucide-react";
import type { FinanceData, CurrencyCode } from "../services/api";
import { getCurrencySymbol } from "../services/api";

const expenseLabels: Record<string, string> = {
  housing: "Rent / Housing",
  food: "Food & Groceries",
  transportation: "Transportation",
  utilities: "Utilities & Mobile",
  entertainment: "Entertainment & Subs",
  shopping: "Shopping & Lifestyle",
  education: "Education & Skills",
  healthcare: "Healthcare & Insurance",
  other: "Other Outlays"
};

export const demoProfiles: Record<string, { label: string; icon: any; data: FinanceData }> = {
  tech: {
    label: "Tech Professional",
    icon: Briefcase,
    data: {
      income: 50000,
      otherIncome: 5000,
      currency: "INR",
      expenses: {
        housing: 15000,
        food: 7000,
        transportation: 4000,
        utilities: 3000,
        entertainment: 3000,
        shopping: 4000,
        education: 0,
        healthcare: 2000,
        other: 2000
      },
      financialGoal: "Build an emergency fund",
      targetAmount: 150000,
      targetDate: "2027-06-30",
      currentSavings: 40000,
      riskPreference: "Balanced",
      notes: "Looking to optimize discretionary dining out and automate monthly savings."
    }
  },
  home: {
    label: "Home Buyer",
    icon: Home,
    data: {
      income: 85000,
      otherIncome: 10000,
      currency: "INR",
      expenses: {
        housing: 22000,
        food: 12000,
        transportation: 6000,
        utilities: 4500,
        entertainment: 4000,
        shopping: 5000,
        education: 2000,
        healthcare: 3000,
        other: 2500
      },
      financialGoal: "House down payment",
      targetAmount: 600000,
      targetDate: "2028-12-31",
      currentSavings: 180000,
      riskPreference: "Conservative",
      notes: "Aggressively compounding savings for property down payment within 2 years."
    }
  },
  us_expat: {
    label: "Global Expat ($)",
    icon: Building,
    data: {
      income: 6500,
      otherIncome: 500,
      currency: "USD",
      expenses: {
        housing: 2100,
        food: 750,
        transportation: 400,
        utilities: 280,
        entertainment: 350,
        shopping: 400,
        education: 0,
        healthcare: 300,
        other: 200
      },
      financialGoal: "Build an emergency fund",
      targetAmount: 25000,
      targetDate: "2027-04-30",
      currentSavings: 8000,
      riskPreference: "Balanced",
      notes: "Maximizing monthly high-yield savings to hit 6 months living expenses."
    }
  },
  student: {
    label: "College Student",
    icon: Sparkles,
    data: {
      income: 18000,
      otherIncome: 2000,
      currency: "INR",
      expenses: {
        housing: 6000,
        food: 4500,
        transportation: 1500,
        utilities: 800,
        entertainment: 1200,
        shopping: 1000,
        education: 1500,
        healthcare: 500,
        other: 500
      },
      financialGoal: "New Coding Laptop Setup",
      targetAmount: 65000,
      targetDate: "2026-12-31",
      currentSavings: 22000,
      riskPreference: "Conservative",
      notes: "Balancing academic expenses and saving for a developer workstation."
    }
  },
  freelancer: {
    label: "Freelance Consultant",
    icon: Briefcase,
    data: {
      income: 70000,
      otherIncome: 15000,
      currency: "INR",
      expenses: {
        housing: 18000,
        food: 9000,
        transportation: 3500,
        utilities: 4000,
        entertainment: 4500,
        shopping: 5000,
        education: 2500,
        healthcare: 2500,
        other: 3000
      },
      financialGoal: "Tax Buffer & Portfolio",
      targetAmount: 250000,
      targetDate: "2027-09-30",
      currentSavings: 90000,
      riskPreference: "Aggressive",
      notes: "Managing variable monthly client retainers and establishing tax runway."
    }
  }
};

export const demoData: FinanceData = demoProfiles.tech.data;

export function FinancialForm({
  initial,
  onSubmit
}: {
  initial?: FinanceData;
  onSubmit: (data: FinanceData) => void;
}) {
  const [data, setData] = useState<FinanceData>(initial || demoData);
  const [custom, setCustom] = useState<{ name: string; value: number }[]>([]);

  const sym = getCurrencySymbol(data.currency);

  const set = (key: keyof FinanceData, val: any) => setData((d) => ({ ...d, [key]: val }));
  const setExp = (key: string, val: number) =>
    setData((d) => ({
      ...d,
      expenses: { ...d.expenses, [key]: Math.max(0, val) }
    }));

  const loadProfile = (profileKey: string) => {
    const prof = demoProfiles[profileKey];
    if (prof) {
      setData(prof.data);
      setCustom([]);
    }
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const mergedExpenses = { ...data.expenses };
    for (const c of custom) {
      if (c.name.trim()) {
        mergedExpenses[c.name.trim().toLowerCase()] = Number(c.value) || 0;
      }
    }
    onSubmit({
      ...data,
      expenses: mergedExpenses
    });
  };

  return (
    <form onSubmit={submit} className="mx-auto max-w-4xl space-y-6">
      {/* 1-Click Quick Preset Selector */}
      <div className="glass-panel rounded-2xl p-4 sm:p-5 shadow-soft border border-indigo-100 dark:border-indigo-950/60 bg-gradient-to-r from-indigo-50/50 via-white to-purple-50/50 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
            <Sparkles size={16} className="text-indigo-600 dark:text-indigo-400" />
            <span>Fast Setup: Load Pre-Configured Sample Profile</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {Object.entries(demoProfiles).map(([key, prof]) => {
              const Icon = prof.icon;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => loadProfile(key)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition shadow-sm"
                >
                  <Icon size={14} className="text-indigo-500" />
                  <span>{prof.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 1. Inflow / Income Section */}
      <div className="glass-panel glass-card rounded-2xl p-6 shadow-soft">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
            <CircleDollarSign size={20} />
          </div>
          <div>
            <h2 className="font-heading font-bold text-slate-900 dark:text-white text-base">
              Monthly Inflow & Currency
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Declare all recurring monthly income streams
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Field
            label="Primary Take-home Salary"
            value={data.income}
            onChange={(v) => set("income", v)}
            prefix={sym}
          />
          <Field
            label="Additional / Secondary Income"
            value={data.otherIncome}
            onChange={(v) => set("otherIncome", v)}
            prefix={sym}
          />
          <label className="block">
            <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Active Currency
            </span>
            <select
              value={data.currency}
              onChange={(e) => set("currency", e.target.value as CurrencyCode)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-3 text-sm font-semibold text-slate-900 dark:text-white outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
            >
              <option value="INR">INR — Indian Rupee (₹)</option>
              <option value="USD">USD — US Dollar ($)</option>
              <option value="EUR">EUR — Euro (€)</option>
              <option value="GBP">GBP — British Pound (£)</option>
              <option value="CAD">CAD — Canadian Dollar (CA$)</option>
              <option value="AUD">AUD — Australian Dollar (A$)</option>
              <option value="JPY">JPY — Japanese Yen (¥)</option>
            </select>
          </label>
        </div>
      </div>

      {/* 2. Monthly Expenses Section */}
      <div className="glass-panel glass-card rounded-2xl p-6 shadow-soft">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="font-heading font-bold text-slate-900 dark:text-white text-base">
              Monthly Outflows & Commitments
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Estimate average category spending. You can tweak anytime in the simulator.
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(expenseLabels).map(([key, label]) => (
            <Field
              key={key}
              label={label}
              value={data.expenses[key] || 0}
              onChange={(v) => setExp(key, v)}
              prefix={sym}
            />
          ))}
        </div>

        {/* Custom expense entries */}
        {custom.length > 0 && (
          <div className="mt-5 space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Custom Expenses
            </span>
            {custom.map((x, i) => (
              <div key={i} className="flex gap-2 items-center">
                <input
                  value={x.name}
                  onChange={(e) =>
                    setCustom((a) =>
                      a.map((z, j) => (j === i ? { ...z, name: e.target.value } : z))
                    )
                  }
                  placeholder="Expense name (e.g. Gym, Pet Care)"
                  className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white outline-none focus:border-indigo-500"
                />
                <div className="relative w-36">
                  <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-bold">
                    {sym}
                  </span>
                  <input
                    type="number"
                    min="0"
                    value={x.value}
                    onChange={(e) =>
                      setCustom((a) =>
                        a.map((z, j) => (j === i ? { ...z, value: Number(e.target.value) } : z))
                      )
                    }
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 pl-7 pr-3 py-2.5 text-sm text-slate-900 dark:text-white outline-none focus:border-indigo-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setCustom((a) => a.filter((_, j) => j !== i))}
                  className="p-2.5 rounded-xl text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-500 transition"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={() => setCustom((a) => [...a, { name: "", value: 0 }])}
          className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          <Plus size={15} /> Add Custom Expense Item
        </button>
      </div>

      {/* 3. Goal & Strategy Section */}
      <div className="glass-panel glass-card rounded-2xl p-6 shadow-soft">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
            <Flag size={20} />
          </div>
          <div>
            <h2 className="font-heading font-bold text-slate-900 dark:text-white text-base">
              Financial Goal & Risk Preferences
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Define your primary milestone target and timeline
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="sm:col-span-2">
            <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Primary Financial Objective
            </span>
            <select
              value={data.financialGoal}
              onChange={(e) => set("financialGoal", e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-3 text-sm font-semibold text-slate-900 dark:text-white outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
            >
              <option>Build an emergency fund</option>
              <option>House down payment</option>
              <option>Buy a vehicle</option>
              <option>Higher education & Certifications</option>
              <option>Vacation & Travel fund</option>
              <option>Retirement accelerator</option>
              <option>General wealth compounding</option>
            </select>
          </label>

          <Field
            label="Target Amount"
            value={data.targetAmount}
            onChange={(v) => set("targetAmount", v)}
            prefix={sym}
          />

          <label>
            <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Target Completion Date
            </span>
            <div className="relative">
              <CalendarDays
                className="absolute left-3.5 top-3.5 text-slate-400 pointer-events-none"
                size={16}
              />
              <input
                type="date"
                value={data.targetDate}
                onChange={(e) => set("targetDate", e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 pl-10 pr-3.5 py-3 text-sm font-semibold text-slate-900 dark:text-white outline-none focus:border-indigo-500"
              />
            </div>
          </label>

          <Field
            label="Current Liquid Savings"
            value={data.currentSavings}
            onChange={(v) => set("currentSavings", v)}
            prefix={sym}
          />

          <label>
            <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Investment / Risk Profile
            </span>
            <select
              value={data.riskPreference}
              onChange={(e) =>
                set("riskPreference", e.target.value as "Conservative" | "Balanced" | "Aggressive")
              }
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-3 text-sm font-semibold text-slate-900 dark:text-white outline-none focus:border-indigo-500"
            >
              <option value="Conservative">Conservative (Capital preservation priority)</option>
              <option value="Balanced">Balanced (Steady growth & moderate buffer)</option>
              <option value="Aggressive">Aggressive (High growth velocity tolerance)</option>
            </select>
          </label>

          <label className="sm:col-span-2">
            <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Additional Context / Notes for FinWise AI
            </span>
            <textarea
              value={data.notes}
              onChange={(e) => set("notes", e.target.value)}
              rows={3}
              placeholder="E.g., planning to move apartments in 6 months, expecting year-end bonus, paying off student loan..."
              className="w-full resize-none rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-3 text-sm text-slate-900 dark:text-white outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
            />
          </label>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 text-base font-bold text-white shadow-xl shadow-indigo-500/25 transition-all hover:scale-[1.01] hover:shadow-indigo-500/40 active:scale-[0.99]"
      >
        <span>Generate Intelligence Plan</span>
        <ArrowRight size={18} />
      </button>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  prefix
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  prefix?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        {label}
      </span>
      <div className="relative">
        {prefix && (
          <span className="absolute left-3.5 top-3.5 text-xs font-extrabold text-slate-400 select-none">
            {prefix}
          </span>
        )}
        <input
          required
          type="number"
          min="0"
          value={value === 0 ? "" : value}
          placeholder="0"
          onChange={(e) => onChange(Number(e.target.value))}
          className={`w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 py-3 pr-3 text-sm font-semibold text-slate-900 dark:text-white outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 ${
            prefix ? "pl-9" : "px-3.5"
          }`}
        />
      </div>
    </label>
  );
}
