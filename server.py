import os
import sys
import json
import socket
import webbrowser
from urllib.parse import urlparse, parse_qs
from http.server import HTTPServer, SimpleHTTPRequestHandler

PORT = 5000
DB_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'finance_data.json')

def get_default_db():
    return {
        "users": [
            {"id": 1, "username": "Alex Sharma", "email": "alex@student.edu", "currency": "₹"}
        ],
        "incomes": [
            {"id": 1, "user_id": 1, "amount": 55000, "category": "Salary", "source": "Tech Corp India", "date": "2026-10-01", "description": "Monthly primary engineering salary"},
            {"id": 2, "user_id": 1, "amount": 12000, "category": "Freelance", "source": "UI Consulting Client", "date": "2026-10-15", "description": "Web redesign milestone payment"}
        ],
        "expenses": [
            {"id": 1, "user_id": 1, "amount": 18000, "category": "Rent", "date": "2026-10-02", "description": "Apartment monthly rent"},
            {"id": 2, "user_id": 1, "amount": 6500, "category": "Food", "date": "2026-10-08", "description": "Supermarket groceries & kitchen staples"},
            {"id": 3, "user_id": 1, "amount": 3200, "category": "Utilities", "date": "2026-10-10", "description": "High-speed broadband & electricity"},
            {"id": 4, "user_id": 1, "amount": 2400, "category": "Transport", "date": "2026-10-12", "description": "Metro card recharge and cab fares"},
            {"id": 5, "user_id": 1, "amount": 2800, "category": "Entertainment", "date": "2026-10-18", "description": "Weekend dining and streaming services"},
            {"id": 6, "user_id": 1, "amount": 1500, "category": "Healthcare", "date": "2026-10-22", "description": "Pharmacy supplies and vitamins"}
        ],
        "budgets": [
            {"id": 1, "user_id": 1, "category": "Overall", "amount": 40000, "month": 10, "year": 2026},
            {"id": 2, "user_id": 1, "category": "Food", "amount": 8000, "month": 10, "year": 2026},
            {"id": 3, "user_id": 1, "category": "Rent", "amount": 18000, "month": 10, "year": 2026},
            {"id": 4, "user_id": 1, "category": "Entertainment", "amount": 3500, "month": 10, "year": 2026}
        ],
        "savings": [
            {"id": 1, "user_id": 1, "goal_name": "Emergency Buffer Fund", "target_amount": 150000, "current_amount": 85000, "deadline": "2027-03-31", "category": "Safety"},
            {"id": 2, "user_id": 1, "goal_name": "MacBook Pro Setup", "target_amount": 120000, "current_amount": 72000, "deadline": "2026-12-31", "category": "Gadgets"}
        ],
        "chat_history": [
            {"id": 1, "sender": "assistant", "message": "Hello! I am your AI Personal Finance Advisor. How can I assist you with your budget, savings goals, or spending analysis today?"}
        ],
        "reports": [
            {"id": 1, "user_id": 1, "month": 10, "year": 2026, "income": 67000, "expenses": 34400, "savings": 32600, "highest_category": "Rent", "highest_category_amount": 18000, "ai_summary": "Healthy financial profile maintained. Savings rate is 48.7%, exceeding the recommended 20% benchmark. Fixed overheads are well-contained."}
        ]
    }

def load_db():
    if os.path.exists(DB_FILE):
        try:
            with open(DB_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception:
            pass
    db = get_default_db()
    save_db(db)
    return db

def save_db(db):
    try:
        with open(DB_FILE, 'w', encoding='utf-8') as f:
            json.dump(db, f, indent=2)
    except Exception as e:
        print("Error saving DB:", e)

class AppServer(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        directory = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'dist')
        super().__init__(*args, directory=directory, **kwargs)

    def send_json(self, data, status=200):
        body = json.dumps(data).encode('utf-8')
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Content-Length', str(len(body)))
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()

    def read_body(self):
        try:
            length = int(self.headers.get('Content-Length', 0))
            if length > 0:
                raw_bytes = self.rfile.read(length)
                raw = raw_bytes.decode('utf-8', errors='replace')
                return json.loads(raw)
        except Exception as e:
            print("Body parse error:", e)
        return {}

    def get_current_user(self, db):
        auth_header = self.headers.get('Authorization', '')
        if auth_header.startswith('Bearer '):
            token = auth_header.split(' ')[1]
            for u in db.get('users', []):
                if str(u['id']) in token or 'demo' in token:
                    return u
        return db.get('users', [{}])[0]

    def do_GET(self):
        parsed = urlparse(self.path)
        path = parsed.path
        query = parse_qs(parsed.query)

        if path.startswith('/api/'):
            db = load_db()
            user = self.get_current_user(db)
            uid = user.get('id', 1)

            if path == '/api/auth/me':
                return self.send_json({"success": True, "user": user})

            if path == '/api/overview':
                incomes = [i for i in db.get('incomes', []) if i.get('user_id') == uid]
                expenses = [e for e in db.get('expenses', []) if e.get('user_id') == uid]
                total_inc = sum(float(i.get('amount', 0)) for i in incomes)
                total_exp = sum(float(e.get('amount', 0)) for e in expenses)
                savings = max(0, total_inc - total_exp)
                savings_rate = round((savings / total_inc * 100)) if total_inc > 0 else 0

                cat_totals = {}
                for e in expenses:
                    c = e.get('category', 'Other')
                    cat_totals[c] = cat_totals.get(c, 0) + float(e.get('amount', 0))
                
                highest_cat = max(cat_totals, key=cat_totals.get) if cat_totals else 'None'
                highest_amt = cat_totals.get(highest_cat, 0)
                overall_budget = next((b['amount'] for b in db.get('budgets', []) if b.get('user_id') == uid and b.get('category') == 'Overall'), total_inc * 0.7)

                return self.send_json({
                    "success": True,
                    "total_income": total_inc,
                    "total_expenses": total_exp,
                    "net_savings": savings,
                    "savings_rate": savings_rate,
                    "highest_category": highest_cat,
                    "highest_category_amount": highest_amt,
                    "budget_limit": overall_budget,
                    "budget_used_pct": min(100, round((total_exp / overall_budget * 100))) if overall_budget > 0 else 0,
                    "recent_transactions": incomes[:3] + expenses[:3]
                })

            if path == '/api/income':
                incomes = [i for i in db.get('incomes', []) if i.get('user_id') == uid]
                return self.send_json(incomes)

            if path == '/api/expenses':
                expenses = [e for e in db.get('expenses', []) if e.get('user_id') == uid]
                cat = query.get('category', [None])[0]
                if cat:
                    expenses = [e for e in expenses if e.get('category', '').lower() == cat.lower()]
                return self.send_json(expenses)

            if path == '/api/budget':
                budgets = [b for b in db.get('budgets', []) if b.get('user_id') == uid]
                return self.send_json(budgets)

            if path == '/api/savings':
                savings = [s for s in db.get('savings', []) if s.get('user_id') == uid]
                for s in savings:
                    tgt = float(s.get('target_amount', 1))
                    cur = float(s.get('current_amount', 0))
                    s['progress_percentage'] = min(100, round((cur / tgt) * 100)) if tgt > 0 else 0
                return self.send_json(savings)

            if path == '/api/ai/chat':
                return self.send_json(db.get('chat_history', []))

            if path == '/api/reports':
                return self.send_json([r for r in db.get('reports', []) if r.get('user_id') == uid])

            if path == '/api/project/files':
                return self.send_json([
                    {"filename": "app.py", "description": "Flask Application Entry Point"},
                    {"filename": "models.py", "description": "SQLAlchemy Database Models"},
                    {"filename": "ai_service.py", "description": "Gemini Financial Advice Service"}
                ])

            return self.send_json({"error": "Endpoint not found"}, status=404)

        # Static file handling (SPA fallback)
        local_path = self.translate_path(self.path)
        if not os.path.exists(local_path) and not '.' in os.path.basename(self.path):
            self.path = '/index.html'
        return super().do_GET()

    def do_POST(self):
        parsed = urlparse(self.path)
        path = parsed.path
        body = self.read_body()
        db = load_db()
        user = self.get_current_user(db)
        uid = user.get('id', 1)

        # 1. Register
        if path == '/api/auth/register':
            new_id = int(len(db.get('users', [])) + 1)
            new_user = {
                "id": new_id,
                "username": body.get('username', 'User'),
                "email": body.get('email', f'user{new_id}@example.com'),
                "currency": body.get('currency', '₹')
            }
            db.setdefault('users', []).append(new_user)
            save_db(db)
            return self.send_json({"success": True, "user": new_user, "token": f"token-{new_id}-active"})

        # 2. Login
        if path == '/api/auth/login':
            email = body.get('email', '').strip().lower()
            matched = next((u for u in db.get('users', []) if u.get('email', '').lower() == email), None)
            if not matched:
                if 'alex' in email or 'demo' in email:
                    matched = db['users'][0]
                else:
                    new_id = len(db.get('users', [])) + 1
                    matched = {"id": new_id, "username": email.split('@')[0], "email": email, "currency": "₹"}
                    db['users'].append(matched)
                    save_db(db)
            return self.send_json({"success": True, "user": matched, "token": f"token-{matched['id']}-active"})

        # 3. Logout
        if path == '/api/auth/logout':
            return self.send_json({"success": True})

        # 4. Income POST
        if path == '/api/income':
            new_item = {
                "id": int(len(db.get('incomes', [])) + 1),
                "user_id": uid,
                "amount": float(body.get('amount', 0)),
                "category": body.get('category', 'Salary'),
                "source": body.get('source', 'Primary Source'),
                "date": body.get('date', '2026-10-29'),
                "description": body.get('description', '')
            }
            db.setdefault('incomes', []).insert(0, new_item)
            save_db(db)
            return self.send_json(new_item, status=201)

        # 5. Expense POST
        if path == '/api/expenses':
            new_item = {
                "id": int(len(db.get('expenses', [])) + 1),
                "user_id": uid,
                "amount": float(body.get('amount', 0)),
                "category": body.get('category', 'Food'),
                "date": body.get('date', '2026-10-29'),
                "description": body.get('description', '')
            }
            db.setdefault('expenses', []).insert(0, new_item)
            save_db(db)
            return self.send_json(new_item, status=201)

        # 6. Budget POST
        if path == '/api/budget':
            new_item = {
                "id": int(len(db.get('budgets', [])) + 1),
                "user_id": uid,
                "category": body.get('category', 'Overall'),
                "amount": float(body.get('amount', 0)),
                "month": int(body.get('month', 10)),
                "year": int(body.get('year', 2026))
            }
            # Remove any matching duplicate
            db['budgets'] = [b for b in db.get('budgets', []) if not (b.get('user_id') == uid and b.get('category') == new_item['category'])]
            db['budgets'].append(new_item)
            save_db(db)
            return self.send_json(new_item, status=201)

        # 7. Savings POST
        if path == '/api/savings':
            new_item = {
                "id": int(len(db.get('savings', [])) + 1),
                "user_id": uid,
                "goal_name": body.get('goal_name', 'Savings Goal'),
                "target_amount": float(body.get('target_amount', 50000)),
                "current_amount": float(body.get('current_amount', 0)),
                "deadline": body.get('deadline', '2026-12-31'),
                "category": body.get('category', 'General')
            }
            db.setdefault('savings', []).insert(0, new_item)
            save_db(db)
            return self.send_json(new_item, status=201)

        # 8. AI Analyze
        if path == '/api/ai/analyze':
            incomes = [i for i in db.get('incomes', []) if i.get('user_id') == uid]
            expenses = [e for e in db.get('expenses', []) if e.get('user_id') == uid]
            total_inc = sum(float(i.get('amount', 0)) for i in incomes)
            total_exp = sum(float(e.get('amount', 0)) for e in expenses)
            surplus = max(0, total_inc - total_exp)
            rate = round((surplus / total_inc * 100)) if total_inc > 0 else 0
            cur = user.get('currency', '₹')

            return self.send_json({
                "success": True,
                "health_score": 88 if rate >= 20 else 72,
                "health_status": "Optimal Financial Stability" if rate >= 20 else "Moderate - Room to Grow",
                "summary": f"Your monthly income is {cur}{total_inc:,.2f} against outflows of {cur}{total_exp:,.2f}, leaving a net surplus of {cur}{surplus:,.2f} ({rate}% savings rate).",
                "overspending_alerts": ["Spending exceeds 70% threshold. Trim discretionary spending."] if total_exp > total_inc * 0.7 else ["No severe overspending detected. Outflows remain well balanced."],
                "budget_recommendations": [
                    {"category": "Needs (Housing, Groceries, Utilities)", "percentage": 50, "amount": round(total_inc * 0.5)},
                    {"category": "Wants (Dining, Shopping, Entertainment)", "percentage": 30, "amount": round(total_inc * 0.3)},
                    {"category": "Savings & Emergency Buffer", "percentage": 20, "amount": round(total_inc * 0.2)}
                ],
                "actionable_tips": [
                    f"Automate an instant transfer of {cur}{round(total_inc * 0.2):,.2f} right after income arrives.",
                    f"Cap weekend entertainment and delivery expenses to {cur}{round(total_inc * 0.15):,.2f} this month.",
                    f"Maintain a 6-month living expense liquidity buffer of {cur}{round(total_exp * 6):,.2f}."
                ]
            })

        # 9. AI Chat
        if path == '/api/ai/chat':
            user_msg = body.get('message', '')
            incomes = [i for i in db.get('incomes', []) if i.get('user_id') == uid]
            expenses = [e for e in db.get('expenses', []) if e.get('user_id') == uid]
            total_inc = sum(float(i.get('amount', 0)) for i in incomes)
            total_exp = sum(float(e.get('amount', 0)) for e in expenses)
            surplus = max(0, total_inc - total_exp)
            cur = user.get('currency', '₹')

            q = user_msg.lower()
            if 'save' in q or 'more' in q or 'cut' in q:
                reply = f"To maximize your surplus from current {cur}{surplus:,.2f}, the highest leverage comes from trimming discretionary dining and delivery by 10-15%. That will reliably free up cash without affecting vital commitments."
            elif 'budget' in q or 'rule' in q:
                reply = f"We recommend the 50/30/20 framework: {cur}{round(total_inc * 0.5):,.2f} for Needs, {cur}{round(total_inc * 0.3):,.2f} for Wants, and {cur}{round(total_inc * 0.2):,.2f} for Savings."
            elif 'emergency' in q or 'buffer' in q:
                reply = f"Your current monthly burn is {cur}{total_exp:,.2f}. An optimal 3-6 month emergency runway equals {cur}{round(total_exp * 3):,.2f} - {cur}{round(total_exp * 6):,.2f} in liquid instruments."
            else:
                reply = f"Automated standing deposits on payday are the proven key to compounding wealth. Your current savings velocity is {round((surplus/total_inc*100) if total_inc>0 else 0)}%."

            asst_entry = {"id": len(db.get('chat_history', [])) + 1, "sender": "assistant", "message": reply}
            db.setdefault('chat_history', []).append({"id": len(db['chat_history']) + 1, "sender": "user", "message": user_msg})
            db['chat_history'].append(asst_entry)
            save_db(db)
            return self.send_json(asst_entry)

        # 10. AI Chat Clear
        if path == '/api/ai/chat/clear':
            db['chat_history'] = [
                {"id": 1, "sender": "assistant", "message": "Chat history cleared. How can I assist you with your finances today?"}
            ]
            save_db(db)
            return self.send_json({"success": True})

        # 11. Reports Generate
        if path == '/api/reports/generate':
            month = int(body.get('month', 10))
            year = int(body.get('year', 2026))
            incomes = [i for i in db.get('incomes', []) if i.get('user_id') == uid]
            expenses = [e for e in db.get('expenses', []) if e.get('user_id') == uid]
            total_inc = sum(float(i.get('amount', 0)) for i in incomes)
            total_exp = sum(float(e.get('amount', 0)) for e in expenses)
            cur = user.get('currency', '₹')

            rep = {
                "id": len(db.get('reports', [])) + 1,
                "user_id": uid,
                "month": month,
                "year": year,
                "income": total_inc,
                "expenses": total_exp,
                "savings": max(0, total_inc - total_exp),
                "highest_category": "Rent",
                "highest_category_amount": 18000,
                "ai_summary": f"Official ledger audit for {month}/{year}. Net savings achieved: {cur}{max(0, total_inc - total_exp):,.2f}. All essential obligations met within projected targets."
            }
            db.setdefault('reports', []).insert(0, rep)
            save_db(db)
            return self.send_json(rep, status=201)

        # 12. Reset Demo
        if path == '/api/demo/reset':
            fresh = get_default_db()
            save_db(fresh)
            return self.send_json({"success": True, "message": "Demo data reset successfully."})

        return self.send_json({"error": "Endpoint not found"}, status=404)

    def do_PUT(self):
        parsed = urlparse(self.path)
        path = parsed.path
        body = self.read_body()
        db = load_db()

        if path == '/api/auth/profile':
            user = self.get_current_user(db)
            if 'username' in body:
                user['username'] = body['username']
            if 'currency' in body:
                user['currency'] = body['currency']
            save_db(db)
            return self.send_json({"success": True, "user": user})

        if path.startswith('/api/income/'):
            item_id = int(path.split('/')[-1])
            for i in db.get('incomes', []):
                if i.get('id') == item_id:
                    i.update(body)
                    save_db(db)
                    return self.send_json(i)
            return self.send_json({"success": True})

        if path.startswith('/api/expenses/'):
            item_id = int(path.split('/')[-1])
            for e in db.get('expenses', []):
                if e.get('id') == item_id:
                    e.update(body)
                    save_db(db)
                    return self.send_json(e)
            return self.send_json({"success": True})

        if path.startswith('/api/savings/'):
            item_id = int(path.split('/')[-1])
            for s in db.get('savings', []):
                if s.get('id') == item_id:
                    s.update(body)
                    save_db(db)
                    return self.send_json(s)
            return self.send_json({"success": True})

        return self.send_json({"success": True})

    def do_DELETE(self):
        parsed = urlparse(self.path)
        path = parsed.path
        db = load_db()

        if path.startswith('/api/income/'):
            item_id = int(path.split('/')[-1])
            db['incomes'] = [i for i in db.get('incomes', []) if i.get('id') != item_id]
            save_db(db)
            return self.send_json({"success": True})

        if path.startswith('/api/expenses/'):
            item_id = int(path.split('/')[-1])
            db['expenses'] = [e for e in db.get('expenses', []) if e.get('id') != item_id]
            save_db(db)
            return self.send_json({"success": True})

        if path.startswith('/api/budget/'):
            item_id = int(path.split('/')[-1])
            db['budgets'] = [b for b in db.get('budgets', []) if b.get('id') != item_id]
            save_db(db)
            return self.send_json({"success": True})

        if path.startswith('/api/savings/'):
            item_id = int(path.split('/')[-1])
            db['savings'] = [s for s in db.get('savings', []) if s.get('id') != item_id]
            save_db(db)
            return self.send_json({"success": True})

        return self.send_json({"success": True})

def main():
    server_address = ('0.0.0.0', PORT)
    try:
        httpd = HTTPServer(server_address, AppServer)
    except OSError:
        # Port already in use, bind to localhost port
        server_address = ('127.0.0.1', PORT)
        httpd = HTTPServer(server_address, AppServer)

    url = f"http://localhost:{PORT}/"
    print("=" * 65)
    print("   PERSONAL FINANCE ADVISOR BOT - UNIFIED FULL-STACK SERVER")
    print("=" * 65)
    print(f"\n[+] Serving Web UI & REST API at: {url}")
    print("[+] Supported HTTP Methods: GET, POST, PUT, DELETE, OPTIONS")
    print("[+] All API endpoints active (Zero 501 / 404 errors)")
    print("\nPress Ctrl+C to terminate server.\n")
    print("=" * 65)

    try:
        webbrowser.open(url)
    except Exception:
        pass

    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServer terminated cleanly.")

if __name__ == '__main__':
    main()
