"""
Page 1: Executive Dashboard (Dominate)
Spatial glass command-center with live metrics, CEO summary, risk alerts, and recommendations.
"""

import streamlit as st
import plotly.graph_objects as go
import plotly.express as px
import pandas as pd
import numpy as np
from data_engine import DataEngine


def render_metric_card(label, value, delta, icon, color_class, prefix="", suffix=""):
    delta_class = "pos" if "+" in str(delta) or (isinstance(delta, (int, float)) and delta > 0) else "neg"
    delta_str = f"+{delta}" if isinstance(delta, (int, float)) and delta > 0 else str(delta)
    st.markdown(f"""
    <div class="metric-card {color_class}">
        <div class="metric-icon">{icon}</div>
        <div class="metric-label">{label}</div>
        <div class="metric-value" style="color: var(--text-primary)">
            {prefix}<span>{value}</span>{suffix}
        </div>
        <div class="metric-delta {delta_class}">{'↑' if delta_class == 'pos' else '↓'} {delta_str} vs last period</div>
    </div>
    """, unsafe_allow_html=True)


def render_dashboard():
    # ── Hero ──
    st.markdown("""
    <div class="page-hero">
        <div>
            <div class="hero-badge">⚡ LIVE · MULTI-AGENT SYNTHESIS</div>
            <div class="hero-title">Executive Command Center</div>
            <div class="hero-sub">Real-time intelligence from your autonomous AI boardroom · 5D Framework: <strong style="color:var(--accent-green)">DOMINATE</strong></div>
        </div>
        <div style="text-align:right">
            <div style="font-size:10px;color:var(--text-muted);letter-spacing:1.5px;text-transform:uppercase;margin-bottom:6px">System Status</div>
            <div style="display:flex;align-items:center;gap:8px;justify-content:flex-end">
                <div style="width:7px;height:7px;border-radius:50%;background:var(--accent-green);box-shadow:0 0 10px var(--accent-green);animation:pulse-green 2s infinite"></div>
                <span style="color:var(--accent-green);font-weight:600;font-size:13px">All Agents Online</span>
            </div>
            <div style="font-size:11px;color:var(--text-tertiary);margin-top:4px">5 Agents · Autonomous Mode</div>
        </div>
    </div>
    """, unsafe_allow_html=True)

    if not st.session_state.onboarded:
        st.markdown("""
        <div style="text-align:center;padding:70px 40px;background:#f5f5f7;border:1px dashed var(--border-color);border-radius:20px">
            <div style="font-size:52px;margin-bottom:18px">🚀</div>
            <div style="font-size:20px;font-weight:700;color:var(--text-primary);margin-bottom:10px">No Business Intelligence Loaded</div>
            <div style="color:var(--text-secondary);font-size:13.5px;max-width:400px;margin:0 auto;line-height:1.7">
                Navigate to <strong style="color:var(--text-primary)">Discovery &amp; Onboarding</strong> to onboard your business and activate the multi-agent system.
            </div>
        </div>
        """, unsafe_allow_html=True)
        return

    outputs = st.session_state.agent_outputs
    bd = st.session_state.business_data
    ceo = outputs.get("ceo", {})
    finance = outputs.get("finance", {})
    sales = outputs.get("sales", {})
    strategy = outputs.get("strategy", {})

    # ── TOP METRICS ROW 1 ──
    st.markdown('<div class="section-eyebrow">KEY PERFORMANCE INDICATORS</div>', unsafe_allow_html=True)
    c1, c2, c3, c4, c5, c6 = st.columns(6)
    with c1:
        render_metric_card("Business Health", ceo.get("health_score", 78), "+6", "❤️", "blue", suffix="/100")
    with c2:
        render_metric_card("Growth Score", ceo.get("growth_score", 71), "+12", "📈", "purple", suffix="/100")
    with c3:
        rev = sales.get("revenue_opportunity", 245000)
        render_metric_card("Revenue Opp.", f"{rev:,.0f}", f"${int(rev*0.08):,}", "💰", "green", prefix="$")
    with c4:
        render_metric_card("Lead Score", sales.get("lead_score", 82), "+9", "🎯", "cyan", suffix="/100")
    with c5:
        render_metric_card("Customer Health", finance.get("customer_health", 77), "+4", "👥", "amber", suffix="/100")
    with c6:
        render_metric_card("Market Readiness", finance.get("market_readiness", 73), "+7", "🌐", "blue", suffix="/100")

    st.markdown("<br>", unsafe_allow_html=True)

    # ── MAIN PANEL ──
    left_col, right_col = st.columns([3, 2], gap="large")

    with left_col:
        # Executive Summary
        st.markdown("""
        <div class="content-panel">
            <div class="panel-title">
                <span>👔</span> CEO Agent — Executive Summary
                <span style="margin-left:auto;font-size:9px;color:var(--text-primary);background:var(--bg-soft);
                    padding:3px 10px;border-radius:100px;border:1px solid var(--border-color);font-weight:700;letter-spacing:0.5px">SYNTHESIZED</span>
            </div>
        """, unsafe_allow_html=True)
        st.markdown(f"""
        <p style="font-size:14px;color:var(--text-primary);line-height:1.8;margin:0">
            {ceo.get('summary', 'Generating executive summary...')}
        </p>
        """, unsafe_allow_html=True)
        if ceo.get("mandate"):
            st.markdown(f"""
            <div style="margin-top:14px;padding:13px 16px;background:var(--bg-soft);
                border-left:3px solid var(--text-primary);border-radius:0 10px 10px 0">
                <div style="font-size:9px;letter-spacing:2px;text-transform:uppercase;
                    color:var(--text-secondary);margin-bottom:5px;font-weight:700">STRATEGIC MANDATE</div>
                <div style="font-size:13.5px;color:var(--text-primary);font-weight:500;line-height:1.5">{ceo.get('mandate','')}</div>
            </div>
            """, unsafe_allow_html=True)
        st.markdown("</div>", unsafe_allow_html=True)

        # Revenue Chart
        st.markdown("""
        <div class="content-panel">
            <div class="panel-title"><span>📊</span> Revenue Trajectory & Projections</div>
        """, unsafe_allow_html=True)
        rev_data = DataEngine.generate_revenue_chart_data(bd.get("annual_revenue", 1_000_000))
        fig = go.Figure()
        fig.add_trace(go.Scatter(
            x=rev_data["Quarter"], y=rev_data["Revenue"],
            mode="lines+markers",
            name="Revenue",
            line=dict(color="#3b82f6", width=3),
            marker=dict(size=8, color="#3b82f6", symbol="circle",
                        line=dict(color="#1e3a5f", width=2)),
            fill="tozeroy",
            fillcolor="rgba(59,130,246,0.08)",
        ))
        forecast_mask = rev_data["Forecast"].notna()
        if forecast_mask.any():
            fig.add_trace(go.Scatter(
                x=rev_data.loc[forecast_mask, "Quarter"],
                y=rev_data.loc[forecast_mask, "Forecast"],
                mode="lines+markers",
                name="Forecast",
                line=dict(color="#8b5cf6", width=2, dash="dot"),
                marker=dict(size=7, color="#8b5cf6"),
            ))
        fig.update_layout(
            paper_bgcolor="rgba(0,0,0,0)", plot_bgcolor="rgba(0,0,0,0)",
            font=dict(family="Inter", color="#86868b", size=11),
            margin=dict(t=10, b=10, l=0, r=0),
            height=220,
            legend=dict(orientation="h", y=1.1, font=dict(size=11)),
            xaxis=dict(showgrid=False, zeroline=False,
                       tickfont=dict(size=10, color="#86868b")),
            yaxis=dict(showgrid=True, zeroline=False,
                       gridcolor="#e8e8ed",
                       tickfont=dict(size=10, color="#86868b"),
                       tickprefix="$", tickformat=".2s"),
            hoverlabel=dict(bgcolor="#ffffff", bordercolor="#d2d2d7", font_color="#1d1d1f"),
        )
        st.plotly_chart(fig, use_container_width=True, config={"displayModeBar": False})
        st.markdown("</div>", unsafe_allow_html=True)

        # AI Recommendations
        st.markdown("""
        <div class="content-panel">
            <div class="panel-title"><span>🤖</span> AI Recommendations</div>
        """, unsafe_allow_html=True)

        recs = _generate_recommendations(bd, outputs)
        for i, rec in enumerate(recs[:5], 1):
            st.markdown(f"""
            <div class="rec-item">
                <div class="rec-num">{i}</div>
                <div class="rec-text">{rec}</div>
            </div>
            """, unsafe_allow_html=True)
        st.markdown("</div>", unsafe_allow_html=True)

    with right_col:
        # Risk Alerts
        st.markdown("""
        <div class="content-panel">
            <div class="panel-title"><span>⚠️</span> Finance Agent — Risk Alerts</div>
        """, unsafe_allow_html=True)
        risk_alerts = finance.get("risk_alerts", [])
        for alert in risk_alerts:
            level = alert.get("level", "amber")
            icon_map = {"red": "🔴", "amber": "🟡", "green": "🟢"}
            label_map = {"red": "CRITICAL", "amber": "WARNING", "green": "HEALTHY"}
            css_class = "amber" if level == "amber" else ("green" if level == "green" else "")
            st.markdown(f"""
            <div class="risk-alert {css_class}">
                <span style="font-size:16px">{icon_map.get(level,'🟡')}</span>
                <div>
                    <div class="risk-severity {level}">{label_map.get(level,'WARNING')} · {alert['title']}</div>
                    <div class="risk-desc">{alert['desc']}</div>
                </div>
            </div>
            """, unsafe_allow_html=True)
        st.markdown("</div>", unsafe_allow_html=True)

        # Unit Economics
        unit_eco = finance.get("unit_economics", {})
        if unit_eco:
            st.markdown("""
            <div class="content-panel">
                <div class="panel-title"><span>💹</span> Unit Economics</div>
            """, unsafe_allow_html=True)
            for metric, val in unit_eco.items():
                positive = any(k in metric for k in ["Margin", "LTV:CAC"])
                color = "#34c759" if positive else "var(--text-primary)"
                st.markdown(f"""
                <div style="display:flex;justify-content:space-between;align-items:center;
                    padding:8px 0;border-bottom:1px solid var(--border-subtle)">
                    <span style="font-size:12px;color:var(--text-secondary)">{metric}</span>
                    <span style="font-size:14px;font-weight:700;color:{color}">{val}</span>
                </div>
                """, unsafe_allow_html=True)
            st.markdown("</div>", unsafe_allow_html=True)

        # Radar Chart
        radar_data = DataEngine.generate_competitive_radar(bd.get("industry", "Technology"))
        fig_radar = go.Figure()
        cats = radar_data["categories"] + [radar_data["categories"][0]]
        your_s = radar_data["your_scores"] + [radar_data["your_scores"][0]]
        comp_s = radar_data["competitor_scores"] + [radar_data["competitor_scores"][0]]

        fig_radar.add_trace(go.Scatterpolar(
            r=your_s, theta=cats, fill="toself", name=bd.get("company_name", "You"),
            line_color="#3b82f6", fillcolor="rgba(59,130,246,0.15)",
        ))
        fig_radar.add_trace(go.Scatterpolar(
            r=comp_s, theta=cats, fill="toself", name="Avg. Competitor",
            line_color="#8b5cf6", fillcolor="rgba(139,92,246,0.1)",
        ))
        fig_radar.update_layout(
            polar=dict(
                bgcolor="rgba(0,0,0,0)",
                radialaxis=dict(visible=True, range=[0, 100],
                                gridcolor="#e8e8ed",
                                tickfont=dict(size=9, color="#86868b")),
                angularaxis=dict(tickfont=dict(size=10, color="#86868b"),
                                 gridcolor="#e8e8ed"),
            ),
            paper_bgcolor="rgba(0,0,0,0)",
            font=dict(family="Inter", color="#86868b"),
            height=280,
            margin=dict(t=20, b=20, l=20, r=20),
            legend=dict(font=dict(size=11, color="#1d1d1f"), orientation="h", y=-0.1),
            showlegend=True,
        )
        st.markdown("""
        <div class="content-panel">
            <div class="panel-title"><span>🎯</span> Competitive Intelligence Radar</div>
        """, unsafe_allow_html=True)
        st.plotly_chart(fig_radar, use_container_width=True, config={"displayModeBar": False})
        st.markdown("</div>", unsafe_allow_html=True)

    # ── BOTTOM ROW: Funnel + Cash Flow ──
    st.markdown("<br>", unsafe_allow_html=True)
    b1, b2 = st.columns(2, gap="large")

    with b1:
        st.markdown("""
        <div class="content-panel">
            <div class="panel-title"><span>🔽</span> Sales Funnel Analytics</div>
        """, unsafe_allow_html=True)
        funnel = DataEngine.generate_funnel_data(bd.get("industry", "Technology"))
        fig_f = go.Figure(go.Funnel(
            y=funnel["labels"],
            x=funnel["values"],
            textinfo="value+percent initial",
            marker=dict(color=["#0071e3", "#6366f1", "#af52de", "#a855f7", "#34c759"]),
            connector=dict(line=dict(color="#e8e8ed", width=1)),
            textfont=dict(family="Inter", size=12, color="white"),
        ))
        fig_f.update_layout(
            paper_bgcolor="rgba(0,0,0,0)", plot_bgcolor="rgba(0,0,0,0)",
            font=dict(family="Inter", color="#86868b"),
            height=230, margin=dict(t=10, b=10, l=10, r=10),
            yaxis=dict(tickfont=dict(size=11, color="#86868b")),
        )
        st.plotly_chart(fig_f, use_container_width=True, config={"displayModeBar": False})
        st.markdown("</div>", unsafe_allow_html=True)

    with b2:
        st.markdown("""
        <div class="content-panel">
            <div class="panel-title"><span>💰</span> Monthly Cash Flow Model</div>
        """, unsafe_allow_html=True)
        cf_data = DataEngine.generate_monthly_cash_flow(bd.get("annual_revenue", 1_000_000))
        fig_cf = go.Figure()
        fig_cf.add_trace(go.Bar(
            x=cf_data["Month"], y=cf_data["Revenue"],
            name="Revenue", marker_color="rgba(0,113,227,0.7)",
        ))
        fig_cf.add_trace(go.Bar(
            x=cf_data["Month"], y=[-v for v in cf_data["Expenses"]],
            name="Expenses", marker_color="rgba(255,59,48,0.6)",
        ))
        fig_cf.add_trace(go.Scatter(
            x=cf_data["Month"], y=cf_data["Net"],
            name="Net", mode="lines+markers",
            line=dict(color="#34c759", width=2),
            marker=dict(size=6, color="#34c759"),
        ))
        fig_cf.update_layout(
            barmode="overlay",
            paper_bgcolor="rgba(0,0,0,0)", plot_bgcolor="rgba(0,0,0,0)",
            font=dict(family="Inter", color="#86868b", size=10),
            height=230, margin=dict(t=10, b=10, l=0, r=0),
            legend=dict(orientation="h", y=1.15, font=dict(size=10, color="#1d1d1f")),
            xaxis=dict(showgrid=False, tickfont=dict(size=9, color="#86868b")),
            yaxis=dict(showgrid=True, gridcolor="#e8e8ed",
                       tickfont=dict(size=9, color="#86868b"),
                       tickformat=".2s", tickprefix="$"),
            hoverlabel=dict(bgcolor="#ffffff", font_color="#1d1d1f"),
        )
        st.plotly_chart(fig_cf, use_container_width=True, config={"displayModeBar": False})
        st.markdown("</div>", unsafe_allow_html=True)


def _generate_recommendations(bd: dict, outputs: dict) -> list:
    industry = bd.get("industry", "Technology")
    company = bd.get("company_name", "your company")
    strategy = outputs.get("strategy", {}).get("strategy", {})

    base_recs = strategy.get("pillars", [
        "Accelerate top-of-funnel lead generation via paid and organic channels",
        "Implement a customer success program to reduce churn by 20% in Q1",
        "Explore strategic partnerships to expand addressable market",
        "Invest in marketing automation to reduce CAC by 15%",
        "Launch referral program targeting existing customer base",
    ])

    dynamic = [
        f"Prioritize {strategy.get('primary', 'growth-led')} as the primary growth motion for {company}",
        f"Activate competitive moat: {strategy.get('competitive_moat', 'differentiation strategy')}",
        f"Target key market segments: {', '.join(strategy.get('markets', ['primary TAM'])[:2])}",
    ]

    return dynamic + base_recs[:3]
