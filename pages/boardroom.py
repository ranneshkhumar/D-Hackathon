"""
Page 3: Agent Boardroom (Design & Deliver)
Interactive timeline log and detailed agent output panels.
"""

import streamlit as st
import time


def render_boardroom():
    # ── Hero ──
    st.markdown("""
    <div class="page-hero">
        <div>
            <div class="hero-badge">🧠 5D FRAMEWORK · PHASE 2 & 3</div>
            <div class="hero-title">Agent Boardroom</div>
            <div class="hero-sub">Your autonomous AI team at work — Design → Deliver → Results</div>
        </div>
        <div style="text-align:right">
            <div style="font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:1.5px">Phases Active</div>
            <div style="font-size:17px;font-weight:800;margin-top:4px">
                <span style="color:var(--accent-purple)">DESIGN</span>
                <span style="color:rgba(255,255,255,0.2)"> · </span>
                <span style="color:var(--accent-cyan)">DELIVER</span>
            </div>
        </div>
    </div>
    """, unsafe_allow_html=True)

    if not st.session_state.onboarded or not st.session_state.run_complete:
        st.markdown("""
        <div style="text-align:center;padding:70px 40px;background:var(--bg-card);
            border:1px dashed var(--border-color);border-radius:20px">
            <div style="font-size:52px;margin-bottom:18px">🧠</div>
            <div style="font-size:20px;font-weight:700;color:var(--text-primary);margin-bottom:10px">
                Agents Awaiting Activation
            </div>
            <div style="color:var(--text-secondary);font-size:13.5px;line-height:1.7">
                Complete the Discovery &amp; Onboarding step to activate the Agent Boardroom.
            </div>
        </div>
        """, unsafe_allow_html=True)
        return

    outputs = st.session_state.agent_outputs
    bd = st.session_state.business_data
    log = st.session_state.agent_log

    # ── AGENT TIMELINE LOG ──
    st.markdown('<div class="section-eyebrow">AGENT CHATTER — LIVE EXECUTION LOG</div>', unsafe_allow_html=True)
    st.markdown("""
    <div class="content-panel" style="max-height:280px;overflow-y:auto">
        <div class="panel-title">📡 Multi-Agent Communication Timeline</div>
    """, unsafe_allow_html=True)

    agent_colors = {
        "CEO Agent": "#3b82f6",
        "Strategy Agent": "#8b5cf6",
        "Marketing Agent": "#06b6d4",
        "Sales Agent": "#10b981",
        "Finance Agent": "#f59e0b",
    }

    for i, entry in enumerate(log):
        color = agent_colors.get(entry["agent"], entry.get("color", "#0071e3"))
        st.markdown(f"""
        <div class="log-entry" style="animation-delay:{i*0.05}s">
            <div class="log-time">{entry['time']}</div>
            <div class="log-dot" style="background:{color};margin-top:6px"></div>
            <div class="log-msg">
                <strong style="color:var(--text-primary)">{entry['agent']}</strong>
                &nbsp;→&nbsp; {entry['message']}
            </div>
        </div>
        """, unsafe_allow_html=True)

    st.markdown("</div>", unsafe_allow_html=True)
    st.markdown("<br>", unsafe_allow_html=True)

    # ── AGENT CARDS OVERVIEW ──
    st.markdown('<div class="section-eyebrow">AGENT PROFILES & OUTPUTS SUMMARY</div>', unsafe_allow_html=True)
    a1, a2, a3, a4, a5 = st.columns(5)
    agents_meta = [
        (a1, "👔", "CEO Agent", "Chief Intelligence", "#3b82f6", "rgba(59,130,246,0.15)", "Executive Mandate"),
        (a2, "🧭", "Strategy Agent", "Growth Architect", "#8b5cf6", "rgba(139,92,246,0.15)", "Strategy Blueprint"),
        (a3, "📣", "Marketing Agent", "Growth Marketer", "#06b6d4", "rgba(6,182,212,0.15)", "Campaign Suite"),
        (a4, "🎯", "Sales Agent", "Revenue Officer", "#10b981", "rgba(16,185,129,0.15)", "Sales Engine"),
        (a5, "💹", "Finance Agent", "Financial Intel.", "#f59e0b", "rgba(245,158,11,0.15)", "Risk Assessment"),
    ]
    for col, icon, name, role, color, bg, output_label in agents_meta:
        with col:
            st.markdown(f"""
            <div style="background:var(--bg-card);border:1px solid var(--border-color);border-radius:12px;
                padding:16px 14px;text-align:center">
                <div style="width:44px;height:44px;border-radius:10px;background:{bg};
                    border:1px solid {color}33;display:flex;align-items:center;
                    justify-content:center;font-size:22px;margin:0 auto 10px">
                    {icon}
                </div>
                <div style="font-size:13px;font-weight:700;color:var(--text-primary)">{name}</div>
                <div style="font-size:10px;color:var(--text-secondary);margin-bottom:8px">{role}</div>
                <div style="font-size:10px;background:{color}12;color:{color};
                    padding:3px 8px;border-radius:100px;border:1px solid {color}33;
                    font-weight:700;letter-spacing:0.5px">✅ {output_label}</div>
            </div>
            """, unsafe_allow_html=True)

    st.markdown("<br>", unsafe_allow_html=True)

    # ── TABS FOR EACH AGENT'S OUTPUT ──
    tab1, tab2, tab3, tab4, tab5 = st.tabs([
        "🧭 Strategy Agent",
        "📣 Marketing Agent",
        "🎯 Sales Agent",
        "💹 Finance Agent",
        "👔 CEO Synthesis",
    ])

    # ─── STRATEGY TAB ───
    with tab1:
        strategy = outputs.get("strategy", {}).get("strategy", {})
        growth_proj = outputs.get("strategy", {}).get("growth_projection", {})

        _agent_header("🧭", "Strategy Agent", "Chief Growth Architect", "#8b5cf6",
                      "Comprehensive growth strategy with KPIs, market positioning, and 12-month roadmap")

        col1, col2 = st.columns([3, 2], gap="large")
        with col1:
            st.markdown("""
            <div class="content-panel">
                <div class="panel-title">🏆 Primary Growth Strategy</div>
            """, unsafe_allow_html=True)
            st.markdown(f"""
            <div style="padding:14px;background:rgba(139,92,246,0.08);border-radius:10px;
                border:1px solid rgba(139,92,246,0.2);margin-bottom:16px">
                <div style="font-size:11px;color:#8b5cf6;font-weight:700;letter-spacing:1px;margin-bottom:6px">
                    CORE STRATEGY
                </div>
                <div style="font-size:15px;font-weight:700;color:var(--text-primary)">
                    {strategy.get('primary', 'Market Penetration')}
                </div>
            </div>
            """, unsafe_allow_html=True)

            st.markdown('<div style="font-size:13px;font-weight:600;color:var(--text-primary);margin-bottom:10px">Strategic Pillars</div>', unsafe_allow_html=True)
            for i, pillar in enumerate(strategy.get("pillars", []), 1):
                st.markdown(f"""
                <div style="display:flex;gap:10px;align-items:flex-start;padding:8px 0;
                    border-bottom:1px solid var(--border-subtle)">
                    <div style="width:22px;height:22px;border-radius:5px;background:rgba(175,82,222,0.1);
                        color:var(--accent-purple);font-size:11px;font-weight:700;display:flex;
                        align-items:center;justify-content:center;flex-shrink:0">{i}</div>
                    <div style="font-size:13px;color:var(--text-primary)">{pillar}</div>
                </div>
                """, unsafe_allow_html=True)
            st.markdown("</div>", unsafe_allow_html=True)

            # KPIs
            kpis = strategy.get("kpis", {})
            st.markdown("""
            <div class="content-panel" style="margin-top:16px">
                <div class="panel-title">📊 Target KPIs — 12-Month Horizon</div>
            """, unsafe_allow_html=True)
            kpi_cols = st.columns(2)
            for i, (kpi, target) in enumerate(kpis.items()):
                with kpi_cols[i % 2]:
                    st.markdown(f"""
                    <div style="background:var(--bg-soft);border:1px solid var(--border-subtle);
                        border-radius:8px;padding:12px 14px;margin-bottom:10px">
                        <div style="font-size:10px;color:var(--text-secondary);letter-spacing:1px;text-transform:uppercase;margin-bottom:4px">{kpi}</div>
                        <div style="font-size:18px;font-weight:800;color:var(--accent-purple)">{target}</div>
                    </div>
                    """, unsafe_allow_html=True)
            st.markdown("</div>", unsafe_allow_html=True)

        with col2:
            # Competitive moat
            st.markdown(f"""
            <div class="content-panel">
                <div class="panel-title">🛡️ Competitive Moat</div>
                <div style="padding:14px;background:var(--bg-soft);border-radius:8px;
                    border:1px solid var(--border-subtle)">
                    <div style="font-size:13.5px;color:var(--text-primary);line-height:1.6">
                        {strategy.get('competitive_moat', 'Differentiation strategy and network effects')}
                    </div>
                </div>
            </div>
            """, unsafe_allow_html=True)

            # Target markets
            st.markdown("""
            <div class="content-panel">
                <div class="panel-title">🎯 Target Market Segments</div>
            """, unsafe_allow_html=True)
            for seg in strategy.get("markets", ["Primary market"]):
                st.markdown(f"""
                <div style="display:flex;align-items:center;gap:8px;padding:8px 0;
                    border-bottom:1px solid var(--border-subtle)">
                    <div style="width:6px;height:6px;border-radius:50%;background:var(--accent-purple)"></div>
                    <span style="font-size:13px;color:var(--text-primary)">{seg}</span>
                </div>
                """, unsafe_allow_html=True)
            st.markdown("</div>", unsafe_allow_html=True)

            # Growth projections
            if growth_proj:
                st.markdown("""
                <div class="content-panel">
                    <div class="panel-title">📈 Revenue Projections</div>
                """, unsafe_allow_html=True)
                for quarter, val in growth_proj.items():
                    st.markdown(f"""
                    <div style="display:flex;justify-content:space-between;align-items:center;
                        padding:8px 0;border-bottom:1px solid var(--border-subtle)">
                        <span style="font-size:12px;color:var(--text-secondary)">{quarter}</span>
                        <span style="font-size:14px;font-weight:700;color:#34c759">${val:,.0f}</span>
                    </div>
                    """, unsafe_allow_html=True)
                st.markdown("</div>", unsafe_allow_html=True)

    # ─── MARKETING TAB ───
    with tab2:
        marketing = outputs.get("marketing", {})
        campaigns = marketing.get("campaigns", {})
        calendar = marketing.get("content_calendar", [])

        _agent_header("📣", "Marketing Agent", "Chief Growth Marketer", "#06b6d4",
                      "Multi-channel campaign suite with ad copy, email funnels, and 4-week content calendar")

        m1, m2 = st.columns([2, 1], gap="large")
        with m1:
            st.markdown("""
            <div class="content-panel">
                <div class="panel-title"><span>🎯</span> Hero Ad Campaign Copy</div>
            """, unsafe_allow_html=True)
            st.markdown(f"""
            <div style="padding:18px;background:var(--bg-soft);
                border:1px solid var(--border-subtle);border-radius:10px;margin-bottom:14px">
                <div style="font-size:10px;color:var(--blue);font-weight:700;letter-spacing:1.5px;margin-bottom:8px">
                    PRIMARY AD HEADLINE
                </div>
                <div style="font-size:14px;color:var(--text-primary);line-height:1.6;font-style:italic">
                    "{campaigns.get('hero_ad', 'Generating ad copy...')}"
                </div>
            </div>
            """, unsafe_allow_html=True)

            # Email sequence
            st.markdown("""
                <div class="panel-title" style="margin-top:16px">📧 Email Funnel Sequence</div>
            """, unsafe_allow_html=True)
            subj = campaigns.get("email_subject", "")
            body = campaigns.get("email_body", "")
            if subj:
                st.markdown(f"""
                <div style="background:var(--bg-soft);border:1px solid var(--border-subtle);border-radius:10px;
                    padding:16px;font-family:'Inter',sans-serif">
                    <div style="font-size:11px;color:var(--blue);font-weight:700;margin-bottom:8px">SUBJECT LINE</div>
                    <div style="font-size:13.5px;color:var(--text-primary);margin-bottom:12px;font-weight:600">{subj}</div>
                    <div style="font-size:11px;color:var(--blue);font-weight:700;margin-bottom:8px">EMAIL BODY</div>
                    <div style="font-size:13px;color:var(--text-primary);white-space:pre-line;line-height:1.7">{body}</div>
                </div>
                """, unsafe_allow_html=True)

            # Hook
            hook = campaigns.get("hook", "")
            if hook:
                st.markdown(f"""
                <div style="margin-top:14px;padding:12px 16px;background:var(--bg-soft);
                    border-left:3px solid var(--blue);border-radius:0 8px 8px 0">
                    <div style="font-size:10px;color:var(--text-secondary);font-weight:700;letter-spacing:1px;margin-bottom:4px">
                        BRAND HOOK / TAGLINE
                    </div>
                    <div style="font-size:14px;color:var(--text-primary);font-weight:600">"{hook}"</div>
                </div>
                """, unsafe_allow_html=True)
            st.markdown("</div>", unsafe_allow_html=True)

        with m2:
            # Channels
            channels = campaigns.get("channels", [])
            st.markdown("""
            <div class="content-panel">
                <div class="panel-title">📡 Recommended Channels</div>
            """, unsafe_allow_html=True)
            for i, ch in enumerate(channels):
                st.markdown(f"""
                <div style="padding:10px 12px;background:var(--bg-soft);
                    border:1px solid var(--border-subtle);border-radius:8px;
                    margin-bottom:8px;font-size:13px;font-weight:600;color:var(--text-primary)">
                    {ch}
                </div>
                """, unsafe_allow_html=True)
            st.markdown("</div>", unsafe_allow_html=True)

            # Content calendar
            if calendar:
                st.markdown("""
                <div class="content-panel">
                    <div class="panel-title">🗓️ 4-Week Content Calendar</div>
                """, unsafe_allow_html=True)
                for item in calendar:
                    st.markdown(f"""
                    <div style="padding:10px 0;border-bottom:1px solid var(--border-subtle)">
                        <div style="font-size:10px;color:var(--blue);font-weight:700;margin-bottom:4px">{item['week']}</div>
                        <div style="font-size:12.5px;color:var(--text-primary);margin-bottom:2px">{item['content']}</div>
                        <div style="font-size:10px;color:var(--text-secondary)">📡 {item['channel']}</div>
                    </div>
                    """, unsafe_allow_html=True)
                st.markdown("</div>", unsafe_allow_html=True)

    # ─── SALES TAB ───
    with tab3:
        sales = outputs.get("sales", {})

        _agent_header("🎯", "Sales Agent", "Chief Revenue Officer", "#10b981",
                      "Complete sales engine with pipeline stages, outbound sequences, and lead scoring model")

        s1, s2 = st.columns([2, 1], gap="large")
        with s1:
            # Discovery script
            script = sales.get("discovery_script", "")
            st.markdown("""
            <div class="content-panel">
                <div class="panel-title">📞 Discovery Call Script</div>
            """, unsafe_allow_html=True)
            st.markdown(f"""
            <pre style="background:var(--bg-soft);border:1px solid var(--border-subtle);
                border-radius:10px;padding:16px;font-family:'Inter',sans-serif;
                font-size:13px;color:var(--text-primary);white-space:pre-wrap;line-height:1.75;
                overflow-x:hidden">{script}</pre>
            """, unsafe_allow_html=True)
            st.markdown("</div>", unsafe_allow_html=True)

            # Outbound sequence
            sequence = sales.get("outbound_sequence", [])
            st.markdown("""
            <div class="content-panel">
                <div class="panel-title">📬 Outbound Email Sequence (25-Day Cadence)</div>
            """, unsafe_allow_html=True)
            for touch in sequence:
                st.markdown(f"""
                <div style="display:flex;gap:12px;align-items:flex-start;padding:10px 0;
                    border-bottom:1px solid var(--border-subtle)">
                    <div style="min-width:56px;font-size:10px;font-weight:700;color:var(--blue);
                        background:var(--blue-bg);border:1px solid rgba(0,113,227,0.15);
                        padding:3px 6px;border-radius:4px;text-align:center">{touch['day']}</div>
                    <div>
                        <div style="font-size:13px;color:var(--text-primary);margin-bottom:2px;font-weight:600">{touch['touch']}</div>
                        <div style="font-size:11.5px;color:var(--text-secondary)">Goal: {touch['goal']}</div>
                    </div>
                </div>
                """, unsafe_allow_html=True)
            st.markdown("</div>", unsafe_allow_html=True)

        with s2:
            # Pipeline stages
            pipeline = sales.get("pipeline", [])
            st.markdown("""
            <div class="content-panel">
                <div class="panel-title">🔽 Sales Pipeline Stages</div>
            """, unsafe_allow_html=True)
            for stage in pipeline:
                st.markdown(f"""
                <div style="padding:10px 12px;background:var(--bg-soft);
                    border:1px solid var(--border-subtle);border-radius:8px;margin-bottom:8px">
                    <div style="display:flex;justify-content:space-between;margin-bottom:4px">
                        <div style="font-size:13px;font-weight:600;color:var(--text-primary)">{stage['stage']}</div>
                        <div style="font-size:11px;color:#34c759;font-weight:700">{stage['conversion']}</div>
                    </div>
                    <div style="font-size:10px;color:var(--text-secondary);margin-bottom:4px">Avg. {stage['avg_days']} days</div>
                    <div style="font-size:11.5px;color:var(--text-primary)">{stage['action']}</div>
                </div>
                """, unsafe_allow_html=True)
            st.markdown("</div>", unsafe_allow_html=True)

            # Lead scoring
            scoring = sales.get("lead_score_criteria", [])
            st.markdown("""
            <div class="content-panel">
                <div class="panel-title">⭐ Lead Scoring Model</div>
            """, unsafe_allow_html=True)
            for crit in scoring:
                st.markdown(f"""
                <div style="padding:8px 0;border-bottom:1px solid var(--border-subtle)">
                    <div style="display:flex;justify-content:space-between;margin-bottom:2px">
                        <div style="font-size:12.5px;color:var(--text-primary)">{crit['factor']}</div>
                        <div style="font-size:12px;font-weight:700;color:#34c759">{crit['weight']}</div>
                    </div>
                    <div style="font-size:10px;color:var(--text-secondary)">Score range: {crit['score_range']}</div>
                </div>
                """, unsafe_allow_html=True)
            st.markdown("</div>", unsafe_allow_html=True)

    # ─── FINANCE TAB ───
    with tab4:
        finance = outputs.get("finance", {})

        _agent_header("💹", "Finance Agent", "Chief Financial Intelligence Officer", "#f59e0b",
                      "Comprehensive risk assessment, cash flow modeling, and unit economics analysis")

        import plotly.graph_objects as go
        import pandas as pd
        from data_engine import DataEngine

        f1, f2 = st.columns([1, 1], gap="large")
        with f1:
            # Risk alerts
            st.markdown("""
            <div class="content-panel">
                <div class="panel-title">⚠️ Risk Intelligence Report</div>
            """, unsafe_allow_html=True)
            for alert in finance.get("risk_alerts", []):
                level = alert.get("level", "amber")
                icon_map = {"red": "🔴", "amber": "🟡", "green": "🟢"}
                label_map = {"red": "CRITICAL", "amber": "WARNING", "green": "HEALTHY"}
                st.markdown(f"""
                <div class="risk-alert {'amber' if level == 'amber' else ('green' if level == 'green' else '')}">
                    <span style="font-size:20px">{icon_map.get(level,'🟡')}</span>
                    <div>
                        <div class="risk-severity {level}">{label_map.get(level,'WARNING')} · {alert['title']}</div>
                        <div class="risk-desc">{alert['desc']}</div>
                    </div>
                </div>
                """, unsafe_allow_html=True)
            st.markdown("</div>", unsafe_allow_html=True)

        with f2:
            # Cash flow chart
            bd = st.session_state.business_data
            cf_data = DataEngine.generate_monthly_cash_flow(bd.get("annual_revenue", 1_000_000))
            fig = go.Figure()
            fig.add_trace(go.Bar(x=cf_data["Month"], y=cf_data["Revenue"],
                                 name="Revenue", marker_color="rgba(0,113,227,0.7)"))
            fig.add_trace(go.Bar(x=cf_data["Month"], y=[-v for v in cf_data["Expenses"]],
                                 name="Expenses", marker_color="rgba(255,59,48,0.6)"))
            fig.add_trace(go.Scatter(x=cf_data["Month"], y=cf_data["Net"],
                                     name="Net Cash Flow", mode="lines+markers",
                                     line=dict(color="#34c759", width=2),
                                     marker=dict(size=6, color="#34c759")))
            fig.update_layout(
                barmode="overlay",
                paper_bgcolor="rgba(0,0,0,0)", plot_bgcolor="rgba(0,0,0,0)",
                font=dict(family="Inter", color="#86868b", size=10),
                height=240, margin=dict(t=10, b=10, l=0, r=0),
                legend=dict(orientation="h", y=1.15, font=dict(size=10, color="#1d1d1f")),
                xaxis=dict(showgrid=False, tickfont=dict(size=9, color="#86868b")),
                yaxis=dict(showgrid=True, gridcolor="#e8e8ed",
                           tickfont=dict(size=9, color="#86868b"),
                           tickformat=".2s", tickprefix="$"),
            )
            st.markdown("""
            <div class="content-panel">
                <div class="panel-title">💰 Annual Cash Flow Model</div>
            """, unsafe_allow_html=True)
            st.plotly_chart(fig, use_container_width=True, config={"displayModeBar": False})
            st.markdown("</div>", unsafe_allow_html=True)

        # Unit economics full table
        unit_eco = finance.get("unit_economics", {})
        st.markdown("""
        <div class="content-panel">
            <div class="panel-title">📐 Unit Economics Model</div>
        """, unsafe_allow_html=True)
        ue_cols = st.columns(3)
        for i, (metric, val) in enumerate(unit_eco.items()):
            with ue_cols[i % 3]:
                color = "#34c759" if any(k in metric for k in ["Margin", "LTV"]) else "#ff9500" if "Burn" in metric else "#0071e3"
                st.markdown(f"""
                <div style="background:var(--bg-soft);border:1px solid var(--border-subtle);
                    border-radius:10px;padding:14px 16px;margin-bottom:10px;text-align:center">
                    <div style="font-size:10px;color:var(--text-secondary);letter-spacing:1px;text-transform:uppercase;margin-bottom:6px">{metric}</div>
                    <div style="font-size:22px;font-weight:800;color:{color}">{val}</div>
                </div>
                """, unsafe_allow_html=True)
        st.markdown("</div>", unsafe_allow_html=True)

    # ─── CEO SYNTHESIS TAB ───
    with tab5:
        ceo = outputs.get("ceo", {})
        _agent_header("👔", "CEO Agent", "Chief Intelligence Officer", "#0071e3",
                      "Executive synthesis — board-ready briefing distilled from all agent outputs")

        c1, c2 = st.columns([2, 1], gap="large")
        with c1:
            st.markdown("""
            <div class="content-panel">
                <div class="panel-title">📋 Board Briefing Document</div>
            """, unsafe_allow_html=True)
            st.markdown(f"""
            <div style="padding:18px;background:var(--bg-soft);border-radius:10px;
                border:1px solid var(--border-subtle);margin-bottom:14px">
                <div style="font-size:11px;color:var(--blue);font-weight:700;letter-spacing:1.5px;
                    text-transform:uppercase;margin-bottom:10px">EXECUTIVE SUMMARY</div>
                <p style="font-size:14px;color:var(--text-primary);line-height:1.8;margin:0">
                    {ceo.get('summary', '')}
                </p>
            </div>
            """, unsafe_allow_html=True)
            st.markdown(f"""
            <div style="padding:16px;background:var(--bg-soft);border-radius:10px;
                border-left:3px solid var(--text-primary)">
                <div style="font-size:10px;color:var(--text-secondary);font-weight:700;letter-spacing:1.5px;margin-bottom:6px">
                    STRATEGIC MANDATE
                </div>
                <div style="font-size:15px;color:var(--text-primary);font-weight:600;line-height:1.5">
                    {ceo.get('mandate', '')}
                </div>
            </div>
            """, unsafe_allow_html=True)
            st.markdown("</div>", unsafe_allow_html=True)

        with c2:
            # Health scores
            st.markdown("""
            <div class="content-panel">
                <div class="panel-title">🏥 Business Health Scores</div>
            """, unsafe_allow_html=True)
            for label, score, color in [
                ("Business Health", ceo.get("health_score", 78), "#0071e3"),
                ("Growth Score", ceo.get("growth_score", 71), "#af52de"),

            ]:
                st.markdown(f"""
                <div style="margin-bottom:16px">
                    <div style="display:flex;justify-content:space-between;margin-bottom:6px">
                        <div style="font-size:12px;color:var(--text-secondary)">{label}</div>
                        <div style="font-size:14px;font-weight:700;color:{color}">{score}/100</div>
                    </div>
                    <div style="background:var(--border-subtle);border-radius:100px;height:6px">
                        <div style="width:{score}%;height:100%;background:{color};border-radius:100px;
                            transition:width 1s ease"></div>
                    </div>
                </div>
                """, unsafe_allow_html=True)
            st.markdown("</div>", unsafe_allow_html=True)

            st.markdown("""
            <div class="content-panel">
                <div class="panel-title">📡 Agent Sync Status</div>
            """, unsafe_allow_html=True)
            for agent, output_key in [("CEO Agent", "ceo"), ("Strategy Agent", "strategy"),
                                       ("Marketing Agent", "marketing"), ("Sales Agent", "sales"),
                                       ("Finance Agent", "finance")]:
                done = output_key in outputs and bool(outputs[output_key])
                st.markdown(f"""
                <div style="display:flex;align-items:center;gap:8px;padding:6px 0;
                    border-bottom:1px solid var(--border-subtle)">
                    <div style="width:7px;height:7px;border-radius:50%;
                        background:{'#34c759' if done else '#8e8e93'}"></div>
                    <div style="font-size:12px;color:var(--text-primary)">{agent}</div>
                    <div style="margin-left:auto;font-size:10px;
                        color:{'#34c759' if done else '#8e8e93'};font-weight:600">
                        {'COMPLETE' if done else 'PENDING'}
                    </div>
                </div>
                """, unsafe_allow_html=True)
            st.markdown("</div>", unsafe_allow_html=True)


def _agent_header(icon, name, role, color, description):
    st.markdown(f"""
    <div style="background:var(--bg-card);border:1px solid var(--border-color);border-radius:14px;
        padding:20px 24px;margin-bottom:20px;display:flex;align-items:center;gap:16px">
        <div style="width:52px;height:52px;border-radius:12px;background:{color}12;
            border:1px solid {color}33;display:flex;align-items:center;
            justify-content:center;font-size:26px;flex-shrink:0">{icon}</div>
        <div>
            <div style="font-size:18px;font-weight:800;color:var(--text-primary)">{name}</div>
            <div style="font-size:12px;color:{color};font-weight:600;margin-bottom:4px">{role}</div>
            <div style="font-size:13px;color:var(--text-secondary)">{description}</div>
        </div>
        <div style="margin-left:auto;background:{color}12;border:1px solid {color}33;
            border-radius:100px;padding:6px 14px;font-size:11px;font-weight:700;
            color:{color};letter-spacing:0.5px;white-space:nowrap">
            ✅ OUTPUT READY
        </div>
    </div>
    """, unsafe_allow_html=True)
