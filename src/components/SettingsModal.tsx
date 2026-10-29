import { useState, useEffect } from "react";
import { X, Moon, Sun, DollarSign, Key, CheckCircle, Server, RefreshCw } from "lucide-react";
import { type CurrencyCode, CURRENCY_SYMBOLS, checkBackendHealth } from "../services/api";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCurrency: CurrencyCode;
  onCurrencyChange: (c: CurrencyCode) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  onResetDemo: () => void;
}

export function SettingsModal({
  isOpen,
  onClose,
  currentCurrency,
  onCurrencyChange,
  isDark,
  onToggleTheme,
  onResetDemo
}: SettingsModalProps) {
  const [healthStatus, setHealthStatus] = useState<{ healthy: boolean; details?: any } | null>(null);
  const [checking, setChecking] = useState(false);

  const checkStatus = async () => {
    setChecking(true);
    const result = await checkBackendHealth();
    setHealthStatus(result);
    setChecking(false);
  };

  useEffect(() => {
    if (isOpen) {
      checkStatus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currencies: { code: CurrencyCode; name: string }[] = [
    { code: "INR", name: "INR – Indian Rupee (₹)" },
    { code: "USD", name: "USD – US Dollar ($)" },
    { code: "EUR", name: "EUR – Euro (€)" },
    { code: "GBP", name: "GBP – British Pound (£)" },
    { code: "CAD", name: "CAD – Canadian Dollar (CA$)" },
    { code: "AUD", name: "AUD – Australian Dollar (A$)" },
    { code: "JPY", name: "JPY – Japanese Yen (¥)" }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-float-in">
      <div className="glass-panel w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <DollarSign size={18} />
            </div>
            <div>
              <h3 className="font-heading font-bold text-base">FinWise Preferences</h3>
              <p className="text-xs text-slate-400">Customize currency and appearance</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Currency selection */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Default Currency
            </label>
            <div className="grid grid-cols-1 gap-2">
              {currencies.map((c) => (
                <button
                  key={c.code}
                  onClick={() => onCurrencyChange(c.code)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                    currentCurrency === c.code
                      ? "bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-600 dark:text-indigo-400"
                      : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  <span>{c.name}</span>
                  {currentCurrency === c.code && <CheckCircle size={15} className="text-indigo-600 dark:text-indigo-400" />}
                </button>
              ))}
            </div>
          </div>

          {/* Theme Switcher */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Visual Appearance
            </label>
            <button
              onClick={onToggleTheme}
              className="flex w-full items-center justify-between px-3.5 py-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition"
            >
              <div className="flex items-center gap-2.5">
                {isDark ? <Moon size={16} className="text-indigo-400" /> : <Sun size={16} className="text-amber-500" />}
                <span className="text-xs font-bold">{isDark ? "Dark Fintech Theme" : "Light Modern Theme"}</span>
              </div>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
                Switch
              </span>
            </button>
          </div>

          {/* Backend Status indicator */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
            <div className="flex items-center justify-between mb-1.5">
              <span className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300">
                <Server size={14} className="text-indigo-500" /> API Engine Status
              </span>
              <button
                onClick={checkStatus}
                className="text-slate-400 hover:text-indigo-500 transition"
                title="Refresh Status"
              >
                <RefreshCw size={12} className={checking ? "animate-spin" : ""} />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  healthStatus?.healthy ? "bg-emerald-500" : "bg-amber-500"
                }`}
              />
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {healthStatus?.healthy
                  ? `Flask Connected (${healthStatus.details?.gemini_active ? "Gemini Key Active" : "Smart Fallback Active"})`
                  : "Client-side simulation active (Standalone mode)"}
              </span>
            </div>
          </div>

          {/* Reset Demo Data button */}
          <button
            onClick={() => {
              onResetDemo();
              onClose();
            }}
            className="w-full py-2.5 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition"
          >
            Reset to Sample Demo Dataset
          </button>
        </div>
      </div>
    </div>
  );
}
