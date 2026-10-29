# College Project Viva Examination Guide
## Personal Finance Advisor Bot (AI + Full-Stack FinTech)

### 1. What is the core problem solved by this project?
**Answer:** Many individuals, students, and young professionals struggle with financial discipline due to manual tracking friction and lack of personalized financial expertise. This project automates income/expense tracking, calculates real-time budget utilization, detects category overspending, monitors savings milestones, and leverages Generative AI (Google Gemini) to provide structured financial recommendations (such as 50/30/20 budget allocations and emergency fund targets).

---

### 2. Explain the system architecture and data isolation.
**Answer:** The system implements a three-tier architecture:
1. **Presentation Layer:** Responsive, accessible web interface with interactive visual charts (category donuts, monthly trend bars, progress meters).
2. **Application / Business Layer:** Flask REST API with role-isolated controllers, authentication services, and an AI prompt engineering pipeline.
3. **Persistence Layer:** Relational schema (SQLAlchemy) with foreign-key constraints linking User, Income, Expense, Budget, SavingsGoal, and FinancialReport.
- **Data Isolation:** All queries explicitly filter by \`current_user.id\` or authenticated token, ensuring zero cross-tenant data leakage.

---

### 3. How does the AI integration work?
**Answer:** The system does not send unformatted user chat to the model. Instead, it extracts verified database records (monthly income, total expenses, category-wise expenditure, current budget limits, and savings goals) and injects them into a structured prompt using prompt engineering principles. The model (Gemini 2.5/3.8 Flash) is configured to return strict JSON matching an exact schema (spending summary, overspending alerts, recommended category caps, cost-cutting tips, emergency fund milestones, and next-month action steps).

---

### 4. What is the difference between factual calculations and AI recommendations?
**Answer:** Factual calculations (e.g., \`Remaining Budget = Budget - Expenses\`, \`Savings Progress % = (Current / Target) * 100\`) are computed deterministically in the backend code and database queries. The AI is used purely for heuristic analysis, pattern detection, budgeting recommendations, and cost-cutting suggestions. This ensures mathematical accuracy without hallucination.

---

### 5. How do you deploy and demonstrate with Ngrok?
**Answer:**
1. Run \`python app.py\` (or start the web server on local port).
2. Run \`ngrok http 5000\` in terminal.
3. Ngrok creates a secure public HTTPS tunnel to the local server.
4. Open the generated HTTPS URL on any mobile device or external browser for remote evaluation.
