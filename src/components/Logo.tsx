import { Sparkles, TrendingUp } from "lucide-react";

export function Logo({ compact = false, onClick }: { compact?: boolean; onClick?: () => void }) {
  return (
    <div 
      onClick={onClick} 
      className={`group flex items-center gap-3 cursor-pointer select-none transition-transform active:scale-95 ${onClick ? "" : "pointer-events-none"}`}
    >
      <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25 transition-all duration-300 group-hover:shadow-indigo-500/40 group-hover:scale-105">
        <Sparkles size={20} className="transition-transform group-hover:rotate-12" />
        <div className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[9px] text-white ring-2 ring-white dark:ring-slate-900">
          <TrendingUp size={10} />
        </div>
      </div>
      {!compact && (
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-heading text-lg font-black tracking-tight text-slate-900 dark:text-white">
              FinWise<span className="text-indigo-600 dark:text-indigo-400">AI</span>
            </span>
            <span className="rounded-full bg-indigo-500/10 dark:bg-indigo-400/15 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              Pro v2.0
            </span>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
            Intelligent Wealth Suite
          </span>
        </div>
      )}
    </div>
  );
}
