export const API_BASE = "/api";


export type CurrencyCode = "INR" | "USD" | "EUR" | "GBP" | "CAD" | "AUD" | "JPY";

export const CURRENCY_SYMBOLS: Record<CurrencyCode, string> = {
  INR: "₹",
  USD: "$",
  EUR: "€",
  GBP: "£",
  CAD: "CA$",
  AUD: "A$",
  JPY: "¥"
};

export const getCurrencySymbol = (code: string = "INR"): string => {
  return CURRENCY_SYMBOLS[code as CurrencyCode] || "₹";
};

export const formatMoney = (amount: number, code: string = "INR"): string => {
  const sym = getCurrencySymbol(code);
  const rounded = Math.round(amount || 0);
  if (code === "INR") {
    return `${sym}${rounded.toLocaleString("en-IN")}`;
  }
  return `${sym}${rounded.toLocaleString("en-US")}`;
};

export type FinanceData = {
  income: number;
  otherIncome: number;
  currency: CurrencyCode;
  expenses: Record<string, number>;
  financialGoal: string;
  targetAmount: number;
  targetDate: string;
  currentSavings: number;
  riskPreference: "Conservative" | "Balanced" | "Aggressive";
  notes: string;
};

export type SavingSuggestion = {
  title: string;
  category?: string;
  explanation: string;
  estimated_monthly_impact: number;
  priority: "High" | "Medium" | "Low";
  difficulty?: "Easy" | "Medium" | "Hard";
};

export type Milestone = {
  percent: number;
  target_amount: number;
  achieved: boolean;
  months_away: number;
};

export type ActionPlanItem = {
  step: number;
  task: string;
  timeframe: string;
};

export type BudgetPlan = {
  total_income: number;
  total_expenses: number;
  available_balance: number;
  recommended_savings: number;
  needs: number;
  wants: number;
  savings: number;
  needs_pct?: number;
  wants_pct?: number;
  savings_pct?: number;
};

export type Advice = {
  budget_plan: BudgetPlan;
  health_score: number;
  health_grade: "A+" | "A" | "B" | "C" | "D";
  health_status: string;
  emergency_runway_months: number;
  saving_suggestions: SavingSuggestion[];
  monthly_summary: string;
  insights: string[];
  milestones?: Milestone[];
  action_plan?: ActionPlanItem[];
  disclaimer: string;
};

export type AdviceResponse = {
  data: Advice;
  demo_fallback: boolean;
};

// Client-side fallback calculator in case backend is offline or loading
export function generateLocalAdvice(finance: FinanceData): Advice {
  const income = (Number(finance.income) || 0) + (Number(finance.otherIncome) || 0);
  const expenses = finance.expenses || {};
  const total_expenses = Object.values(expenses).reduce((a, b) => a + (Number(b) || 0), 0);
  const balance = Math.max(income - total_expenses, 0);
  const sym = getCurrencySymbol(finance.currency);

  const needsKeys = ["housing", "food", "transportation", "utilities", "healthcare", "education"];
  const wantsKeys = ["entertainment", "shopping", "other"];

  let needs = 0;
  let wants = 0;
  for (const [k, v] of Object.entries(expenses)) {
    if (needsKeys.includes(k)) needs += Number(v) || 0;
    else wants += Number(v) || 0;
  }

  const recommended_savings = balance > 0 ? Math.max(500, Math.round((balance * 0.35) / 100) * 100) : 0;
  const current_savings = Number(finance.currentSavings) || 0;
  const target_amount = Number(finance.targetAmount) || 0;
  const remaining_goal = Math.max(target_amount - current_savings, 0);

  const runway_months = total_expenses > 0 ? Number((current_savings / total_expenses).toFixed(1)) : 0;
  const savings_rate = income > 0 ? Number(((recommended_savings / income) * 100).toFixed(1)) : 0;
  const needs_pct = income > 0 ? Number(((needs / income) * 100).toFixed(1)) : 0;
  const wants_pct = income > 0 ? Number(((wants / income) * 100).toFixed(1)) : 0;

  // Health Score
  const score_savings = Math.min(35, (savings_rate / 20) * 35);
  const score_runway = Math.min(35, (runway_months / 6) * 35);
  let score_needs = 30;
  if (needs_pct > 70) score_needs = Math.max(5, 15 - ((needs_pct - 70) / 30) * 10);
  else if (needs_pct > 50) score_needs = 30 - ((needs_pct - 50) / 20) * 15;

  const health_score = Math.max(10, Math.min(98, Math.round(score_savings + score_runway + score_needs)));
  const health_grade = health_score >= 85 ? "A+" : health_score >= 75 ? "A" : health_score >= 60 ? "B" : health_score >= 45 ? "C" : "D";
  const health_status = health_score >= 85 ? "Exceptional Financial Stability" : health_score >= 75 ? "Solid Financial Health" : health_score >= 60 ? "Moderate Stability – Room to Optimize" : "Budget Constrained – Focus on Buffer";

  const goal_months = recommended_savings > 0 ? Number((remaining_goal / recommended_savings).toFixed(1)) : 0;

  const milestones: Milestone[] = [0.25, 0.50, 0.75, 1.0].map(q => {
    const t = target_amount * q;
    const achieved = current_savings >= t;
    const months = !achieved && recommended_savings > 0 ? Number(((t - current_savings) / recommended_savings).toFixed(1)) : 0;
    return {
      percent: Math.round(q * 100),
      target_amount: Math.round(t),
      achieved,
      months_away: Math.max(0, months)
    };
  });

  const biggestEntry = Object.entries(expenses).sort((a, b) => (Number(b[1]) || 0) - (Number(a[1]) || 0))[0];
  const biggestName = biggestEntry ? biggestEntry[0].toUpperCase() : "HOUSING";
  const biggestVal = biggestEntry ? Number(biggestEntry[1]) || 0 : 0;

  return {
    budget_plan: {
      total_income: income,
      total_expenses,
      available_balance: balance,
      recommended_savings,
      needs,
      wants,
      savings: recommended_savings,
      needs_pct,
      wants_pct,
      savings_pct: savings_rate
    },
    health_score,
    health_grade,
    health_status,
    emergency_runway_months: runway_months,
    saving_suggestions: [
      {
        title: "Discretionary Spending Cap",
        category: "Lifestyle Optimization",
        explanation: `Set a weekly limit on leisure, shopping, and dining out. Trimming flexible categories by 15% recovers ${sym}${Math.round(wants * 0.15).toLocaleString()} each month.`,
        estimated_monthly_impact: Math.round(wants * 0.15) || 3500,
        priority: "High",
        difficulty: "Easy"
      },
      {
        title: "Automate Payday Transfer",
        category: "Savings Discipline",
        explanation: `Schedule an automatic standing transfer of ${sym}${recommended_savings.toLocaleString()} into your high-yield goal account immediately after income arrives.`,
        estimated_monthly_impact: recommended_savings,
        priority: "High",
        difficulty: "Easy"
      },
      {
        title: "Audit Essential Recurring Bills",
        category: "Overhead Reduction",
        explanation: `Review internet, mobile tariffs, and utility packages. Renegotiating plans typically frees up an estimated ${sym}${Math.round(Math.max(500, balance * 0.05)).toLocaleString()} per month.`,
        estimated_monthly_impact: Math.round(Math.max(500, balance * 0.05)),
        priority: "Medium",
        difficulty: "Medium"
      },
      {
        title: "Optimize Grocery & Food Outlays",
        category: "Daily Living",
        explanation: `Plan weekly grocery menus and minimize high-frequency app deliveries. Aim for an achievable 10% saving on groceries.`,
        estimated_monthly_impact: Math.round((Number(expenses.food) || 0) * 0.10) || 700,
        priority: "Low",
        difficulty: "Easy"
      }
    ],
    monthly_summary: `Your total monthly inflow is ${sym}${income.toLocaleString()} with committed outlays of ${sym}${total_expenses.toLocaleString()}, leaving an unallocated surplus of ${sym}${balance.toLocaleString()}. ${biggestName} is your largest expense line (${sym}${biggestVal.toLocaleString()}/mo). Your current liquid reserves represent ${runway_months} months of basic runway.`,
    insights: [
      `Primary cost driver: ${biggestName} at ${sym}${biggestVal.toLocaleString()} monthly.`,
      `Target savings velocity: ${sym}${recommended_savings.toLocaleString()} / month (${savings_rate}% savings rate).`,
      `Emergency liquidity buffer: ${runway_months} months of living overhead covered.`,
      goal_months > 0 ? `Target horizon: Goal completion in approx. ${goal_months} months at current pace.` : "Specify a target amount to calculate your milestone roadmap."
    ],
    milestones,
    action_plan: [
      { step: 1, task: `Set up auto-deposit of ${sym}${recommended_savings.toLocaleString()} right after payday.`, timeframe: "Week 1" },
      { step: 2, task: `Cap discretionary shopping to ${sym}${Math.round(wants * 0.85).toLocaleString()} this month.`, timeframe: "Week 2" },
      { step: 3, task: "Audit recurring streaming services and cancel at least one unused subscription.", timeframe: "Week 3" },
      { step: 4, task: "Review actual spending against budget categories and recalibrate.", timeframe: "Week 4" }
    ],
    disclaimer: "FinWise AI provides estimates and educational financial insights. It does not provide professional financial, investment, tax, or legal advice, and its recommendations do not guarantee financial outcomes."
  };
}

export async function getAdvice(finance: FinanceData): Promise<AdviceResponse> {
  try {
    const res = await fetch(`${API_BASE}/financial-advice`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(finance)
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error || `HTTP error ${res.status}`);
    }
    const data = await res.json();
    return data;
  } catch (err) {
    console.warn("Backend API unavailable or error occurred, using smart client-side simulation engine:", err);
    return {
      data: generateLocalAdvice(finance),
      demo_fallback: true
    };
  }
}

export async function askAI(finance: FinanceData, question: string): Promise<{ answer: string; demo_fallback: boolean }> {
  try {
    const res = await fetch(`${API_BASE}/ask`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ finance, question })
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error || `HTTP error ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.warn("Backend API unavailable for chat, using client fallback:", err);
    const sym = getCurrencySymbol(finance.currency);
    const inc = (Number(finance.income) || 0) + (Number(finance.otherIncome) || 0);
    const exp = Object.values(finance.expenses || {}).reduce((a, b) => a + (Number(b) || 0), 0);
    const bal = Math.max(inc - exp, 0);

    let answer = `Based on your numbers, your monthly surplus is approximately ${sym}${bal.toLocaleString()}. `;
    const q = question.toLowerCase();
    if (q.includes("save") || q.includes("more")) {
      answer += `To increase your monthly savings, the highest leverage comes from trimming discretionary shopping and dining out by 10-15%. That will reliably free up cash without affecting essential commitments.`;
    } else if (q.includes("rent") || q.includes("housing")) {
      answer += `Housing should ideally stay under 30-35% of your gross monthly income. Compare your rent against this benchmark to assess whether you're over-allocated to housing.`;
    } else if (q.includes("emergency") || q.includes("buffer")) {
      const runway = exp > 0 ? (finance.currentSavings / exp).toFixed(1) : "0";
      answer += `You currently have approximately ${runway} months of living expenses covered. Aiming for a 3 to 6-month buffer provides a resilient safety net.`;
    } else {
      answer += `Focusing on disciplined automated transfers right on payday is the most reliable way to stay ahead of your financial milestones.`;
    }
    return { answer, demo_fallback: true };
  }
}

export async function checkBackendHealth(): Promise<{ healthy: boolean; details?: any }> {
  try {
    const res = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(3000) });
    if (!res.ok) return { healthy: false };
    const details = await res.json();
    return { healthy: true, details };
  } catch {
    return { healthy: false };
  }
}
