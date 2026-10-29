# FinWise AI – Intelligent Personal Finance Advisor & Wealth Dashboard

[![Deploy to GitHub Pages](https://github.com/mayurimundkar609-pixel/personal-finance-advisor-bot/actions/workflows/deploy.yml/badge.svg)](https://github.com/mayurimundkar609-pixel/personal-finance-advisor-bot/actions/workflows/deploy.yml)
[![Live Demo](https://img.shields.io/badge/Live_Demo-GitHub_Pages-4f46e5?style=flat&logo=github)](https://mayurimundkar609-pixel.github.io/personal-finance-advisor-bot/)
[![Vercel Deployment](https://img.shields.io/badge/Live_Demo-Vercel-000000?style=flat&logo=vercel)](https://personal-finance-advisor-bot-ten.vercel.app/)

A personal finance management, budgeting, and wealth planning platform built with **React**, **TypeScript**, **Tailwind CSS**, and **Python**. Features an **Autonomous Resilient Client-Side Heuristics Engine** providing zero-failure instant responsiveness, full 50/30/20 rule analytics, what-if scenario simulations, and AI-driven wealth advisory.

---

## 🌐 Live Demonstrations

- **GitHub Pages Live Link**: **[https://mayurimundkar609-pixel.github.io/personal-finance-advisor-bot/](https://mayurimundkar609-pixel.github.io/personal-finance-advisor-bot/)**
- **Vercel Live Link**: **[https://personal-finance-advisor-bot-ten.vercel.app/](https://personal-finance-advisor-bot-ten.vercel.app/)**

---

## ⚡ Core Features & Dashboard Modules

### 1. 📊 Executive Overview
- Real-time monthly cash flow: Inflow, Outflow, Net Monthly Surplus, and Target Savings.
- **Financial Health Stability Index Gauge** with dynamic scoring (0–100) and stability grade.
- 50/30/20 guideline compliance metrics and emergency runway calculations.

### 2. 🥧 50/30/20 Budgeting Rule Compliance
- Automated categorization into **Needs (50%)**, **Wants (30%)**, and **Savings (20%)**.
- Interactive visual progress bars comparing actual spend against target limits.

### 3. 🍩 Expense Analytics & Spending Donut
- Multi-colored interactive category breakdown (Housing, Food, Utilities, Transport, Entertainment, Healthcare).
- Inflow vs. Outflow ratio bar chart.
- Itemized monthly expense table with percentage of gross inflow and overhead flags.

### 4. 📈 Wealth Trajectory & Net Worth Projections
- 12-month forward-looking compound savings projection curve.
- Dynamic timeline estimation calculating exact months to target goal achievement.

### 5. 🎯 Goals & Milestone Roadmaps
- Milestone progress tracking at **25%**, **50%**, **75%**, and **100%** benchmarks.
- Automated deadline feasibility checks and monthly velocity requirements.

### 6. 🧮 Interactive What-If Scenario Simulator
- Live sliders for adjusting monthly income, cutting expenses, or boosting monthly savings.
- Instant calculations showing months saved towards your financial goals.

### 7. 🤖 AI Wealth Advisor & Action Plan
- Context-aware financial assistant answering questions and offering actionable strategies.
- 30-day step-by-step financial execution checklist.
- Personalized AI cost-cutting recommendations with estimated monthly rupee savings.

### 8. 📄 Audit Statements & Printable PDF Export
- Formal verified monthly wealth summary statement ready for printing or exporting to PDF.

### 9. ⚡ 1-Click Instant Demo Mode
Switch instantly between 4 realistic financial personas with 0ms lag:
- **Tech Professional**: ₹85,000 Inflow · ₹39,500 Outflow · Emergency Buffer Goal
- **College Student**: ₹22,000 Inflow · ₹16,800 Outflow · Tech & Education Goal
- **First-Time Home Buyer**: ₹140,000 Inflow · ₹68,000 Outflow · Down Payment Goal
- **Freelance Consultant**: ₹65,000 Inflow · ₹31,000 Outflow · Equipment & Buffer Goal

---

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide Icons, Recharts
- **Build System**: Vite (with relative base `./` for universal subdomain & root hosting)
- **Local Server**: Python 3 HTTPServer with full REST API (`server.py`)
- **Backend API**: Flask, SQLAlchemy, Google Gemini AI Service (`backend/`)
- **Deployment**: GitHub Pages (via GitHub Actions) + Vercel static rewrites

---

## 💻 Local Quickstart

### Method 1: 1-Click Launcher (Windows)
Double-click **`start_local_demo.bat`** in the repository root. It auto-detects Python or Node and opens **`http://localhost:5000/`**.

### Method 2: Python Unified Server
```bash
python server.py
```
Open **[http://localhost:5000/](http://localhost:5000/)** in your browser.

### Method 3: Vite Development Server
```bash
npm install
npm run dev
```
Open **[http://localhost:5173/](http://localhost:5173/)** in your browser.

---

## 📂 Repository Structure

```
personal-finance-advisor-bot/
├── .github/workflows/
│   └── deploy.yml            # Automated GitHub Pages CI/CD workflow
├── assets/                   # Pre-compiled production bundles (JS & CSS)
├── dist/                     # Full static production distribution
├── src/                      # Complete React + TypeScript source code
│   ├── components/           # UI cards, charts, modals, forms, and sidebars
│   ├── services/             # API client & local heuristic fallback engine
│   ├── App.tsx               # Primary dashboard & tab router
│   └── main.tsx              # React DOM bootstrap
├── backend/                  # Flask REST API & Gemini AI integration
│   ├── app.py                # Flask entry point
│   ├── ai_service.py         # AI financial advisory logic
│   └── models.py             # SQLAlchemy models
├── index.html                # Root entry point configured with relative paths
├── server.py                 # Standalone full-stack local server
├── start_local_demo.bat      # 1-click Windows runner
├── finance_data.json         # Local persistent ledger database
├── package.json              # Project dependencies and build scripts
├── vite.config.ts            # Vite configuration with base: "./"
├── vercel.json               # Vercel deployment routing configuration
└── README.md                 # Project documentation
```

---

## 👤 Author

**Mayuri Mundkar**
- GitHub: [@mayurimundkar609-pixel](https://github.com/mayurimundkar609-pixel)
