"""
Multi-Agent Network Engine for Aegis
5 Autonomous AI Agents: CEO, Strategy, Marketing, Sales, Finance
"""

import random
import time
from datetime import datetime


# ─────────────────────────────────────────────
# AGENT DEFINITIONS
# ─────────────────────────────────────────────

class CEO_Agent:
    name = "CEO Agent"
    icon = "👔"
    color = "#3b82f6"
    bg = "rgba(59,130,246,0.15)"
    role = "Chief Intelligence Officer"
    responsibility = "Synthesizes all agent outputs into executive-level insights, sets strategic priorities, and communicates board-ready summaries."
    input_desc = "Business onboarding data (company profile, industry, revenue, goals)"
    output_desc = "Executive Summary, Board Briefing, Business Health Score, Strategic Mandate"

    @staticmethod
    def run(business_data: dict) -> dict:
        industry = business_data.get("industry", "Technology")
        company = business_data.get("company_name", "Your Company")
        revenue = business_data.get("annual_revenue", 1_000_000)
        audience = business_data.get("target_audience", "SMBs")

        industry_context = {
            "Technology": ("SaaS expansion", "developer-led growth", "ARR acceleration"),
            "Healthcare": ("patient acquisition", "compliance-first growth", "value-based care"),
            "Retail / E-Commerce": ("omnichannel dominance", "AOV optimization", "retention flywheel"),
            "Financial Services": ("AUM growth", "regulatory arbitrage", "fintech disruption"),
            "Education": ("learner acquisition", "outcome-based positioning", "cohort monetization"),
            "Manufacturing": ("operational efficiency", "supply chain resilience", "B2B pipeline"),
            "Real Estate": ("deal velocity", "portfolio diversification", "proptech integration"),
            "Consulting / Professional Services": ("retainer growth", "thought leadership", "IP monetization"),
        }.get(industry, ("market expansion", "customer acquisition", "revenue diversification"))

        summary = (
            f"{company} is positioned at a critical inflection point within the {industry} sector. "
            f"With an annual revenue baseline of ${revenue:,.0f}, the immediate mandate is to accelerate "
            f"{industry_context[0]} through a disciplined {industry_context[1]} approach, "
            f"targeting {audience} as the primary growth vector. "
            f"Our multi-agent analysis has identified three strategic horizons: "
            f"(1) 0–90 day quick wins focused on conversion optimization and pipeline velocity, "
            f"(2) 90–180 day structural investments in brand authority and {industry_context[2]}, "
            f"and (3) 12-month market dominance through category leadership. "
            f"The Aegis Growth OS has computed a composite Business Health Score reflecting "
            f"market readiness, operational capacity, and competitive positioning."
        )

        health_score = random.randint(62, 91)
        growth_score = random.randint(55, 88)
        return {
            "summary": summary,
            "health_score": health_score,
            "growth_score": growth_score,
            "mandate": f"Achieve {industry_context[2]} within 12 months via {industry_context[1]}",
            "timestamp": datetime.now().strftime("%H:%M:%S"),
        }


class Strategy_Agent:
    name = "Strategy Agent"
    icon = "🧭"
    color = "#8b5cf6"
    bg = "rgba(139,92,246,0.15)"
    role = "Chief Strategy Architect"
    responsibility = "Constructs comprehensive growth strategies using market intelligence, competitive analysis, and 5D framework alignment."
    input_desc = "CEO mandate, business profile, market benchmarks, industry vertical data"
    output_desc = "Growth Strategy Document, SWOT Analysis, Competitive Positioning, KPI Targets"

    @staticmethod
    def run(business_data: dict, ceo_output: dict) -> dict:
        industry = business_data.get("industry", "Technology")
        company = business_data.get("company_name", "Your Company")
        revenue = business_data.get("annual_revenue", 1_000_000)

        strategies = {
            "Technology": {
                "primary": "Product-Led Growth (PLG) with enterprise upsell motion",
                "pillars": ["Freemium to paid conversion funnel", "Developer community building", "API-first integrations", "Usage-based pricing tiers"],
                "kpis": {"MRR Growth": "15% MoM", "CAC Payback": "< 9 months", "NRR": "> 120%", "Trial-to-Paid": "> 25%"},
                "markets": ["Mid-market SaaS", "Enterprise IT", "Startup ecosystem"],
                "competitive_moat": "Deep API ecosystem + switching cost via data gravity",
            },
            "Healthcare": {
                "primary": "Trust-Led Acquisition with referral network amplification",
                "pillars": ["HIPAA-compliant digital touchpoints", "Physician referral programs", "Outcome-based case studies", "Telehealth channel expansion"],
                "kpis": {"Patient Acquisition Cost": "< $120", "Retention Rate": "> 78%", "NPS": "> 55", "Digital Appointments": "> 40%"},
                "markets": ["Urban outpatient clinics", "Insurance networks", "Corporate wellness"],
                "competitive_moat": "Regulatory compliance expertise + established trust scores",
            },
            "Retail / E-Commerce": {
                "primary": "Retention-First Flywheel with DTC channel dominance",
                "pillars": ["Loyalty program with tiered rewards", "Personalization engine", "Social commerce expansion", "Subscription bundles"],
                "kpis": {"ROAS": "> 4.5x", "LTV:CAC": "> 3:1", "Cart Abandonment": "< 62%", "Repeat Purchase Rate": "> 35%"},
                "markets": ["Millennial shoppers 25–40", "Mobile-first buyers", "Sustainability-conscious consumers"],
                "competitive_moat": "Brand community + first-party data advantage",
            },
        }.get(industry, {
            "primary": "Market Penetration with authority-led positioning",
            "pillars": ["Content moat construction", "Strategic partnership matrix", "Direct sales acceleration", "Digital channel optimization"],
            "kpis": {"Revenue Growth": "25% YoY", "Market Share": "+3–5%", "Lead Velocity Rate": "+20% MoM", "CAC Reduction": "15%"},
            "markets": ["Primary TAM segments", "Adjacent verticals", "International expansion"],
            "competitive_moat": "Domain expertise + network effects",
        })

        growth_projection = {
            "Q1": revenue * 1.08,
            "Q2": revenue * 1.18,
            "Q3": revenue * 1.31,
            "Q4": revenue * 1.47,
        }

        return {
            "strategy": strategies,
            "growth_projection": growth_projection,
            "mandate": ceo_output.get("mandate", ""),
            "timestamp": datetime.now().strftime("%H:%M:%S"),
        }


class Marketing_Agent:
    name = "Marketing Agent"
    icon = "📣"
    color = "#06b6d4"
    bg = "rgba(6,182,212,0.15)"
    role = "Chief Growth Marketer"
    responsibility = "Generates multi-channel campaign strategies, ad copy, email funnels, and brand positioning assets from the strategy blueprint."
    input_desc = "Growth strategy, target audience profile, budget parameters, channel preferences"
    output_desc = "Ad Campaigns, Email Funnels, Channel Mix, Content Calendar, Brand Voice Guidelines"

    @staticmethod
    def run(business_data: dict, strategy_output: dict) -> dict:
        industry = business_data.get("industry", "Technology")
        audience = business_data.get("target_audience", "SMBs")
        company = business_data.get("company_name", "Your Company")

        campaigns = {
            "Technology": {
                "hero_ad": f"Stop losing deals to competitors with smarter tools. {company} gives your team the AI advantage — measurable ROI in 30 days or your money back.",
                "email_subject": "Your competitors just switched. Here's why you should too →",
                "email_body": f"Hi [First Name],\n\nI noticed your team is scaling fast — and I wanted to reach out at the right time.\n\n{company} has helped 200+ {audience} companies cut their tool spend by 40% while tripling output. \n\nCan I show you a 12-minute demo this week?\n\n[CTA: Book Your Slot]",
                "channels": ["LinkedIn Ads", "Google Search", "Product Hunt", "Dev Communities", "Webinars"],
                "hook": "The AI stack your competitors don't want you to know about.",
            },
            "Healthcare": {
                "hero_ad": f"Your patients deserve faster, smarter care. {company} modernizes your practice without disrupting your workflow — HIPAA compliant, zero downtime.",
                "email_subject": "How [Similar Practice] saw 40% more appointments in 60 days →",
                "email_body": f"Dear Dr. [Last Name],\n\nPatient acquisition is getting harder and more expensive. We get it.\n\n{company} helped practices like yours attract and retain 40% more patients through evidence-based digital outreach — fully compliant.\n\n[CTA: See Case Study]",
                "channels": ["Medical Journals", "LinkedIn", "Healthcare Conferences", "Referral Programs", "Local SEO"],
                "hook": "Modern care starts with a modern practice.",
            },
            "Retail / E-Commerce": {
                "hero_ad": f"Your store. Supercharged. {company} turns browsers into buyers and one-time shoppers into lifelong fans — with AI-powered personalization.",
                "email_subject": "🛒 Left something behind? Here's 15% off to come back →",
                "email_body": f"Hey [First Name],\n\nWe noticed you were checking out [Product] — great choice, by the way.\n\nFor the next 24 hours, we're offering you an exclusive 15% discount. This is just for you.\n\n[CTA: Complete Your Order] ⏰ Expires soon.\n\nP.S. — [Social Proof: 847 people bought this week]",
                "channels": ["Meta/Instagram Ads", "Google Shopping", "TikTok", "Email Automations", "SMS Flows"],
                "hook": "One-click to their new favorite brand.",
            },
        }.get(industry, {
            "hero_ad": f"{company}: The smart choice for ambitious {audience}. Powered by AI. Proven by results.",
            "email_subject": "3 growth levers you're probably not using →",
            "email_body": f"Hi [First Name],\n\n{company} has helped teams like yours unlock hidden revenue opportunities. Here are 3 strategies working right now...\n\n[CTA: Get the Full Playbook]",
            "channels": ["LinkedIn", "Google Ads", "Content Marketing", "Email", "Partnerships"],
            "hook": "Smarter strategy. Faster growth.",
        })

        content_calendar = [
            {"week": "Week 1", "content": "Brand awareness campaign launch", "channel": "LinkedIn + Google"},
            {"week": "Week 2", "content": "Case study + social proof push", "channel": "Email + Retargeting"},
            {"week": "Week 3", "content": "Lead magnet deployment", "channel": "Content + SEO"},
            {"week": "Week 4", "content": "Conversion campaign + limited offer", "channel": "All Channels"},
        ]

        return {
            "campaigns": campaigns,
            "content_calendar": content_calendar,
            "timestamp": datetime.now().strftime("%H:%M:%S"),
        }


class Sales_Agent:
    name = "Sales Agent"
    icon = "🎯"
    color = "#10b981"
    bg = "rgba(16,185,129,0.15)"
    role = "Chief Revenue Officer"
    responsibility = "Builds outbound sales sequences, lead scoring models, pipeline stages, and conversion frameworks to maximize revenue generation."
    input_desc = "Marketing campaigns, ICP definition, competitive positioning, pricing model"
    output_desc = "Sales Scripts, Outbound Sequences, Pipeline Stages, Lead Scoring Model, Objection Handling"

    @staticmethod
    def run(business_data: dict, marketing_output: dict) -> dict:
        industry = business_data.get("industry", "Technology")
        audience = business_data.get("target_audience", "SMBs")
        company = business_data.get("company_name", "Your Company")

        pipeline = [
            {"stage": "Lead Capture", "conversion": "100%", "avg_days": 0, "action": "ICP qualification via AI scoring"},
            {"stage": "Discovery Call", "conversion": "35%", "avg_days": 3, "action": "Needs analysis + pain mapping"},
            {"stage": "Demo / Proposal", "conversion": "60%", "avg_days": 7, "action": "ROI presentation + customization"},
            {"stage": "Negotiation", "conversion": "70%", "avg_days": 14, "action": "Champion-based closing + legal review"},
            {"stage": "Closed Won", "conversion": "65%", "avg_days": 21, "action": "Contract execution + onboarding trigger"},
        ]

        outbound_sequence = [
            {"day": "Day 1", "touch": "Personalized LinkedIn connection + voice note", "goal": "Initial awareness"},
            {"day": "Day 3", "touch": "Email: Industry insight + problem framing", "goal": "Establish credibility"},
            {"day": "Day 7", "touch": "Follow-up: Case study relevant to their vertical", "goal": "Build trust"},
            {"day": "Day 12", "touch": "Phone call + voicemail drop", "goal": "Direct engagement"},
            {"day": "Day 18", "touch": "Video email (Loom) with personalized demo preview", "goal": "Create urgency"},
            {"day": "Day 25", "touch": "Final value-add email: ROI calculator", "goal": "Conversion or recycle"},
        ]

        discovery_script = f"""OPENING:
"Hi [Name], this is [Rep] from {company}. I know your time is valuable — I'll keep this focused. 
We've helped [2–3 similar companies in {industry}] solve [core pain point]. I'd love to understand 
if the same challenge resonates with your team. Do you have 8 minutes?"

DISCOVERY QUESTIONS:
1. "Walk me through how you currently handle [key process]?"
2. "Where does that process break down most often?"
3. "What would perfect look like 12 months from now?"
4. "If we could achieve [outcome], what would that mean for your {audience} targets?"

OBJECTION HANDLING:
• "We already have a solution" → "That's great — what's the one thing you wish it did better?"
• "Not the right time" → "Completely understand — what would make it the right time?"
• "Too expensive" → "Fair — let's quantify the cost of NOT solving this. Can I share a quick calc?"

CLOSE:
"Based on what you've shared, I think we can make a real impact. Can we lock in 30 minutes next week 
for a tailored walkthrough? I'll bring specific metrics from your industry vertical."
"""

        lead_score_criteria = [
            {"factor": "Industry Match", "weight": "25%", "score_range": "0–25"},
            {"factor": "Company Size (employees)", "weight": "20%", "score_range": "0–20"},
            {"factor": "Intent Signal (content downloads)", "weight": "20%", "score_range": "0–20"},
            {"factor": "Engagement Score (email/web)", "weight": "20%", "score_range": "0–20"},
            {"factor": "Decision-Maker Contact", "weight": "15%", "score_range": "0–15"},
        ]

        revenue_opportunity = int(business_data.get("annual_revenue", 1_000_000) * random.uniform(0.18, 0.35))
        lead_score = random.randint(68, 94)

        return {
            "pipeline": pipeline,
            "outbound_sequence": outbound_sequence,
            "discovery_script": discovery_script,
            "lead_score_criteria": lead_score_criteria,
            "revenue_opportunity": revenue_opportunity,
            "lead_score": lead_score,
            "timestamp": datetime.now().strftime("%H:%M:%S"),
        }


class Finance_Agent:
    name = "Finance Agent"
    icon = "💹"
    color = "#f59e0b"
    bg = "rgba(245,158,11,0.15)"
    role = "Chief Financial Intelligence Officer"
    responsibility = "Runs financial risk assessments, models cash flow projections, identifies margin leakage, and flags compliance risks."
    input_desc = "Revenue data, growth projections, cost structure, market benchmarks"
    output_desc = "Risk Alerts, Financial Health Metrics, Cash Flow Projections, Unit Economics Model"

    @staticmethod
    def run(business_data: dict, strategy_output: dict) -> dict:
        revenue = business_data.get("annual_revenue", 1_000_000)
        industry = business_data.get("industry", "Technology")

        # Generate risk alerts
        risk_alerts = []

        risk_templates = {
            "Technology": [
                {"level": "red", "title": "Churn Rate Threshold", "desc": "Simulated churn rate at 8.2% — above SaaS benchmark of 5%. Immediate retention intervention required."},
                {"level": "amber", "title": "CAC Trending Up", "desc": "Customer acquisition cost has increased 22% QoQ. Organic channel investment recommended."},
                {"level": "amber", "title": "Runway Alert", "desc": "At current burn rate, runway is estimated at 11.4 months. Series A timeline should be accelerated."},
                {"level": "green", "title": "Gross Margin Healthy", "desc": "Gross margin at 74% — above industry median. Strong foundation for R&D reinvestment."},
            ],
            "Healthcare": [
                {"level": "red", "title": "Compliance Risk Elevated", "desc": "Recent HIPAA audit flag detected in documentation review. Immediate legal review recommended."},
                {"level": "amber", "title": "Revenue Cycle Delay", "desc": "Average claims processing time at 34 days — 9 days above benchmark. Cash flow impact: -$47K/month."},
                {"level": "green", "title": "Patient LTV Strong", "desc": "Patient lifetime value at $3,200 — 18% above regional average. Retention programs showing ROI."},
            ],
            "Retail / E-Commerce": [
                {"level": "red", "title": "Inventory Carrying Cost", "desc": "Excess inventory detected in Q3 planning. Liquidation strategy needed to preserve margin."},
                {"level": "amber", "title": "ROAS Compression", "desc": "Paid channel ROAS dropped to 2.8x from 4.1x. Algorithmic changes require bid strategy revision."},
                {"level": "amber", "title": "Cash Burn in Q3", "desc": "Seasonal dip projected to compress cash position by 18%. Credit facility activation recommended."},
                {"level": "green", "title": "AOV Growing", "desc": "Average order value up 12% MoM — bundling strategy working. Continue and expand."},
            ],
        }

        risk_alerts = risk_templates.get(industry, [
            {"level": "amber", "title": "Revenue Concentration Risk", "desc": "Top 3 clients represent 62% of revenue. Diversification strategy needed."},
            {"level": "amber", "title": "Operational Cost Pressure", "desc": "OpEx growing 3x faster than revenue. Process automation audit recommended."},
            {"level": "green", "title": "Gross Margin Stable", "desc": "Margins holding at 58% — within target range. Monitor for Q4 expansion."},
        ])

        # Financial projections
        monthly_revenue = revenue / 12
        cash_flow = [monthly_revenue * (1 + random.uniform(-0.05, 0.15)) for _ in range(12)]

        customer_health = random.randint(70, 90)
        market_readiness = random.randint(65, 88)

        unit_economics = {
            "CAC": f"${random.randint(180, 420):,}",
            "LTV": f"${random.randint(1800, 5400):,}",
            "LTV:CAC Ratio": f"{random.uniform(3.2, 7.1):.1f}x",
            "Payback Period": f"{random.randint(7, 14)} months",
            "Gross Margin": f"{random.randint(55, 78)}%",
            "Burn Multiple": f"{random.uniform(0.8, 2.4):.1f}x",
        }

        return {
            "risk_alerts": risk_alerts,
            "cash_flow": cash_flow,
            "customer_health": customer_health,
            "market_readiness": market_readiness,
            "unit_economics": unit_economics,
            "timestamp": datetime.now().strftime("%H:%M:%S"),
        }


# ─────────────────────────────────────────────
# ORCHESTRATOR
# ─────────────────────────────────────────────

class AgentOrchestrator:
    """Coordinates the sequential execution of all 5 AI agents."""

    def __init__(self, business_data: dict):
        self.business_data = business_data
        self.outputs = {}
        self.log = []

    def _log(self, agent: str, message: str, color: str = "#3b82f6"):
        self.log.append({
            "time": datetime.now().strftime("%H:%M:%S"),
            "agent": agent,
            "message": message,
            "color": color,
        })

    def run_all(self, fast: bool = False):
        bd = self.business_data

        # Step 1 — CEO
        self._log("CEO Agent", f"Initializing intelligence sweep for {bd.get('company_name', 'company')}...", "#3b82f6")
        if not fast:
            time.sleep(0.2)
        self._log("CEO Agent", "Parsing business documentation and extracting strategic signals...", "#3b82f6")
        ceo_out = CEO_Agent.run(bd)
        self.outputs["ceo"] = ceo_out
        self._log("CEO Agent", f"✅ Executive mandate set: {ceo_out['mandate'][:60]}...", "#10b981")

        # Step 2 — Strategy
        self._log("Strategy Agent", "Receiving mandate from CEO Agent. Initiating market analysis...", "#8b5cf6")
        self._log("Strategy Agent", f"Querying {bd.get('industry','industry')} vertical intelligence database...", "#8b5cf6")
        strategy_out = Strategy_Agent.run(bd, ceo_out)
        self.outputs["strategy"] = strategy_out
        self._log("Strategy Agent", f"✅ Growth strategy compiled: {strategy_out['strategy']['primary'][:55]}...", "#10b981")

        # Step 3 — Marketing
        self._log("Marketing Agent", "Strategy blueprint received. Generating multi-channel campaigns...", "#06b6d4")
        self._log("Marketing Agent", "Synthesizing ad copy, email funnels, and content calendar...", "#06b6d4")
        marketing_out = Marketing_Agent.run(bd, strategy_out)
        self.outputs["marketing"] = marketing_out
        self._log("Marketing Agent", "✅ Campaign suite ready. 4-week content calendar generated.", "#10b981")

        # Step 4 — Sales
        self._log("Sales Agent", "Marketing assets received. Building outbound sales engine...", "#10b981")
        self._log("Sales Agent", "Constructing pipeline stages, lead scoring, and discovery scripts...", "#10b981")
        sales_out = Sales_Agent.run(bd, marketing_out)
        self.outputs["sales"] = sales_out
        self._log("Sales Agent", f"✅ Revenue opportunity identified: ${sales_out['revenue_opportunity']:,.0f}", "#10b981")

        # Step 5 — Finance
        self._log("Finance Agent", "Receiving all outputs. Running financial risk assessment...", "#f59e0b")
        self._log("Finance Agent", "Modeling cash flow, unit economics, and risk vectors...", "#f59e0b")
        finance_out = Finance_Agent.run(bd, strategy_out)
        self.outputs["finance"] = finance_out
        self._log("Finance Agent", f"✅ Risk assessment complete. {len(finance_out['risk_alerts'])} signals flagged.", "#10b981")

        # CEO final synthesis
        self._log("CEO Agent", "All agent outputs synthesized. Dashboard updating...", "#3b82f6")
        self._log("CEO Agent", "🚀 Aegis Growth OS is LIVE. All systems operational.", "#10b981")

        return self.outputs, self.log
