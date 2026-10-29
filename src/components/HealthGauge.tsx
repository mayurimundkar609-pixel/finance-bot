import { ShieldCheck, TrendingUp, AlertTriangle, CheckCircle, Info } from "lucide-react";

interface HealthGaugeProps {
  score: number;
  grade: string;
  status: string;
  savingsRate: number;
  runwayMonths: number;
  needsPct: number;
}

export function HealthGauge({
  score,
  grade,
  status,
  savingsRate,
  runwayMonths,
  needsPct
}: HealthGaugeProps) {
  // SVG circular gauge math
  const radius = 62;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(100, Math.max(0, score)) / 100) * circumference;

  const getScoreColor = (s: number) => {
    if (s >= 80) return "text-emerald-500 stroke-emerald-500";
    if (s >= 65) return "text-indigo-500 stroke-indigo-500";
    if (s >= 50) return "text-amber-500 stroke-amber-500";
    return "text-rose-500 stroke-rose-500";
  };

  const getGradeBadge = (g: string) => {
    if (g.startsWith("A")) return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
    if (g.startsWith("B")) return "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20";
    if (g.startsWith("C")) return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
    return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20";
  };

  return (
    <div className="glass-panel glass-card rounded-2xl p-6 shadow-soft">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
            <ShieldCheck size={18} />
          </div>
          <div>
            <h3 className="font-heading font-bold text-slate-900 dark:text-white text-base">
              Financial Health Score
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              AI holistic stability index
            </p>
          </div>
        </div>
        <span className={`px-2.5 py-1 rounded-full text-xs font-black border ${getGradeBadge(grade)}`}>
          Grade {grade}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] items-center gap-6">
        {/* Circular Gauge */}
        <div className="relative flex flex-col items-center justify-center mx-auto">
          <svg className="w-36 h-36 -rotate-90 transform" viewBox="0 0 148 148">
            <circle
              cx="74"
              cy="74"
              r={radius}
              stroke="currentColor"
              strokeWidth="10"
              fill="transparent"
              className="text-slate-100 dark:text-slate-800"
            />
            <circle
              cx="74"
              cy="74"
              r={radius}
              stroke="currentColor"
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className={`transition-all duration-1000 ease-out ${getScoreColor(score)}`}
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="font-heading text-3xl font-black text-slate-900 dark:text-white">
              {score}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Out of 100
            </span>
          </div>
        </div>

        {/* Pillars of Financial Health */}
        <div className="space-y-3.5">
          <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
            {status}
          </div>

          {/* Metric 1: Savings Rate */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                Savings Velocity (Target: 20%+)
              </span>
              <span className={`font-bold ${savingsRate >= 20 ? "text-emerald-500" : "text-amber-500"}`}>
                {savingsRate}%
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  savingsRate >= 20 ? "bg-emerald-500" : "bg-amber-500"
                }`}
                style={{ width: `${Math.min(100, (savingsRate / 30) * 100)}%` }}
              />
            </div>
          </div>

          {/* Metric 2: Emergency Runway */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-500 dark:text-slate-400">
                Liquid Runway (Target: 6 mo)
              </span>
              <span className={`font-bold ${runwayMonths >= 6 ? "text-emerald-500" : "text-indigo-500"}`}>
                {runwayMonths} months
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div
                className="h-full rounded-full bg-indigo-500 transition-all duration-500"
                style={{ width: `${Math.min(100, (runwayMonths / 6) * 100)}%` }}
              />
            </div>
          </div>

          {/* Metric 3: Needs vs Income */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-500 dark:text-slate-400">
                Essential Needs Ratio (Target: &lt;50%)
              </span>
              <span className={`font-bold ${needsPct <= 50 ? "text-emerald-500" : needsPct <= 70 ? "text-amber-500" : "text-rose-500"}`}>
                {needsPct}%
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  needsPct <= 50 ? "bg-emerald-500" : needsPct <= 70 ? "bg-amber-500" : "bg-rose-500"
                }`}
                style={{ width: `${Math.min(100, needsPct)}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
