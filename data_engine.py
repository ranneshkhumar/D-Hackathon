"""
Data Engine — Utility functions, copilot responses, chart data generators
"""

import random
import pandas as pd
import numpy as np


class DataEngine:

    @staticmethod
    def get_copilot_response(question: str, business_data: dict) -> str:
        q = question.lower()
        company = business_data.get("company_name", "your company")
        industry = business_data.get("industry", "your industry")

        if any(w in q for w in ["cac", "acquisition cost", "customer cost"]):
            return (
                f"To reduce CAC for {company}, focus on improving organic inbound through SEO and content marketing. "
                f"In {industry}, referral programs typically cut CAC by 30–45%. Also audit your paid channel attribution — "
                f"most companies find 20–30% of ad spend is misallocated."
            )
        elif any(w in q for w in ["revenue", "grow", "increase sales"]):
            return (
                f"The fastest path to revenue growth for {company} is activating your existing customer base. "
                f"Upsell/cross-sell to current accounts typically generates 3–5x the ROI vs. new acquisition. "
                f"Additionally, implement a referral flywheel — happy customers in {industry} are your best sales team."
            )
        elif any(w in q for w in ["churn", "retention", "losing customers"]):
            return (
                f"Churn reduction is mission-critical. For {company} in {industry}, I recommend a 90-day health score model "
                f"— track product usage, support tickets, and NPS monthly. Proactively reach out at 60% health score. "
                f"A 5% reduction in churn can increase LTV by 25–95%."
            )
        elif any(w in q for w in ["market", "competitor", "competition"]):
            return (
                f"Competitive positioning for {company}: Focus on your 3 non-negotiable differentiators. "
                f"In {industry}, incumbents win on trust and integration — challengers win on speed and UX. "
                f"Position against the problem, not the competitor. Own the category definition."
            )
        elif any(w in q for w in ["strategy", "plan", "roadmap"]):
            return (
                f"The Aegis 5D Strategy for {company}: (1) Discover — complete market analysis (done), "
                f"(2) Design — build your growth blueprint (in progress), "
                f"(3) Deliver — execute campaigns, (4) Develop — iterate based on data, "
                f"(5) Dominate — capture category leadership. Your next action: prioritize the top 3 KPIs from the Strategy Agent."
            )
        else:
            return (
                f"Great question about {company}. Based on your {industry} profile, the Aegis intelligence layer suggests "
                f"prioritizing data-driven decision-making in the next 30 days. "
                f"I recommend reviewing your Agent Boardroom outputs for specific, actionable intelligence tailored to your context."
            )

    @staticmethod
    def generate_revenue_chart_data(annual_revenue: float, quarters: int = 8) -> pd.DataFrame:
        base = annual_revenue / 4
        months = []
        values = []
        forecasts = []
        current = base
        for i in range(quarters):
            month_label = f"Q{(i % 4) + 1} {'Y1' if i < 4 else 'Y2'}"
            months.append(month_label)
            growth = random.uniform(0.05, 0.18)
            current = current * (1 + growth)
            values.append(current)
            forecasts.append(current * 1.12 if i >= quarters - 2 else None)
        return pd.DataFrame({"Quarter": months, "Revenue": values, "Forecast": forecasts})

    @staticmethod
    def generate_funnel_data(industry: str) -> dict:
        benchmarks = {
            "Technology": [10000, 3200, 960, 288, 144],
            "Healthcare": [8000, 2400, 720, 216, 86],
            "Retail / E-Commerce": [50000, 12000, 3600, 900, 270],
            "Financial Services": [6000, 1800, 540, 162, 65],
            "Education": [15000, 4500, 1350, 405, 162],
        }
        values = benchmarks.get(industry, [10000, 3000, 900, 270, 108])
        labels = ["Visitors", "Leads", "MQLs", "SQLs", "Customers"]
        return {"labels": labels, "values": values}

    @staticmethod
    def generate_competitive_radar(industry: str) -> dict:
        categories = ["Product", "Marketing", "Sales Velocity", "Brand Authority", "Tech Stack", "Customer Success"]
        your_scores = [random.randint(55, 85) for _ in categories]
        competitor_scores = [random.randint(50, 90) for _ in categories]
        return {
            "categories": categories,
            "your_scores": your_scores,
            "competitor_scores": competitor_scores,
        }

    @staticmethod
    def generate_monthly_cash_flow(annual_revenue: float) -> pd.DataFrame:
        monthly = annual_revenue / 12
        months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        inflows = [monthly * random.uniform(0.85, 1.25) for _ in months]
        outflows = [inf * random.uniform(0.55, 0.78) for inf in inflows]
        net = [i - o for i, o in zip(inflows, outflows)]
        return pd.DataFrame({
            "Month": months,
            "Revenue": inflows,
            "Expenses": outflows,
            "Net": net,
        })
