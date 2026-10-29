import { useState } from "react";
import { CheckSquare, Square, Calendar, Sparkles } from "lucide-react";
import type { ActionPlanItem } from "../services/api";

interface ActionPlanProps {
  items?: ActionPlanItem[];
}

export function ActionPlan({ items = [] }: ActionPlanProps) {
  const [completed, setCompleted] = useState<Record<number, boolean>>({});

  const toggle = (step: number) => {
    setCompleted(prev => ({ ...prev, [step]: !prev[step] }));
  };

  const defaultItems: ActionPlanItem[] = [
    { step: 1, task: "Automate designated savings transfer right after payday.", timeframe: "Day 1-3" },
    { step: 2, task: "Establish a discretionary spending weekly ceiling for dining and shopping.", timeframe: "Week 1" },
    { step: 3, task: "Audit streaming services and utility tariffs to reduce redundant overhead.", timeframe: "Week 2" },
    { step: 4, task: "Review actual category spending vs target budget allocations.", timeframe: "Week 4" }
  ];

  const planList = items && items.length > 0 ? items : defaultItems;
  const doneCount = Object.values(completed).filter(Boolean).length;

  return (
    <div className="glass-panel glass-card rounded-2xl p-6 shadow-soft">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
            <Sparkles size={18} />
          </div>
          <div>
            <h3 className="font-heading font-bold text-slate-900 dark:text-white text-base">
              30-Day Financial Action Plan
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              High-impact immediate wins to optimize wealth velocity
            </p>
          </div>
        </div>
        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
          {doneCount} of {planList.length} Done
        </span>
      </div>

      <div className="space-y-3">
        {planList.map((item, index) => {
          const isDone = !!completed[item.step];
          return (
            <div
              key={index}
              onClick={() => toggle(item.step)}
              className={`flex items-start gap-3.5 p-3.5 rounded-xl border cursor-pointer transition-all ${
                isDone
                  ? "bg-emerald-500/5 border-emerald-500/25 opacity-70"
                  : "bg-slate-50/70 dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800/80 hover:border-indigo-500/40 hover:bg-slate-100/60 dark:hover:bg-slate-800/40"
              }`}
            >
              <button
                type="button"
                className="mt-0.5 text-slate-400 hover:text-indigo-600 transition-colors"
              >
                {isDone ? (
                  <CheckSquare size={19} className="text-emerald-500" />
                ) : (
                  <Square size={19} />
                )}
              </button>
              <div className="flex-1">
                <div
                  className={`text-sm font-semibold transition-all ${
                    isDone
                      ? "line-through text-slate-400 dark:text-slate-500"
                      : "text-slate-800 dark:text-slate-200"
                  }`}
                >
                  {item.task}
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 dark:text-slate-500 mt-1">
                  <Calendar size={12} className="text-indigo-400" />
                  <span>{item.timeframe}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
