import {
  LayoutDashboard,
  PieChart,
  LineChart,
  Target,
  Calculator,
  Bot,
  Settings,
  FileText,
  Moon,
  Sun,
  X,
  Sparkles,
  Zap,
  DollarSign,
  Receipt,
  Edit3
} from "lucide-react";
import { Logo } from "./Logo";

interface SidebarProps {
  active: string;
  onNavigate: (id: string) => void;
  mobileOpen: boolean;
  close: () => void;
  onOpenSettings: () => void;
  onOpenReport: () => void;
  onTriggerDemo: (profileKey?: string) => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

export const navItems = [
  { id: "dashboard", label: "Executive Overview", icon: LayoutDashboard, badge: "Live" },
  { id: "budget", label: "50/30/20 Budget", icon: PieChart, badge: "Rule" },
  { id: "expenses", label: "Expense Analytics", icon: Receipt, badge: "Donut" },
  { id: "cashflow", label: "Wealth Trajectory", icon: LineChart, badge: "12-Mo" },
  { id: "savings", label: "Goals & Milestones", icon: Target, badge: "Goals" },
  { id: "whatif", label: "What-If Simulator", icon: Calculator, badge: "Sim" },
  { id: "advisor", label: "AI Wealth Advisor", icon: Bot, badge: "AI" },
  { id: "reports", label: "Audit Statements", icon: FileText, badge: "Print" },
  { id: "form", label: "Edit My Numbers", icon: Edit3, badge: "Input" }
];

export function Sidebar({
  active,
  onNavigate,
  mobileOpen,
  close,
  onOpenSettings,
  onOpenReport,
  onTriggerDemo,
  isDark,
  onToggleTheme
}: SidebarProps) {
  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm md:hidden"
          onClick={close}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col justify-between border-r border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/95 p-5 backdrop-blur-xl transition-transform duration-300 md:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="overflow-y-auto pr-1">
          {/* Top Brand Header */}
          <div className="flex items-center justify-between pb-5 border-b border-slate-100 dark:border-slate-800">
            <Logo onClick={() => onNavigate("dashboard")} />
            <button
              onClick={close}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 md:hidden"
            >
              <X size={18} />
            </button>
          </div>

          {/* Quick Demo Mode Trigger Button */}
          <div className="mt-4">
            <button
              onClick={() => {
                onTriggerDemo("tech");
                close();
              }}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 via-indigo-600 to-purple-600 p-2.5 text-xs font-black text-white shadow-md shadow-indigo-500/25 hover:scale-[1.02] active:scale-95 transition"
            >
              <Zap size={14} className="fill-current text-amber-300 animate-pulse" />
              <span>⚡ One-Click Demo Mode</span>
            </button>
          </div>

          {/* Navigation Links with Badges */}
          <nav className="mt-5 space-y-1">
            <div className="px-2 pb-1.5 text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Dashboard Modules
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = active === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    close();
                  }}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-bold transition-all ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/25 scale-[1.02]"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon size={16} className={isActive ? "text-white" : "text-slate-400"} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded font-black tracking-wider uppercase ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Utility Controls */}
        <div className="space-y-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={onOpenReport}
            className="flex w-full items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-200/60 dark:border-slate-800 transition"
          >
            <span className="flex items-center gap-2">
              <FileText size={14} /> Official Statement
            </span>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-500 uppercase font-extrabold">
              PDF
            </span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onToggleTheme}
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-xl text-xs font-bold border border-slate-200/60 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              {isDark ? <Sun size={14} className="text-amber-400" /> : <Moon size={14} className="text-indigo-500" />}
              <span>{isDark ? "Light" : "Dark"}</span>
            </button>

            <button
              onClick={onOpenSettings}
              className="p-2 rounded-xl border border-slate-200/60 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title="Currency & Settings"
            >
              <Settings size={15} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
