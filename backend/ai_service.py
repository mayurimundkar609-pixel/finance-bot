"""
AI Service for Personal Finance Advisor Bot
Handles structured prompt engineering and API calls using Google Gemini
"""
import os
import json
from google import genai
from google.genai import types

def get_gemini_client():
    api_key = os.environ.get('GEMINI_API_KEY')
    if not api_key:
        return None
    return genai.Client(api_key=api_key)

def generate_financial_advice(financial_data):
    """
    financial_data dictionary contains:
    - monthly_income
    - monthly_expenses
    - monthly_savings
    - budget
    - category_expenses (dict)
    - category_budgets (dict)
    - savings_goals (list)
    - currency
    """
    client = get_gemini_client()
    currency = financial_data.get('currency', '₹')
    
    # Prompt Engineering Structure (Module 9)
    prompt = f"""
    You are an expert AI Personal Finance Advisor Bot.
    Analyze the following user financial profile:

    Monthly Income: {currency}{financial_data['monthly_income']:,.2f}
    Monthly Expenses: {currency}{financial_data['monthly_expenses']:,.2f}
    Monthly Savings: {currency}{financial_data['monthly_savings']:,.2f}
    Configured Budget: {currency}{financial_data['budget']:,.2f}

    Category-wise Expenses:
    {json.dumps(financial_data['category_expenses'], indent=2)}

    Category-wise Budgets:
    {json.dumps(financial_data['category_budgets'], indent=2)}

    Active Savings Goals:
    {json.dumps(financial_data['savings_goals'], indent=2)}

    Please return a valid JSON object with the following structured keys:
    1. spending_summary: (string) Overall spending behavior analysis.
    2. overspending_categories: (list of dicts with category, spent, budget, excess, severity)
    3. recommended_budget: (list of dicts with category, suggested_limit, rationale)
    4. savings_suggestions: (list of actionable tips)
    5. cost_cutting_suggestions: (list of practical reduction areas)
    6. emergency_fund_suggestion: (dict with target_months, recommended_target, steps_to_reach)
    7. next_month_action_plan: (list of 4 sequential steps)
    8. financial_health_score: (integer 0-100)
    9. financial_health_grade: (string A, B, C, D, or F)
    """

    if not client:
        # Graceful rule-based fallback when offline or no API key
        return generate_rule_based_fallback(financial_data)

    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type='application/json'
            )
        )
        return json.loads(response.text)
    except Exception as e:
        print(f"Gemini API error: {e}")
        return generate_rule_based_fallback(financial_data)

def generate_rule_based_fallback(data):
    currency = data.get('currency', '₹')
    income = data['monthly_income']
    expenses = data['monthly_expenses']
    savings = data['monthly_savings']
    cat_exp = data.get('category_expenses', {})
    cat_bud = data.get('category_budgets', {})

    overspending = []
    recommended = []
    for cat, spent in cat_exp.items():
        limit = cat_bud.get(cat, data['budget'] * 0.15 if data['budget'] else spent)
        if spent > limit and limit > 0:
            overspending.append({
                'category': cat,
                'spent': spent,
                'budget': limit,
                'excess': spent - limit,
                'severity': 'high' if (spent / limit) > 1.3 else 'moderate'
            })
        recommended.append({
            'category': cat,
            'suggested_limit': round(spent * 0.9, -1),
            'rationale': f'Calculated 10% reduction benchmark for {cat}'
        })

    savings_rate = (savings / income * 100) if income > 0 else 0
    score = min(100, max(20, int(50 + savings_rate)))
    grade = 'A' if score >= 85 else 'B' if score >= 70 else 'C' if score >= 55 else 'D'

    return {
        'spending_summary': f'Your monthly income is {currency}{income:,.2f} with total expenses of {currency}{expenses:,.2f}, yielding {currency}{savings:,.2f} net savings (Savings rate: {savings_rate:.1f}%).',
        'overspending_categories': overspending,
        'recommended_budget': recommended,
        'savings_suggestions': [
            'Direct at least 20% of monthly income into a dedicated savings reserve immediately upon receipt.',
            'Audit recurring subscriptions and cancel unused memberships.'
        ],
        'cost_cutting_suggestions': [
            'Plan weekly grocery lists to curb impulsive food takeaway purchases.',
            'Utilize student/commuter passes to minimize transit expenditures.'
        ],
        'emergency_fund_suggestion': {
            'target_months': 3,
            'recommended_target': expenses * 3,
            'steps_to_reach': f'Save {currency}{expenses * 0.5:,.2f} per month to complete an emergency fund in 6 months.'
        },
        'next_month_action_plan': [
            'Set strict spending caps on top categories before the first week begins.',
            'Log each expenditure on the day it occurs.',
            'Review budget utilization midway through the month.'
        ],
        'financial_health_score': score,
        'financial_health_grade': grade
    }
