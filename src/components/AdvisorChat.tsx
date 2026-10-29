import { FormEvent, useState, useRef, useEffect } from "react";
import { Bot, Send, User, Copy, Check, Sparkles, Trash2, ShieldCheck, Loader2 } from "lucide-react";
import type { FinanceData } from "../services/api";
import { askAI, getCurrencySymbol } from "../services/api";

export function AdvisorChat({ finance }: { finance: FinanceData }) {
  const [question, setQuestion] = useState("");
  const sym = getCurrencySymbol(finance.currency);

  const [messages, setMessages] = useState<{ role: "ai" | "user"; text: string; time: string }[]>([
    {
      role: "ai",
      text: `Hello! I'm your FinWise AI Wealth Advisor. Ask me anything about your current budget, potential savings strategies, or goal timelines.`,
      time: "Just now"
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const quickPrompts = [
    `How can I save an extra ${sym}5,000 every month?`,
    "Evaluate my essential needs vs discretionary wants",
    "How does my emergency liquidity buffer look?",
    "Can I accelerate my savings goal by 3 months?"
  ];

  async function handleSend(qText?: string) {
    const q = (qText || question).trim();
    if (!q || loading) return;
    setQuestion("");

    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setMessages((prev) => [...prev, { role: "user", text: q, time: now }]);
    setLoading(true);

    try {
      const result = await askAI(finance, q);
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: result.answer,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        }
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: err.message || "Apologies, I encountered an issue analyzing your query. Please try again.",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        }
      ]);
    } finally {
      setLoading(false);
    }
  }

  const copyText = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const clearChat = () => {
    setMessages([
      {
        role: "ai",
        text: `Chat cleared. Feel free to ask a new question based on your updated plan.`,
        time: "Just now"
      }
    ]);
  };

  return (
    <section id="advisor" className="glass-panel glass-card rounded-2xl shadow-soft overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 p-5 md:p-6 bg-slate-50/50 dark:bg-slate-900/40">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-500/25">
            <Bot size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-heading font-bold text-slate-900 dark:text-white text-base">
                Ask FinWise AI Advisor
              </h3>
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Interactive financial intelligence tuned to your numbers
            </p>
          </div>
        </div>

        <button
          onClick={clearChat}
          className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Clear Conversation"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* Suggested Quick Prompt Pills */}
      <div className="px-5 pt-3 pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar">
        <Sparkles size={14} className="text-indigo-500 shrink-0" />
        <span className="text-[11px] font-bold text-slate-400 shrink-0">Try asking:</span>
        {quickPrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(p)}
            disabled={loading}
            className="whitespace-nowrap rounded-lg px-2.5 py-1 text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-200/60 dark:border-slate-700/60 transition-colors"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Chat Messages Log */}
      <div className="max-h-96 min-h-[220px] space-y-4 overflow-y-auto p-5 md:p-6 bg-slate-50/20 dark:bg-slate-950/20">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {m.role === "ai" && (
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-sm">
                <Bot size={16} />
              </div>
            )}

            <div className={`group relative max-w-[85%] md:max-w-[75%]`}>
              <div
                className={`rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line shadow-sm ${
                  m.role === "user"
                    ? "bg-indigo-600 text-white rounded-br-none"
                    : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200/60 dark:border-slate-700/60 rounded-bl-none"
                }`}
              >
                {m.text}
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 mt-1 px-1">
                <span>{m.time}</span>
                {m.role === "ai" && (
                  <button
                    onClick={() => copyText(m.text, i)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 hover:text-indigo-500"
                  >
                    {copiedIndex === i ? (
                      <>
                        <Check size={11} className="text-emerald-500" />
                        <span className="text-emerald-500">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy size={11} />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {m.role === "user" && (
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200">
                <User size={16} />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 pl-11">
            <Loader2 size={15} className="animate-spin" />
            FinWise AI is analyzing your numbers...
          </div>
        )}
        <div ref={chatBottomRef} />
      </div>

      {/* Input bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex gap-2 border-t border-slate-100 dark:border-slate-800 p-4 bg-white dark:bg-slate-900"
      >
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder={`Ask anything (e.g. "How can I reduce expenses by ${sym}3,000?")`}
          className="min-w-0 flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3 text-sm text-slate-900 dark:text-white outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition"
        />
        <button
          type="submit"
          disabled={!question.trim() || loading}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-40 transition shadow-md shadow-indigo-500/20"
        >
          <Send size={17} />
        </button>
      </form>
    </section>
  );
}
