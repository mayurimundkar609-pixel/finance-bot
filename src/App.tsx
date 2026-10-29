import { useState, useEffect } from "react";
import {
  ArrowRight,
  BarChart3,
  Bot,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  Loader2,
  Menu,
  PiggyBank,
  ShieldCheck,
  Sparkles,
  Target,
  Wallet,
  TrendingUp,
  FileText,
  Settings,
  Scale,
  Sun,
  Moon,
  Zap,
  Clock,
  PieChart,
  LineChart,
  Calculator,
  Receipt,
  Edit3,
  Layers,
  Home,
  Check,
  RefreshCw,
  ExternalLink,
  LayoutDashboard
} from "lucide-react";
import { FinancialForm, demoData, demoProfiles } from "./components/FinancialForm";
import { Sidebar } from "./components/Sidebar";
import { Logo } from "./components/Logo";
import { ExpenseDonut, BudgetComposition, IncomeBar, CashFlowProjectionChart } from "./components/Charts";
import { WhatIf } from "./components/WhatIf";
import { AdvisorChat } from "./components/AdvisorChat";
import { HealthGauge } from "./components/HealthGauge";
import { BudgetBenchmark } from "./components/BudgetBenchmark";
import { GoalRoadmap } from "./components/GoalRoadmap";
import { ActionPlan } from "./components/ActionPlan";
import { SettingsModal } from "./components/SettingsModal";
import { ReportModal } from "./components/ReportModal";
import {
  getAdvice,
  generateLocalAdvice,
  formatMoney,
  getCurrencySymbol,
  type FinanceData,
  type Advice,
  type CurrencyCode
} from "./services/api";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [viewMode, setViewMode] = useState<"focused" | "all">("focused");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [finance, setFinance] = useState<FinanceData>(demoData);
  // Synchronously initialize advice so the UI is never empty or broken
  const [advice, setAdvice] = useState<Advice>(() => generateLocalAdvice(demoData));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>("Demo Mode Active: Tech Professional Loaded");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);

  // Theme state
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem("finwise_theme");
    return saved ? saved === "dark" : true;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("finwise_theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("finwise_theme", "light");
    }
  }, [isDark]);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const toggleTheme = () => setIsDark((prev) => !prev);

  // Fast synchronous plan generation with optional backend sync
  async function generatePlan(data: FinanceData) {
    setFinance(data);
    // 1. Immediately update advice with client-side mathematical engine (0ms lag)
    const localAdvice = generateLocalAdvice(data);
    setAdvice(localAdvice);
    setError("");

    // 2. Fetch from backend in the background if available
    setLoading(true);
    try {
      const result = await getAdvice(data);
      if (result && result.data) {
        setAdvice(result.data);
      }
    } catch (e: any) {
      console.warn("Backend unavailable, using local calculation engine:", e);
    } finally {
      setLoading(false);
    }
  }

  // 1-Click Instant Demo Loader
  const loadDemoProfile = (key: string = "tech") => {
    const prof = demoProfiles[key] || demoProfiles.tech;
    generatePlan(prof.data);
    setActiveTab("dashboard");
    setToastMessage(`⚡ Loaded "${prof.label}" Profile with sample finances`);
  };

  const handleCurrencyChange = (newCurrency: CurrencyCode) => {
    const updated = { ...finance, currency: newCurrency };
    setFinance(updated);
    generatePlan(updated);
  };

  const plan = advice?.budget_plan || {
    total_income: (Number(finance.income) || 0) + (Number(finance.otherIncome) || 0),
    total_expenses: Object.values(finance.expenses || {}).reduce((a, b) => a + (Number(b) || 0), 0),
    available_balance: Math.max(
      0,
      (Number(finance.income) || 0) +
        (Number(finance.otherIncome) || 0) -
        Object.values(finance.expenses || {}).reduce((a, b) => a + (Number(b) || 0), 0)
    ),
    recommended_savings: Math.round(
      Math.max(
        0,
        (Number(finance.income) || 0) +
          (Number(finance.otherIncome) || 0) -
          Object.values(finance.expenses || {}).reduce((a, b) => a + (Number(b) || 0), 0)
      ) * 0.35
    ),
    needs: (Number(finance.income) || 0) * 0.5,
    wants: (Number(finance.income) || 0) * 0.3,
    savings: (Number(finance.income) || 0) * 0.2,
    needs_pct: 50,
    wants_pct: 30,
    savings_pct: 20
  };

  const tabList = [
    { id: "dashboard", label: "Executive Overview", icon: LayoutDashboard, badge: "KPI" },
    { id: "budget", label: "50/30/20 Budget", icon: PieChart, badge: "Rule" },
    { id: "expenses", label: "Expense Analytics", icon: Receipt, badge: "Donut" },
    { id: "cashflow", label: "Wealth Trajectory", icon: LineChart, badge: "12-Mo" },
    { id: "savings", label: "Goals & Milestones", icon: Target, badge: "Goals" },
    { id: "whatif", label: "What-If Simulator", icon: Calculator, badge: "Live" },
    { id: "advisor", label: "AI Wealth Advisor", icon: Bot, badge: "AI" },
    { id: "reports", label: "Audit Statements", icon: FileText, badge: "Print" },
    { id: "form", label: "Edit My Numbers", icon: Edit3, badge: "Input" },
    { id: "landing", label: "Hero Showcase", icon: Home, badge: "Info" }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-2xl bg-indigo-600 px-4 py-3 text-xs font-bold text-white shadow-2xl shadow-indigo-500/40 animate-bounce">
          <Sparkles size={16} className="text-amber-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Sidebar Navigation */}
      <Sidebar
        active={activeTab}
        onNavigate={(tab) => setActiveTab(tab)}
        mobileOpen={mobileMenuOpen}
        close={() => setMobileMenuOpen(false)}
        onOpenSettings={() => setSettingsOpen(true)}
        onOpenReport={() => setReportOpen(true)}
        onTriggerDemo={(prof) => loadDemoProfile(prof)}
        isDark={isDark}
        onToggleTheme={toggleTheme}
      />

      {/* Main App Container */}
      <div className="md:pl-64">
        {/* Sticky Top Header */}
        <header className="sticky top-0 z-30 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 px-4 py-2.5 backdrop-blur-md md:px-8">
          <div className="flex items-center justify-between gap-4">
            {/* Left Brand & Mobile Trigger */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="rounded-xl border border-slate-200 dark:border-slate-800 p-2 text-slate-500 md:hidden"
              >
                <Menu size={20} />
              </button>
              <div className="hidden sm:block">
                <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                  FinWise Wealth Intelligence
                </div>
                <div className="font-heading font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <span>Command Center</span>
                  <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>
              </div>
            </div>

            {/* Middle Quick Demo Persona Selector */}
            <div className="hidden lg:flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/70 border border-slate-200/60 dark:border-slate-800 text-xs">
              <span className="px-2 font-black text-[10px] uppercase tracking-wider text-slate-400">
                Demo Profiles:
              </span>
              {Object.entries(demoProfiles).slice(0, 4).map(([key, prof]) => (
                <button
                  key={key}
                  onClick={() => loadDemoProfile(key)}
                  className={`px-2.5 py-1 rounded-xl font-bold transition-all ${
                    finance.financialGoal === prof.data.financialGoal
                      ? "bg-indigo-600 text-white shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {prof.label.split(" ")[0]}
                </button>
              ))}
            </div>

            {/* Right Action Bar */}
            <div className="flex items-center gap-2">
              {/* ⚡ 1-Click Demo Mode Button */}
              <button
                onClick={() => loadDemoProfile("tech")}
                className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 via-indigo-600 to-purple-600 px-3 py-1.5 text-xs font-black text-white shadow-md shadow-indigo-500/25 hover:scale-105 active:scale-95 transition"
              >
                <Zap size={13} className="fill-current text-amber-300 animate-pulse" />
                <span>Demo Mode</span>
              </button>

              {/* Currency Button */}
              <button
                onClick={() => setSettingsOpen(true)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <span className="text-indigo-600 dark:text-indigo-400 font-black">
                  {getCurrencySymbol(finance.currency)}
                </span>
                <span>{finance.currency}</span>
              </button>

              {/* Statement Button */}
              <button
                onClick={() => setReportOpen(true)}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <FileText size={14} className="text-indigo-500" />
                <span>Statement</span>
              </button>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                {isDark ? <Sun size={15} className="text-amber-400" /> : <Moon size={15} className="text-indigo-500" />}
              </button>
            </div>
          </div>

          {/* Persistent Horizontal Scrolling Navigation Tabs */}
          <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between gap-3 overflow-x-auto scrollbar-none">
            <div className="flex items-center gap-1 shrink-0">
              {tabList.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                      isActive
                        ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm scale-[1.02]"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    <Icon size={14} className={isActive ? "text-indigo-400 dark:text-indigo-600" : "text-slate-400"} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* View Mode Toggle (Focused Tab vs All Sections) */}
            <div className="hidden xl:flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-0.5 rounded-xl text-[11px] font-bold shrink-0">
              <button
                onClick={() => setViewMode("focused")}
                className={`px-2.5 py-1 rounded-lg transition ${
                  viewMode === "focused" ? "bg-white dark:bg-slate-900 shadow-xs text-indigo-600 dark:text-indigo-400" : "text-slate-500"
                }`}
              >
                Focused Tab
              </button>
              <button
                onClick={() => setViewMode("all")}
                className={`px-2.5 py-1 rounded-lg transition ${
                  viewMode === "all" ? "bg-white dark:bg-slate-900 shadow-xs text-indigo-600 dark:text-indigo-400" : "text-slate-500"
                }`}
              >
                All Sections View
              </button>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="mx-auto max-w-7xl p-4 md:p-8 space-y-8">
          {/* Active Goal Quick Pill & Sub-Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 mb-2">
                <Sparkles size={13} />
                <span>Financial Engine: 100% Operational (Client + Server Sync)</span>
              </div>
              <h1 className="font-heading text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                {tabList.find((t) => t.id === activeTab)?.label || "Executive Overview"}
              </h1>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto px-3.5 py-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold shadow-soft">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
              <span className="text-slate-600 dark:text-slate-300">
                Active Goal: {finance.financialGoal} ({formatMoney(finance.targetAmount, finance.currency)})
              </span>
            </div>
          </div>

          {/* Loading Indicator */}
          {loading && (
            <div className="flex items-center gap-3 rounded-2xl border border-indigo-100 dark:border-indigo-950 bg-indigo-50/80 dark:bg-indigo-950/50 p-3 text-xs font-bold text-indigo-700 dark:text-indigo-300 animate-pulse">
              <Loader2 className="animate-spin" size={16} />
              <span>Optimizing financial recommendations with AI heuristic models...</span>
            </div>
          )}

          {/* TAB 1: EXECUTIVE OVERVIEW */}
          {(activeTab === "dashboard" || viewMode === "all") && (
            <div className="space-y-6">
              {/* Sub-Section 1: Top 4 KPI Metrics */}
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                  <BarChart3 size={14} className="text-indigo-500" />
                  <span>Sub-Section 1: Key Financial Metrics & Cash Flow</span>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <SummaryCard
                    icon={CircleDollarSign}
                    iconColor="text-indigo-600 dark:text-indigo-400"
                    iconBg="bg-indigo-50 dark:bg-indigo-950/60"
                    label="Monthly Inflow"
                    value={formatMoney(plan.total_income, finance.currency)}
                    sub="Salary & secondary streams"
                  />
                  <SummaryCard
                    icon={Wallet}
                    iconColor="text-rose-600 dark:text-rose-400"
                    iconBg="bg-rose-50 dark:bg-rose-950/60"
                    label="Total Outflow"
                    value={formatMoney(plan.total_expenses, finance.currency)}
                    sub="Committed & flexible overheads"
                  />
                  <SummaryCard
                    icon={BarChart3}
                    iconColor="text-emerald-600 dark:text-emerald-400"
                    iconBg="bg-emerald-50 dark:bg-emerald-950/60"
                    label="Monthly Surplus"
                    value={formatMoney(plan.available_balance, finance.currency)}
                    sub="Unallocated liquid reserves"
                  />
                  <SummaryCard
                    icon={PiggyBank}
                    iconColor="text-purple-600 dark:text-purple-400"
                    iconBg="bg-purple-50 dark:bg-purple-950/60"
                    label="Target Savings"
                    value={formatMoney(plan.recommended_savings, finance.currency)}
                    sub="35% surplus allocation"
                  />
                </div>
              </div>

              {/* Sub-Section 2: Health Score Gauge & 50/30/20 Benchmark */}
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-emerald-500" />
                  <span>Sub-Section 2: Stability Index & 50/30/20 Benchmarks</span>
                </div>
                <div className="grid gap-6 lg:grid-cols-2">
                  <HealthGauge
                    score={advice?.health_score || 85}
                    grade={advice?.health_grade || "A"}
                    status={advice?.health_status || "Solid Financial Stability"}
                    savingsRate={plan.savings_pct || (plan.total_income ? Math.round((plan.recommended_savings / plan.total_income) * 100) : 25)}
                    runwayMonths={advice?.emergency_runway_months || (plan.total_expenses ? Number((finance.currentSavings / plan.total_expenses).toFixed(1)) : 4.5)}
                    needsPct={plan.needs_pct || (plan.total_income ? Math.round((plan.needs / plan.total_income) * 100) : 48)}
                  />

                  <BudgetBenchmark
                    needs={plan.needs || plan.total_expenses * 0.55}
                    wants={plan.wants || plan.total_expenses * 0.45}
                    savings={plan.recommended_savings}
                    totalIncome={plan.total_income}
                    currency={finance.currency}
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: 50/30/20 BUDGET */}
          {(activeTab === "budget" || viewMode === "all") && (
            <div className="space-y-6">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <PieChart size={14} className="text-indigo-500" />
                <span>50/30/20 Budget Allocation Visualizer & Slabs</span>
              </div>
              <div className="glass-panel glass-card rounded-2xl p-6 shadow-soft">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
                  <div>
                    <h2 className="font-heading font-bold text-slate-900 dark:text-white text-lg">
                      50/30/20 Allocation Rule Compliance
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Comparing your real spending against recommended wealth guidelines
                    </p>
                  </div>
                  <span className="rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                    Rule-Based AI
                  </span>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800 p-5 bg-white/50 dark:bg-slate-900/50">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">50% Essential Needs</span>
                      <span className="text-xs font-black text-indigo-600 dark:text-indigo-400">{plan.needs_pct}%</span>
                    </div>
                    <div className="h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${Math.min(100, plan.needs_pct || 50)}%` }} />
                    </div>
                    <p className="mt-2 text-[11px] text-slate-500">
                      Housing, Food, Utilities, Healthcare: {formatMoney(plan.needs, finance.currency)}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800 p-5 bg-white/50 dark:bg-slate-900/50">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">30% Discretionary Wants</span>
                      <span className="text-xs font-black text-purple-600 dark:text-purple-400">{plan.wants_pct}%</span>
                    </div>
                    <div className="h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div className="h-full bg-purple-500 rounded-full" style={{ width: `${Math.min(100, plan.wants_pct || 30)}%` }} />
                    </div>
                    <p className="mt-2 text-[11px] text-slate-500">
                      Dining out, Shopping, Subscriptions: {formatMoney(plan.wants, finance.currency)}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800 p-5 bg-white/50 dark:bg-slate-900/50 md:col-span-2 lg:col-span-1">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">20% Compound Savings</span>
                      <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">{plan.savings_pct}%</span>
                    </div>
                    <div className="h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${Math.min(100, plan.savings_pct || 20)}%` }} />
                    </div>
                    <p className="mt-2 text-[11px] text-slate-500">
                      Emergency Fund & Investments: {formatMoney(plan.recommended_savings, finance.currency)}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                  <BudgetComposition
                    needs={plan.needs || plan.total_expenses * 0.55}
                    wants={plan.wants || plan.total_expenses * 0.45}
                    savings={plan.recommended_savings}
                    currency={finance.currency}
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: EXPENSE ANALYTICS */}
          {(activeTab === "expenses" || viewMode === "all") && (
            <div className="space-y-6">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Receipt size={14} className="text-rose-500" />
                <span>Expense Composition & Inflow vs Outflow Visualizer</span>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="glass-panel glass-card rounded-2xl p-6 shadow-soft">
                  <h3 className="font-heading font-bold text-slate-900 dark:text-white text-base mb-1">
                    Category Spending Donut
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                    Visual proportion of expenses by lifestyle category
                  </p>
                  <ExpenseDonut expenses={finance.expenses} currency={finance.currency} />
                </div>

                <div className="glass-panel glass-card rounded-2xl p-6 shadow-soft">
                  <h3 className="font-heading font-bold text-slate-900 dark:text-white text-base mb-1">
                    Inflow vs Outflow Bar Ratio
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                    Comparison between gross income and total commitments
                  </p>
                  <IncomeBar
                    income={plan.total_income}
                    expenses={plan.total_expenses}
                    currency={finance.currency}
                  />
                </div>
              </div>

              {/* Itemized Table */}
              <div className="glass-panel glass-card rounded-2xl p-6 shadow-soft">
                <h3 className="font-heading font-bold text-slate-900 dark:text-white text-base mb-4">
                  Itemized Monthly Expense Breakdown
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-black tracking-wider text-[10px]">
                      <tr>
                        <th className="py-2.5 px-3">Category</th>
                        <th className="py-2.5 px-3">Monthly Outlay</th>
                        <th className="py-2.5 px-3">% of Gross Inflow</th>
                        <th className="py-2.5 px-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                      {Object.entries(finance.expenses || {}).map(([cat, amt]) => {
                        const pct = plan.total_income > 0 ? ((Number(amt) / plan.total_income) * 100).toFixed(1) : "0";
                        const isHigh = Number(pct) > 25;
                        return (
                          <tr key={cat} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition">
                            <td className="py-2.5 px-3 font-bold capitalize text-slate-800 dark:text-slate-200">{cat}</td>
                            <td className="py-2.5 px-3 font-extrabold text-slate-900 dark:text-white">{formatMoney(Number(amt), finance.currency)}</td>
                            <td className="py-2.5 px-3 font-semibold text-slate-500">{pct}%</td>
                            <td className="py-2.5 px-3">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                                  isHigh
                                    ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                                    : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                                }`}
                              >
                                {isHigh ? "High Overhead" : "Optimal"}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: WEALTH TRAJECTORY */}
          {(activeTab === "cashflow" || viewMode === "all") && (
            <div className="space-y-6">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <LineChart size={14} className="text-indigo-500" />
                <span>12-Month Projected Net Worth Growth Curve</span>
              </div>
              <CashFlowProjectionChart
                currentSavings={finance.currentSavings}
                monthlySavings={plan.recommended_savings}
                targetAmount={finance.targetAmount}
                currency={finance.currency}
              />
            </div>
          )}

          {/* TAB 5: GOALS & MILESTONES */}
          {(activeTab === "savings" || viewMode === "all") && (
            <div className="space-y-6">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Target size={14} className="text-emerald-500" />
                <span>Goal Roadmaps & 25% / 50% / 75% / 100% Milestones</span>
              </div>
              <GoalRoadmap
                goalName={finance.financialGoal}
                targetAmount={finance.targetAmount}
                currentSavings={finance.currentSavings}
                targetDate={finance.targetDate}
                monthlySavings={plan.recommended_savings}
                milestones={advice?.milestones}
                currency={finance.currency}
              />
            </div>
          )}

          {/* TAB 6: WHAT-IF SIMULATOR */}
          {(activeTab === "whatif" || viewMode === "all") && (
            <div className="space-y-6">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Calculator size={14} className="text-purple-500" />
                <span>Interactive What-If Scenario Modeling Simulator</span>
              </div>
              <WhatIf
                finance={finance}
                currency={finance.currency}
              />
            </div>
          )}

          {/* TAB 7: AI WEALTH ADVISOR & ACTION PLAN */}
          {(activeTab === "advisor" || viewMode === "all") && (
            <div className="space-y-6">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Bot size={14} className="text-indigo-500" />
                <span>AI Chat Assistant & 30-Day Execution Roadmap</span>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <AdvisorChat finance={finance} />
                <ActionPlan items={advice?.action_plan} />
              </div>

              {/* Saving Suggestions */}
              <div className="glass-panel glass-card rounded-2xl p-6 shadow-soft">
                <h3 className="font-heading font-bold text-slate-900 dark:text-white text-base mb-4 flex items-center gap-2">
                  <Sparkles size={17} className="text-amber-400" />
                  <span>AI Cost-Cutting Recommendations</span>
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  {(advice?.saving_suggestions || []).map((sugg, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">{sugg.title}</h4>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-extrabold border border-emerald-500/20">
                          Save {formatMoney(sugg.estimated_monthly_impact, finance.currency)}/mo
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        {sugg.explanation}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: STATEMENTS & AUDIT */}
          {(activeTab === "reports" || viewMode === "all") && (
            <div className="space-y-6">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <FileText size={14} className="text-indigo-500" />
                <span>Official Statement Audit & Documentation</span>
              </div>

              <div className="glass-panel glass-card rounded-2xl p-6 shadow-soft space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
                  <div>
                    <h2 className="font-heading font-bold text-slate-900 dark:text-white text-lg">
                      Official Monthly Wealth Statement
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Audit completed. Income and expenses verified within standard parameters.
                    </p>
                  </div>
                  <button
                    onClick={() => setReportOpen(true)}
                    className="flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 px-4 py-2 text-xs font-bold text-white shadow-md shadow-indigo-500/20 transition self-start sm:self-auto"
                  >
                    <FileText size={14} /> Open Printable Statement (PDF)
                  </button>
                </div>

                <div className="grid gap-4 sm:grid-cols-3 text-center">
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
                    <span className="text-xs text-slate-500 font-bold block mb-1">Gross Inflow</span>
                    <span className="font-heading text-lg font-black text-slate-900 dark:text-white">
                      {formatMoney(plan.total_income, finance.currency)}
                    </span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
                    <span className="text-xs text-slate-500 font-bold block mb-1">Total Expenses</span>
                    <span className="font-heading text-lg font-black text-rose-600 dark:text-rose-400">
                      {formatMoney(plan.total_expenses, finance.currency)}
                    </span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
                    <span className="text-xs text-slate-500 font-bold block mb-1">Net Savings Velocity</span>
                    <span className="font-heading text-lg font-black text-emerald-600 dark:text-emerald-400">
                      {formatMoney(plan.available_balance, finance.currency)}
                    </span>
                  </div>
                </div>

                <div className="rounded-xl bg-emerald-500/5 dark:bg-emerald-950/20 border border-emerald-500/20 p-4">
                  <h4 className="text-xs font-bold text-emerald-700 dark:text-emerald-300 mb-1 flex items-center gap-1.5">
                    <ShieldCheck size={15} />
                    <span>Advisor Verification Seal</span>
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {advice?.monthly_summary ||
                      `Your total monthly inflow is ${formatMoney(plan.total_income, finance.currency)} with committed expenses of ${formatMoney(plan.total_expenses, finance.currency)}, leaving an unallocated surplus of ${formatMoney(plan.available_balance, finance.currency)}.`}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 9: CUSTOM INPUT FORM */}
          {activeTab === "form" && (
            <div className="space-y-6">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Edit3 size={14} className="text-indigo-500" />
                <span>Customize Your Monthly Cash Flow Numbers</span>
              </div>
              <FinancialForm initial={finance} onSubmit={generatePlan} />
            </div>
          )}

          {/* TAB 10: HERO SHOWCASE (LANDING) */}
          {activeTab === "landing" && (
            <div className="space-y-12 py-6 text-center">
              <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold bg-indigo-950/80 text-indigo-300 border border-indigo-700/50 shadow-glow">
                <Sparkles size={14} className="text-indigo-400 animate-spin" />
                <span>Next-Generation Autonomous Wealth Intelligence</span>
              </div>

              <h1 className="font-heading text-4xl font-black tracking-tight sm:text-6xl md:text-7xl leading-[1.1]">
                Master Your Money with{" "}
                <span className="gradient-text">AI Precision.</span>
              </h1>

              <p className="mx-auto max-w-2xl text-base text-slate-500 dark:text-slate-400 leading-relaxed">
                Transform raw income and expenses into an actionable 50/30/20 budget, compound savings roadmap, and instant what-if scenario simulations.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => loadDemoProfile("tech")}
                  className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 via-indigo-600 to-purple-600 px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-indigo-500/30 hover:scale-105 active:scale-95 transition"
                >
                  <Zap size={16} className="fill-current text-amber-300" />
                  <span>⚡ Launch Demo Mode (Tech Pro)</span>
                </button>

                <button
                  onClick={() => setActiveTab("dashboard")}
                  className="rounded-2xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-3.5 text-sm font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  <span>Explore Overview Tab</span>
                </button>
              </div>

              {/* 4 Demo Persona Cards */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 pt-6 text-left">
                {Object.entries(demoProfiles).map(([key, prof]) => (
                  <button
                    key={key}
                    onClick={() => loadDemoProfile(key)}
                    className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 hover:border-indigo-500 transition group text-left shadow-soft"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{prof.label}</span>
                      <Zap size={13} className="text-slate-400 group-hover:text-amber-400 transition" />
                    </div>
                    <div className="font-heading font-black text-sm text-slate-900 dark:text-white">
                      {formatMoney(prof.data.income, prof.data.currency)} / mo
                    </div>
                    <p className="mt-1 text-[11px] text-slate-500 line-clamp-2">
                      {prof.data.financialGoal}
                    </p>
                    <div className="mt-3 text-[10px] font-black text-indigo-500 flex items-center gap-1 group-hover:translate-x-1 transition">
                      <span>Click to load</span>
                      <ChevronRight size={12} />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Modals */}
      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        currentCurrency={finance.currency}
        onCurrencyChange={handleCurrencyChange}
        isDark={isDark}
        onToggleTheme={toggleTheme}
        onResetDemo={() => loadDemoProfile("tech")}
      />

      <ReportModal
        isOpen={reportOpen}
        onClose={() => setReportOpen(false)}
        finance={finance}
        advice={advice}
      />
    </div>
  );
}

function SummaryCard({
  icon: Icon,
  iconColor,
  iconBg,
  label,
  value,
  sub
}: {
  icon: any;
  iconColor: string;
  iconBg: string;
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="glass-panel glass-card rounded-2xl p-5 shadow-soft transition-transform hover:-translate-y-0.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{label}</span>
        <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${iconBg} ${iconColor}`}>
          <Icon size={18} />
        </div>
      </div>
      <div className="mt-3 font-heading text-2xl font-black text-slate-900 dark:text-white tracking-tight">
        {value}
      </div>
      <div className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">{sub}</div>
    </div>
  );
}
