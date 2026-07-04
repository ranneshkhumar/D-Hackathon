"""
Page 2: Discovery & Onboarding (Discover)
Business onboarding form and 5D Discovery Engine trigger.
"""

import streamlit as st
import time
from agents import AgentOrchestrator


INDUSTRIES = [
    "Technology",
    "Healthcare",
    "Retail / E-Commerce",
    "Financial Services",
    "Education",
    "Manufacturing",
    "Real Estate",
    "Consulting / Professional Services",
]

SAMPLE_DOC = """COMPANY OVERVIEW
================
We are a fast-growing B2B SaaS company focused on workflow automation for mid-market enterprises. 
Founded in 2021, we have achieved $2.4M ARR with a strong product-market fit signal.

CURRENT CHALLENGES
==================
- High customer acquisition cost (~$420 per customer)
- Churn rate hovering at 8% monthly for SMB segment
- Limited brand awareness outside our core geography
- Sales cycle too long (avg. 45 days) for SMB deals

GOALS FOR NEXT 12 MONTHS
=========================
- Reach $5M ARR
- Expand into EMEA market
- Launch enterprise tier with dedicated CSM support
- Reduce SMB churn to below 4%

TARGET MARKET
=============
Mid-market companies (100–500 employees) in operations, finance, and HR verticals.
Primary buyer: VP of Operations or CFO.

COMPETITIVE LANDSCAPE
=====================
Main competitors: Zapier (automation), Monday.com (project mgmt), Notion (docs).
Our differentiator: AI-native, deep integrations, 10x faster setup.
"""


def render_discovery():
    # ── Hero ──
    st.markdown("""
    <div class="page-hero">
        <div>
            <div class="hero-badge">🔍 5D FRAMEWORK · PHASE 1</div>
            <div class="hero-title">Business Discovery & Onboarding</div>
            <div class="hero-sub">Feed your business intelligence to the Aegis multi-agent network</div>
        </div>
        <div style="text-align:right">
            <div style="font-size:10px;color:var(--text-muted);letter-spacing:1.5px;text-transform:uppercase">Phase</div>
            <div style="font-size:26px;font-weight:800;color:var(--accent-blue);letter-spacing:-0.5px">DISCOVER</div>
            <div style="font-size:10px;color:var(--text-tertiary)">5D Framework · Step 1/5</div>
        </div>
    </div>
    """, unsafe_allow_html=True)

    # ── How It Works ──
    st.markdown('<div class="section-eyebrow">HOW IT WORKS</div>', unsafe_allow_html=True)
    cols = st.columns(5)
    steps = [
        ("1", "🔍", "Discover", "You input business context and goals"),
        ("2", "🧭", "Design", "Strategy Agent builds your blueprint"),
        ("3", "📣", "Deliver", "Marketing & Sales generate campaigns"),
        ("4", "⚡", "Develop", "Iterate and optimize based on data"),
        ("5", "👑", "Dominate", "Achieve category leadership"),
    ]
    for col, (num, icon, label, desc) in zip(cols, steps):
        with col:
            st.markdown(f"""
            <div class="flow-node" style="min-height:110px">
                <div class="flow-node-icon">{icon}</div>
                <div class="flow-node-label">{label}</div>
                <div class="flow-node-sub" style="margin-top:6px">{desc}</div>
            </div>
            """, unsafe_allow_html=True)

    st.markdown("<br>", unsafe_allow_html=True)

    # ── FORM ──
    form_col, info_col = st.columns([3, 2], gap="large")

    with form_col:
        st.markdown("""
        <div class="content-panel">
            <div class="panel-title">📋 Business Intelligence Form</div>
        """, unsafe_allow_html=True)

        with st.form("onboarding_form", clear_on_submit=False):
            st.markdown('<div style="padding:4px 0">', unsafe_allow_html=True)

            col_a, col_b = st.columns(2)
            with col_a:
                company_name = st.text_input(
                    "Company Name *",
                    placeholder="e.g. TechFlow Solutions",
                    value=st.session_state.business_data.get("company_name", ""),
                )
            with col_b:
                industry = st.selectbox(
                    "Industry Sector *",
                    INDUSTRIES,
                    index=INDUSTRIES.index(st.session_state.business_data.get("industry", "Technology"))
                    if st.session_state.business_data.get("industry") in INDUSTRIES else 0,
                )

            col_c, col_d = st.columns(2)
            with col_c:
                revenue_options = {
                    "< $100K (Early Stage)": 75_000,
                    "$100K – $500K (Seed)": 300_000,
                    "$500K – $2M (Growth)": 1_200_000,
                    "$2M – $10M (Scale)": 5_000_000,
                    "$10M – $50M (Mid-Market)": 25_000_000,
                    "$50M+ (Enterprise)": 75_000_000,
                }
                revenue_label = st.selectbox(
                    "Annual Revenue *",
                    list(revenue_options.keys()),
                    index=2,
                )
                annual_revenue = revenue_options[revenue_label]
            with col_d:
                target_audience = st.text_input(
                    "Target Audience *",
                    placeholder="e.g. Mid-market B2B SaaS companies",
                    value=st.session_state.business_data.get("target_audience", ""),
                )

            col_e, col_f = st.columns(2)
            with col_e:
                primary_goal = st.selectbox(
                    "Primary Business Goal",
                    [
                        "Increase Revenue & ARR",
                        "Reduce Customer Churn",
                        "Expand to New Markets",
                        "Improve Brand Awareness",
                        "Optimize Unit Economics",
                        "Raise Investment / Funding",
                    ],
                )
            with col_f:
                team_size = st.selectbox(
                    "Team Size",
                    ["1–10 (Startup)", "11–50 (Small)", "51–200 (Mid)", "201–1000 (Large)", "1000+ (Enterprise)"],
                )

            doc_text = st.text_area(
                "Paste Business Documentation / Strategy Notes",
                value=st.session_state.business_data.get("doc_text", SAMPLE_DOC),
                height=200,
                placeholder="Paste your business plan, pitch deck notes, strategy docs, or any context here...",
                help="The AI agents will analyze this document for strategic insights",
            )

            st.markdown("<br>", unsafe_allow_html=True)

            submitted = st.form_submit_button(
                "🚀 Run 5D Discovery Engine",
                use_container_width=True,
                type="primary",
            )
            st.markdown("</div>", unsafe_allow_html=True)

        if submitted:
            if not company_name or not target_audience:
                st.error("⚠️ Please fill in Company Name and Target Audience to continue.")
            else:
                _run_discovery_engine(company_name, industry, annual_revenue, target_audience,
                                      primary_goal, team_size, doc_text)

        st.markdown("</div>", unsafe_allow_html=True)

    with info_col:
        # Agent preview
        st.markdown("""
        <div class="content-panel">
            <div class="panel-title">🤖 Agents That Will Activate</div>
        """, unsafe_allow_html=True)

        agents_preview = [
            ("👔", "CEO Agent", "#3b82f6", "Synthesizes insights, sets mandate"),
            ("🧭", "Strategy Agent", "#8b5cf6", "Builds comprehensive growth strategy"),
            ("📣", "Marketing Agent", "#06b6d4", "Generates campaigns and funnels"),
            ("🎯", "Sales Agent", "#10b981", "Creates pipeline and scripts"),
            ("💹", "Finance Agent", "#f59e0b", "Runs risk and financial analysis"),
        ]
        for icon, name, color, desc in agents_preview:
            st.markdown(f"""
            <div style="display:flex;align-items:center;gap:12px;padding:10px 0;
                border-bottom:1px solid var(--border-subtle)">
                <div style="width:36px;height:36px;border-radius:8px;
                    background:{color}12;border:1px solid {color}33;
                    display:flex;align-items:center;justify-content:center;font-size:18px">
                    {icon}
                </div>
                <div>
                    <div style="font-size:13px;font-weight:600;color:var(--text-primary)">{name}</div>
                    <div style="font-size:11px;color:var(--text-secondary)">{desc}</div>
                </div>
                <div style="margin-left:auto;width:8px;height:8px;border-radius:50%;
                    background:var(--border)"></div>
            </div>
            """, unsafe_allow_html=True)
        st.markdown("</div>", unsafe_allow_html=True)

        # What Aegis is NOT
        st.markdown("""
        <div class="content-panel" style="border-color:rgba(255,59,48,0.3)">
            <div class="panel-title" style="color:#ff3b30">
                <span>⛔</span> What Aegis Is NOT
            </div>
            <div style="font-size:13px;color:var(--text-secondary);line-height:1.7">
                <div style="margin-bottom:8px;color:var(--text-primary)">❌ <strong>NOT a basic CRM</strong> — no contact management or ticket systems</div>
                <div style="margin-bottom:8px;color:var(--text-primary)">❌ <strong>NOT a chatbot</strong> — autonomous agents, not reactive Q&A</div>
                <div style="margin-bottom:8px;color:var(--text-primary)">❌ <strong>NOT a reporting tool</strong> — strategic intelligence, not dashboards</div>
                <div style="color:var(--text-primary)">❌ <strong>NOT a template engine</strong> — dynamic AI outputs, not static templates</div>
            </div>
            <div style="margin-top:14px;padding:10px 14px;background:#f5f5f7;
                border-radius:8px;border:1px solid var(--border-subtle)">
                <div style="font-size:11px;font-weight:700;color:var(--text-primary);letter-spacing:1px;margin-bottom:4px">✅ AEGIS IS</div>
                <div style="font-size:13px;color:var(--blue);font-weight:600">
                    An Autonomous Multi-Agent Business Growth Operating System
                </div>
            </div>
        </div>
        """, unsafe_allow_html=True)

        # Industry benchmarks
        if st.session_state.onboarded:
            ind = st.session_state.business_data.get("industry", "Technology")
            bm = _get_benchmarks(ind)
            st.markdown(f"""
            <div class="content-panel">
                <div class="panel-title">📊 {ind} Benchmarks</div>
            """, unsafe_allow_html=True)
            for k, v in bm.items():
                st.markdown(f"""
                <div style="display:flex;justify-content:space-between;padding:7px 0;
                    border-bottom:1px solid var(--border-subtle)">
                    <span style="font-size:12px;color:var(--text-secondary)">{k}</span>
                    <span style="font-size:12px;font-weight:600;color:var(--text-primary)">{v}</span>
                </div>
                """, unsafe_allow_html=True)
            st.markdown("</div>", unsafe_allow_html=True)


def _run_discovery_engine(company_name, industry, annual_revenue,
                           target_audience, primary_goal, team_size, doc_text):
    """Execute the full multi-agent discovery sequence with animated UI."""
    st.markdown("<br>", unsafe_allow_html=True)
    st.markdown("""
    <div style="padding:20px;background:var(--bg-card);border:1px solid var(--border);
        border-radius:14px;margin-bottom:16px">
        <div style="font-size:16px;font-weight:700;color:var(--text-primary);margin-bottom:16px">
            ⚡ Aegis 5D Discovery Engine — Executing
        </div>
    """, unsafe_allow_html=True)

    progress_bar = st.progress(0)
    status_text = st.empty()

    steps = [
        (10, "🔍 Parsing business documentation..."),
        (20, "📊 Extracting strategic signals from your industry vertical..."),
        (35, "👔 CEO Agent: Setting strategic mandate..."),
        (50, "🧭 Strategy Agent: Building comprehensive growth framework..."),
        (65, "📣 Marketing Agent: Generating campaign suite..."),
        (78, "🎯 Sales Agent: Constructing revenue pipeline..."),
        (88, "💹 Finance Agent: Running risk assessment..."),
        (95, "🧠 Synthesizing all agent outputs..."),
        (100, "✅ Aegis Growth OS activated. All systems online."),
    ]

    business_data = {
        "company_name": company_name,
        "industry": industry,
        "annual_revenue": annual_revenue,
        "target_audience": target_audience,
        "primary_goal": primary_goal,
        "team_size": team_size,
        "doc_text": doc_text,
    }

    for pct, msg in steps:
        progress_bar.progress(pct)
        status_text.markdown(f"""
        <div style="font-size:13px;color:var(--text-primary);padding:6px 0">{msg}</div>
        """, unsafe_allow_html=True)
        time.sleep(0.4)

    st.markdown("</div>", unsafe_allow_html=True)

    # Run agents
    orchestrator = AgentOrchestrator(business_data)
    agent_outputs, agent_log = orchestrator.run_all()

    # Save to session state
    st.session_state.business_data = business_data
    st.session_state.agent_outputs = agent_outputs
    st.session_state.agent_log = agent_log
    st.session_state.onboarded = True
    st.session_state.run_complete = True

    st.success(f"✅ **{company_name}** has been successfully onboarded. All 5 agents have completed their analysis. Navigate to the **Executive Dashboard** or **Agent Boardroom** to view your intelligence.")

    if st.button("→ View Executive Dashboard", key="go_dash"):
        st.session_state.page = "🏢 Executive Dashboard"
        st.rerun()


def _get_benchmarks(industry: str) -> dict:
    bm = {
        "Technology": {"Avg. CAC": "$320", "Avg. LTV": "$4,200", "Median Churn": "5.2%", "Avg. NRR": "112%"},
        "Healthcare": {"Patient Acq. Cost": "$95", "Patient LTV": "$3,100", "Retention Rate": "76%", "NPS": "52"},
        "Retail / E-Commerce": {"Avg. ROAS": "3.8x", "CAC": "$45", "LTV": "$320", "Repeat Purchase": "28%"},
        "Financial Services": {"Lead CAC": "$180", "Client LTV": "$12,400", "AUM Growth": "18% YoY"},
        "Education": {"Student CAC": "$120", "LTV": "$2,800", "Completion Rate": "68%", "NPS": "44"},
    }
    return bm.get(industry, {"Revenue Growth": "22% YoY", "CAC": "$200", "LTV": "$3,000"})
