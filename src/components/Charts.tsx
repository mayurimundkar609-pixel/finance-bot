import { useState } from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  AreaChart,
  Area,
  Legend
} from "recharts";
import { formatMoney } from "../services/api";

const PALETTE = [
  "#6366f1", // Indigo
  "#8b5cf6", // Purple
  "#ec4899", // Pink
  "#f43f5e", // Rose
  "#f59e0b", // Amber
  "#10b981", // Emerald
  "#06b6d4", // Cyan
  "#3b82f6", // Blue
  "#94a3b8"  // Slate
];

const categoryLabels: Record<string, string> = {
  housing: "Housing / Rent",
  food: "Food & Groceries",
  transportation: "Transportation",
  utilities: "Utilities & Bills",
  entertainment: "Entertainment",
  shopping: "Shopping & Lifestyle",
  education: "Education",
  healthcare: "Healthcare",
  other: "Other Expenses"
};

export function ExpenseDonut({
  expenses,
  currency
}: {
  expenses: Record<string, number>;
  currency: string;
}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const data = Object.entries(expenses)
    .filter(([, v]) => Number(v) > 0)
    .map(([k, v]) => ({
      name: categoryLabels[k] || k.charAt(0).toUpperCase() + k.slice(1),
      value: Number(v)
    }))
    .sort((a, b) => b.value - a.value);

  const total = data.reduce((sum, item) => sum + item.value, 0);

  if (data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-slate-400">
        No expense data entered yet.
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative h-64 w-full">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={65}
              outerRadius={95}
              paddingAngle={3}
              onMouseEnter={(_, index) => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              {data.map((_, i) => (
                <Cell
                  key={i}
                  fill={PALETTE[i % PALETTE.length]}
                  className="transition-opacity hover:opacity-80 cursor-pointer"
                />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const d = payload[0];
                  const pct = total > 0 ? ((Number(d.value) / total) * 100).toFixed(1) : 0;
                  return (
                    <div className="rounded-xl border border-slate-700 bg-slate-900/95 px-3 py-2 text-xs shadow-xl text-white backdrop-blur">
                      <div className="font-bold">{d.name}</div>
                      <div className="text-indigo-400 font-extrabold text-sm mt-0.5">
                        {formatMoney(Number(d.value), currency)} ({pct}%)
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        {/* Center Total Callout */}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {activeIndex !== null ? data[activeIndex]?.name : "Total Outflow"}
          </span>
          <span className="font-heading text-lg font-black text-slate-900 dark:text-white">
            {formatMoney(
              activeIndex !== null ? data[activeIndex]?.value : total,
              currency
            )}
          </span>
        </div>
      </div>

      {/* Top 3 Legend Chips */}
      <div className="flex flex-wrap justify-center gap-2 mt-2">
        {data.slice(0, 4).map((item, idx) => (
          <div
            key={idx}
            className="flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
          >
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: PALETTE[idx % PALETTE.length] }}
            />
            <span>{item.name}:</span>
            <span className="font-bold text-slate-900 dark:text-white">
              {formatMoney(item.value, currency)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function BudgetComposition({
  needs,
  wants,
  savings,
  currency
}: {
  needs: number;
  wants: number;
  savings: number;
  currency: string;
}) {
  const data = [
    { name: "Needs (Essential)", value: needs, color: "#6366f1" },
    { name: "Wants (Discretionary)", value: wants, color: "#a855f7" },
    { name: "Savings (Wealth)", value: savings, color: "#10b981" }
  ];
  const total = needs + wants + savings || 1;

  return (
    <div className="flex flex-col items-center">
      <div className="relative h-64 w-full">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={65}
              outerRadius={95}
              paddingAngle={4}
            >
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const d = payload[0];
                  const pct = ((Number(d.value) / total) * 100).toFixed(1);
                  return (
                    <div className="rounded-xl border border-slate-700 bg-slate-900/95 px-3 py-2 text-xs shadow-xl text-white backdrop-blur">
                      <div className="font-bold">{d.name}</div>
                      <div className="text-emerald-400 font-extrabold text-sm mt-0.5">
                        {formatMoney(Number(d.value), currency)} ({pct}%)
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Total Allocated
          </span>
          <span className="font-heading text-lg font-black text-slate-900 dark:text-white">
            {formatMoney(total, currency)}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-2 mt-2">
        {data.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
          >
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span>{item.name.split(" ")[0]}:</span>
            <span className="font-bold text-slate-900 dark:text-white">
              {formatMoney(item.value, currency)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function IncomeBar({
  income,
  expenses,
  currency
}: {
  income: number;
  expenses: number;
  currency: string;
}) {
  const data = [
    { name: "Monthly Income", amount: income, fill: "#10b981" },
    { name: "Total Expenses", amount: expenses, fill: "#f43f5e" }
  ];
  const balance = Math.max(0, income - expenses);

  return (
    <div className="flex flex-col">
      <div className="h-64 w-full">
        <ResponsiveContainer>
          <BarChart
            data={data}
            margin={{ top: 20, right: 10, left: -10, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="rgba(148, 163, 184, 0.2)"
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              tickFormatter={(val) => formatMoney(val, currency)}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const d = payload[0];
                  return (
                    <div className="rounded-xl border border-slate-700 bg-slate-900/95 px-3 py-2 text-xs shadow-xl text-white backdrop-blur">
                      <div className="font-bold">{d.payload.name}</div>
                      <div className="text-white font-extrabold text-sm mt-0.5">
                        {formatMoney(Number(d.value), currency)}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="amount" radius={[8, 8, 0, 0]} barSize={50}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 flex items-center justify-between px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs">
        <span className="font-semibold text-slate-500 dark:text-slate-400">
          Monthly Net Surplus:
        </span>
        <span className="font-black text-emerald-600 dark:text-emerald-400 text-sm">
          +{formatMoney(balance, currency)}
        </span>
      </div>
    </div>
  );
}

export function CashFlowProjectionChart({
  currentSavings,
  monthlySavings,
  targetAmount,
  currency
}: {
  currentSavings: number;
  monthlySavings: number;
  targetAmount: number;
  currency: string;
}) {
  const [showBoost, setShowBoost] = useState(true);

  // Generate 12-month wealth projection
  const months = ["Now", "+2 mo", "+4 mo", "+6 mo", "+8 mo", "+10 mo", "+12 mo"];
  const boostMultiplier = 1.25; // 25% accelerated savings from AI recommendations

  const data = months.map((m, idx) => {
    const elapsed = idx * 2;
    const baseSavings = currentSavings + monthlySavings * elapsed;
    const boostedSavings = currentSavings + monthlySavings * boostMultiplier * elapsed;
    return {
      month: m,
      standard: Math.round(baseSavings),
      optimized: Math.round(boostedSavings),
      target: targetAmount
    };
  });

  return (
    <div className="glass-panel glass-card rounded-2xl p-6 shadow-soft">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-5 gap-3">
        <div>
          <h3 className="font-heading font-bold text-slate-900 dark:text-white text-base">
            12-Month Wealth & Savings Trajectory
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Compound trajectory: Current velocity vs AI-optimized strategy
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowBoost(!showBoost)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              showBoost
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                : "bg-slate-100 dark:bg-slate-800 text-slate-500"
            }`}
          >
            {showBoost ? "✨ AI Boost Enabled (+25%)" : "Standard Velocity"}
          </button>
        </div>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer>
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorStandard" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorOptimized" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.5} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="rgba(148, 163, 184, 0.15)"
            />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              tickFormatter={(val) => formatMoney(val, currency)}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-xl border border-slate-700 bg-slate-900/95 p-3 text-xs shadow-xl text-white backdrop-blur">
                      <div className="font-bold text-slate-300 mb-1">{label}</div>
                      {payload.map((entry, index) => (
                        <div
                          key={`item-${index}`}
                          className="flex items-center justify-between gap-4 py-0.5"
                        >
                          <span className="flex items-center gap-1.5 text-slate-400">
                            <span
                              className="h-2 w-2 rounded-full"
                              style={{ backgroundColor: entry.color }}
                            />
                            {entry.name}:
                          </span>
                          <span className="font-extrabold text-white">
                            {formatMoney(Number(entry.value), currency)}
                          </span>
                        </div>
                      ))}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend verticalAlign="top" height={36} iconType="circle" />
            <Area
              type="monotone"
              dataKey="standard"
              name="Standard Pace"
              stroke="#6366f1"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#colorStandard)"
            />
            {showBoost && (
              <Area
                type="monotone"
                dataKey="optimized"
                name="AI Optimized (+25%)"
                stroke="#10b981"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorOptimized)"
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
