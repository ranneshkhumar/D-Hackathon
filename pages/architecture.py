"""
Page 4: Architecture & Flows
System architecture diagrams and business growth flow visualization.
"""

import streamlit as st
# pyrefly: ignore [missing-import]
import plotly.graph_objects as go


def render_architecture():
    # ── Hero ──
    st.markdown("""
    <div class="page-hero">
        <div>
            <div class="hero-badge">🏗️ SYSTEM ARCHITECTURE</div>
            <div class="hero-title">Architecture & Flow Diagrams</div>
            <div class="hero-sub">Technical blueprint of the Aegis multi-agent intelligence platform</div>
        </div>
        <div style="text-align:right">
            <div style="font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:1.5px">Platform</div>
            <div style="font-size:17px;font-weight:800;color:var(--accent-blue);letter-spacing:-0.3px">Aegis OS v1.0</div>
            <div style="font-size:10px;color:var(--text-tertiary)">Multi-Agent Architecture</div>
        </div>
    </div>
    """, unsafe_allow_html=True)

    tab1, tab2 = st.tabs(["🔄 Business Growth Flow", "🏗️ Technical Architecture"])

    # ════════════════════════════════════
    # TAB 1 — BUSINESS GROWTH FLOW
    # ════════════════════════════════════
    with tab1:
        st.markdown('<div class="section-eyebrow" style="margin-bottom:16px">END-TO-END BUSINESS GROWTH FLOW</div>', unsafe_allow_html=True)

        # Plotly Sankey / Flow diagram
        _render_growth_flow_diagram()

        st.markdown("<br>", unsafe_allow_html=True)
        st.markdown('<div class="section-eyebrow" style="margin-bottom:16px">FLOW STAGE BREAKDOWN</div>', unsafe_allow_html=True)

        flow_stages = [
            ("👤", "User", "Business owner / strategist inputs company data, goals, and documentation into the Aegis platform.", "#3b82f6"),
            ("🔍", "Business Discovery", "The Discovery Engine parses all inputs, extracts signals, and creates a structured business intelligence object.", "#8b5cf6"),
            ("🤖", "AI Analysis", "All 5 autonomous agents receive the intelligence object and execute their specialized analysis in sequence.", "#06b6d4"),
            ("🧭", "Strategy Formation", "The Strategy Agent synthesizes market intelligence into a comprehensive 12-month growth blueprint.", "#10b981"),
            ("🚀", "Execution Layer", "Marketing and Sales agents translate strategy into tangible deliverables: campaigns, scripts, pipelines.", "#f59e0b"),
            ("📊", "Analytics & Monitoring", "The Finance Agent continuously monitors KPIs, flags risks, and tracks unit economics.", "#ef4444"),
            ("🎯", "Recommendations", "The CEO Agent synthesizes all outputs into prioritized, actionable recommendations.", "#a855f7"),
            ("👑", "Business Growth", "The business achieves measurable growth outcomes, feeding back into the next growth cycle.", "#10b981"),
        ]

        for i in range(0, len(flow_stages), 2):
            cols = st.columns(2, gap="large")
            for j, col in enumerate(cols):
                idx = i + j
                if idx < len(flow_stages):
                    icon, title, desc, color = flow_stages[idx]
                    with col:
                        st.markdown(f"""
                        <div style="display:flex;gap:14px;align-items:flex-start;padding:16px;
                            background:var(--bg-card);border:1px solid var(--border-color);
                            border-radius:12px;margin-bottom:12px;
                            border-left:3px solid {color}">
                            <div style="width:38px;height:38px;border-radius:8px;background:{color}12;
                                border:1px solid {color}33;display:flex;align-items:center;
                                justify-content:center;font-size:20px;flex-shrink:0">{icon}</div>
                            <div>
                                <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
                                    <span style="font-size:14px;font-weight:700;color:var(--text-primary)">{title}</span>
                                    <span style="font-size:10px;background:{color}12;color:{color};
                                        padding:2px 7px;border-radius:100px;border:1px solid {color}22;
                                        font-weight:700">STEP {idx+1}</span>
                                </div>
                                <div style="font-size:13px;color:var(--text-secondary);line-height:1.6">{desc}</div>
                            </div>
                        </div>
                        """, unsafe_allow_html=True)

    # ════════════════════════════════════
    # TAB 2 — TECHNICAL ARCHITECTURE
    # ════════════════════════════════════
    with tab2:
        st.markdown('<div class="section-eyebrow" style="margin-bottom:16px">TECHNICAL SYSTEM ARCHITECTURE</div>', unsafe_allow_html=True)

        _render_technical_architecture()

        st.markdown("<br>", unsafe_allow_html=True)

        # Layer-by-layer breakdown
        st.markdown('<div class="section-eyebrow" style="margin-bottom:16px">ARCHITECTURE LAYER DETAILS</div>', unsafe_allow_html=True)

        layers = [
            {
                "name": "FRONTEND LAYER",
                "color": "#3b82f6",
                "icon": "🖥️",
                "desc": "Streamlit-based interactive UI rendering multi-page navigation, real-time charts, and dynamic agent output panels.",
                "components": ["Streamlit App (app.py)", "4-Page Navigation Router", "Plotly Chart Engine",
                                "CSS Design System", "Session State Manager", "AI Copilot Chat"],
            },
            {
                "name": "ORCHESTRATION LAYER",
                "color": "#8b5cf6",
                "icon": "🎯",
                "desc": "Agent Orchestrator manages sequential agent execution, maintains shared state, and routes outputs between agents.",
                "components": ["AgentOrchestrator Class", "Sequential Pipeline Runner", "Inter-Agent Message Bus",
                                "State Management", "Execution Timeline Logger"],
            },
            {
                "name": "AI AGENT LAYER — MULTI-AGENT SYSTEM",
                "color": "#06b6d4",
                "icon": "🤖",
                "desc": "5 specialized autonomous AI agents each with distinct roles, inputs, outputs, and decision-making logic.",
                "components": ["CEO Agent (Strategic Synthesis)", "Strategy Agent (Market Intelligence)",
                                "Marketing Agent (Campaign Generation)", "Sales Agent (Revenue Engine)",
                                "Finance Agent (Risk & Economics)"],
            },
            {
                "name": "KNOWLEDGE LAYER — VECTOR DB SIMULATION",
                "color": "#10b981",
                "icon": "🧠",
                "desc": "Simulated vector knowledge base containing industry benchmarks, market intelligence, and business templates.",
                "components": ["Industry Benchmark Store (8 verticals)", "Market Intelligence Corpus",
                                "Campaign Template Library", "Sales Script Repository", "Risk Pattern Database"],
            },
            {
                "name": "DATA LAYER",
                "color": "#f59e0b",
                "icon": "💾",
                "desc": "Session-based data persistence layer managing business profiles, agent outputs, and historical analytics.",
                "components": ["Streamlit Session State (st.session_state)", "Business Profile Store",
                                "Agent Output Cache", "Conversation History", "Chart Data Engine"],
            },
            {
                "name": "OUTPUT / DASHBOARD LAYER",
                "color": "#a855f7",
                "icon": "📊",
                "desc": "Premium analytics dashboard presenting synthesized intelligence through interactive visualizations.",
                "components": ["Executive Dashboard", "Agent Boardroom View", "Risk Alert System",
                                "Revenue Projections", "Competitive Intelligence Radar"],
            },
        ]

        for layer in layers:
            color = layer["color"]
            st.markdown(f"""
            <div style="background:var(--bg-card);border:1px solid var(--border-color);
                border-top:3px solid {color};border-radius:12px;padding:20px 24px;margin-bottom:14px">
                <div style="display:flex;align-items:center;gap:12px;margin-bottom:14px">
                    <div style="font-size:22px">{layer['icon']}</div>
                    <div>
                        <div style="font-size:11px;font-weight:700;letter-spacing:2px;
                            color:{color};text-transform:uppercase">{layer['name']}</div>
                        <div style="font-size:13px;color:var(--text-secondary);margin-top:2px">{layer['desc']}</div>
                    </div>
                </div>
                <div style="display:flex;flex-wrap:wrap;gap:8px">
            """, unsafe_allow_html=True)
            for comp in layer["components"]:
                st.markdown(f"""
                    <span style="background:{color}12;border:1px solid {color}33;border-radius:6px;
                        padding:5px 12px;font-size:12px;color:{color};font-weight:500">{comp}</span>
                """, unsafe_allow_html=True)
            st.markdown("</div></div>", unsafe_allow_html=True)

        # Data flow arrows
        st.markdown("<br>", unsafe_allow_html=True)
        st.markdown('<div class="section-eyebrow" style="margin-bottom:16px">DATA FLOW SEQUENCE</div>', unsafe_allow_html=True)

        flow_steps = [
            ("User Input", "Business Form", "Business profile + docs submitted via Discovery page"),
            ("Frontend", "Orchestrator", "Business data object passed to AgentOrchestrator"),
            ("Orchestrator", "CEO Agent", "Full business data sent for initial analysis"),
            ("CEO Agent", "Strategy Agent", "Mandate + processed data forwarded"),
            ("Strategy Agent", "Marketing Agent", "Strategy blueprint + market segments passed"),
            ("Marketing Agent", "Sales Agent", "Campaign assets + channel strategy shared"),
            ("Sales Agent", "Finance Agent", "Revenue targets + pipeline data sent for risk analysis"),
            ("Finance Agent", "CEO Agent", "Risk alerts + financial model returned for synthesis"),
            ("CEO Agent", "Dashboard", "Synthesized executive intelligence rendered to UI"),
        ]

        st.markdown("""
        <div class="content-panel">
            <div class="panel-title">📡 Inter-Agent Data Flow</div>
        """, unsafe_allow_html=True)
        for src, dst, desc in flow_steps:
            st.markdown(f"""
            <div style="display:flex;align-items:center;gap:12px;padding:10px 0;
                border-bottom:1px solid var(--border-subtle)">
                <div style="min-width:120px;font-size:12px;font-weight:600;
                    color:var(--text-primary);text-align:right">{src}</div>
                <div style="color:var(--blue);font-size:18px;flex-shrink:0">→</div>
                <div style="min-width:100px;font-size:12px;font-weight:600;color:#34c759">{dst}</div>
                <div style="font-size:12px;color:var(--text-secondary)">{desc}</div>
            </div>
            """, unsafe_allow_html=True)
        st.markdown("</div>", unsafe_allow_html=True)


def _render_growth_flow_diagram():
    """Render the Business Growth Flow as a custom HTML/CSS responsive grid."""
    steps = [
        {"num": "1", "icon": "📝", "label": "Onboarding", "desc": "Ingestion of company pitch documentation & metrics.", "color": "#3b82f6"},
        {"num": "2", "icon": "🔍", "label": "Vertical Parse", "desc": "Discovery Engine extracts baseline market & segment parameters.", "color": "#8b5cf6"},
        {"num": "3", "icon": "👔", "label": "CEO Mandate", "desc": "Chief Agent synthesizes baseline & locks core strategic growth mandates.", "color": "#06b6d4"},
        {"num": "4", "icon": "🧭", "label": "Strategy Design", "desc": "Strategy Agent maps out 12-month horizon roadmap initiatives.", "color": "#10b981"},
        {"num": "5", "icon": "📣", "label": "Campaign Delivery", "desc": "Marketing & Sales Agents build assets, channels, scripts.", "color": "#f59e0b"},
        {"num": "6", "icon": "💹", "label": "Finance Audit", "desc": "Finance Agent models risk vectors & unit economics trends.", "color": "#ef4444"},
        {"num": "7", "icon": "👑", "label": "Category Leader", "desc": "CEO compiles recommendation blueprints to command market.", "color": "#a855f7"}
    ]
    
    st.markdown("""
    <div class="content-panel" style="background:#ffffff; border: 1px solid var(--border-color); padding:24px; border-radius:18px; box-shadow:0 1px 3px rgba(0,0,0,0.02)">
        <div style="font-size:16px; font-weight:700; color:var(--text-primary); margin-bottom:20px; display:flex; align-items:center; gap:8px">
            <span>🔄</span> 5D Framework End-to-End Execution Sequence
        </div>
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap:16px">
    """, unsafe_allow_html=True)
    
    for step in steps:
        color = step["color"]
        st.markdown(f"""
        <div style="background:#f5f5f7; border: 1px solid var(--border-color); border-radius:12px; padding:16px; display:flex; flex-direction:column; justify-content:space-between; min-height:160px">
            <div>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px">
                    <div style="width:32px; height:32px; border-radius:8px; background:{color}12; border:1px solid {color}33; display:flex; align-items:center; justify-content:center; font-size:16px">
                        {step['icon']}
                    </div>
                    <span style="font-size:10px; font-weight:800; background:{color}12; color:{color}; border:1px solid {color}22; padding:2px 8px; border-radius:100px">STEP {step['num']}</span>
                </div>
                <div style="font-size:13px; font-weight:700; color:#1d1d1f; margin-bottom:4px">{step['label']}</div>
                <div style="font-size:11px; color:#86868b; line-height:1.4">{step['desc']}</div>
            </div>
            <div style="font-size:9px; font-weight:700; color:{color}; letter-spacing:0.5px; text-transform:uppercase; margin-top:8px; display:flex; align-items:center; gap:4px">
                <span>⚡</span> Pipeline Active
            </div>
        </div>
        """, unsafe_allow_html=True)
        
    st.markdown("</div></div>", unsafe_allow_html=True)


def _render_technical_architecture():
    """Render the technical architecture as a layered HTML/CSS stacked blueprint."""
    layers_config = [
        {
            "name": "OUTPUT LAYER",
            "icon": "📊",
            "title": "Output / Dashboard Layer",
            "desc": "Renders real-time business intelligence, unit economics models, and inter-agent boardroom transcripts.",
            "components": ["Executive Dashboard", "Boardroom Center", "Flow Architecture"],
            "color": "#a855f7"
        },
        {
            "name": "FRONTEND LAYER",
            "icon": "🖥️",
            "title": "Frontend App Layer (Streamlit)",
            "desc": "Orchestrates multi-page layouts, injects off-white style guides, and binds inputs to Session State variables.",
            "components": ["Streamlit Router", "CSS Theme Engine", "Session State Manager"],
            "color": "#3b82f6"
        },
        {
            "name": "ORCHESTRATION LAYER",
            "icon": "🎯",
            "title": "Multi-Agent Orchestration Layer",
            "desc": "Binds multi-agent lifecycles, runs pipelines, logs chatter milestones, and routes inputs.",
            "components": ["AgentOrchestrator Engine", "Inter-Agent Message Bus", "Execution Timeline"],
            "color": "#8b5cf6"
        },
        {
            "name": "AGENT REASONING LAYER",
            "icon": "🤖",
            "title": "Autonomous AI Agent Layer",
            "desc": "5 specialized micro-engines reasoning concurrently over Strategy, Marketing, Sales, Finance, and CEO mandates.",
            "components": ["CEO Agent", "Strategy Agent", "Marketing Agent", "Sales Agent", "Finance Agent"],
            "color": "#06b6d4"
        },
        {
            "name": "KNOWLEDGE LAYER",
            "icon": "🧠",
            "title": "Vector Benchmark & Knowledge DB",
            "desc": "Serves target industry benchmark parameters, performance indicators, and structural prompt assets.",
            "components": ["Industry Benchmarks Store", "Market Intelligence Corpus", "Campaign Templates Library"],
            "color": "#10b981"
        },
        {
            "name": "DATA LAYER",
            "icon": "💾",
            "title": "Business Context & Persistence Layer",
            "desc": "Caches session records, parsed pitch documentations, and historical simulation runs.",
            "components": ["st.session_state store", "Business Data Profiles", "Agent Output Cache"],
            "color": "#f59e0b"
        }
    ]
    
    st.markdown("""
    <div class="content-panel" style="background:#ffffff; border: 1px solid var(--border-color); padding:24px; border-radius:18px; box-shadow:0 1px 3px rgba(0,0,0,0.02)">
        <div style="font-size:16px; font-weight:700; color:var(--text-primary); margin-bottom:20px; display:flex; align-items:center; gap:8px">
            <span>🏗️</span> Aegis Platform Blueprint Architecture
        </div>
        <div style="display:flex; flex-direction:column; gap:12px; position:relative">
    """, unsafe_allow_html=True)
    
    for i, layer in enumerate(layers_config):
        color = layer["color"]
        # Render chips string
        chips_html = "".join(f"<span style='font-size:10px; background:#ffffff; border:1px solid var(--border-color); color:#86868b; padding:2px 8px; border-radius:100px; font-weight:500'>{comp}</span>" for comp in layer["components"])
        
        st.markdown(f"""
        <div style="background:#f5f5f7; border:1px solid var(--border-color); border-left:4px solid {color}; border-radius:12px; padding:16px 20px;">
            <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px; margin-bottom:8px">
                <div style="display:flex; align-items:center; gap:10px">
                    <span style="font-size:20px">{layer['icon']}</span>
                    <span style="font-size:11px; font-weight:700; color:{color}; letter-spacing:1.5px; text-transform:uppercase">{layer['name']}</span>
                    <span style="font-size:13px; font-weight:600; color:#1d1d1f">— {layer['title']}</span>
                </div>
                <div style="display:flex; gap:6px; flex-wrap:wrap">
                    {chips_html}
                </div>
            </div>
            <div style="font-size:12px; color:#86868b; line-height:1.5">{layer['desc']}</div>
        </div>
        """, unsafe_allow_html=True)
        
        # Render connector arrow except last
        if i < len(layers_config) - 1:
            st.markdown(f"""
            <div style="display:flex; justify-content:center; align-items:center; margin:-4px 0">
                <div style="width:1px; height:18px; border-left:1px dashed #d2d2d7"></div>
                <div style="font-size:9px; color:#86868b; margin-left:8px; font-weight:700; letter-spacing:1px">↑ DATA SYNC ↑</div>
                <div style="width:1px; height:18px; border-left:1px dashed #d2d2d7; margin-left:8px"></div>
            </div>
            """, unsafe_allow_html=True)

    st.markdown("</div></div>", unsafe_allow_html=True)
