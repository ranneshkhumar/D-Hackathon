"""
Aegis: AI-Powered Business Growth Operating System
Multi-Agent Business Strategy Platform | 5D Framework
NOT a basic CRM or chatbot — autonomous, multi-agent business intelligence OS.
"""

import streamlit as st
import time
import random
import json
import pandas as pd
import numpy as np
import plotly.graph_objects as go
import plotly.express as px
from datetime import datetime, timedelta
from agents import (
    AgentOrchestrator,
    CEO_Agent,
    Strategy_Agent,
    Marketing_Agent,
    Sales_Agent,
    Finance_Agent,
)
from data_engine import DataEngine
from styles import inject_css

# ─────────────────────────────────────────────
# PAGE CONFIG
# ─────────────────────────────────────────────
st.set_page_config(
    page_title="Aegis | AI Business Growth OS",
    page_icon="⚡",
    layout="wide",
    initial_sidebar_state="expanded",
)

inject_css()

# ─────────────────────────────────────────────
# SESSION STATE INITIALIZATION
# ─────────────────────────────────────────────
def init_session():
    if "onboarded" not in st.session_state:
        # Pre-onboard standard default data so the dashboard is live immediately!
        company_name = "Aura Wellness"
        industry = "Technology"
        annual_revenue = 1200000
        target_audience = "Mid-market B2B SaaS"
        primary_goal = "Increase Revenue & ARR"
        team_size = "1–10 (Startup)"
        doc_text = """COMPANY OVERVIEW
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
Our differentiator: AI-native, deep integrations, 10x faster setup."""

        business_data = {
            "company_name": company_name,
            "industry": industry,
            "annual_revenue": annual_revenue,
            "target_audience": target_audience,
            "primary_goal": primary_goal,
            "team_size": team_size,
            "doc_text": doc_text,
        }

        # Run agent orchestration synchronously on startup
        from agents import AgentOrchestrator
        orchestrator = AgentOrchestrator(business_data)
        agent_outputs, agent_log = orchestrator.run_all(fast=True)

        st.session_state["business_data"] = business_data
        st.session_state["agent_outputs"] = agent_outputs
        st.session_state["agent_log"] = agent_log
        st.session_state["onboarded"] = True
        st.session_state["run_complete"] = True
        st.session_state["page"] = "🏢 Executive Dashboard"
        st.session_state["chat_history"] = []

init_session()

# ─────────────────────────────────────────────
# SPATIAL SIDEBAR
# ─────────────────────────────────────────────
with st.sidebar:
    # Brand
    st.markdown("""
    <div class="sidebar-brand">
        <div class="brand-icon">⚡</div>
        <div class="brand-text">
            <span class="brand-name">AEGIS</span>
            <span class="brand-sub">AI Business Growth OS</span>
        </div>
    </div>
    """, unsafe_allow_html=True)

    st.markdown('<div class="sidebar-divider"></div>', unsafe_allow_html=True)
    st.markdown('<p class="sidebar-label">Navigation</p>', unsafe_allow_html=True)

    # Nav pages with icons
    pages = [
        ("🏢 Executive Dashboard",   "Dominate"),
        ("🚀 Discovery & Onboarding", "Discover"),
        ("🧠 Agent Boardroom",         "Design · Deliver"),
        ("📊 Architecture & Flows",    "Blueprint"),
    ]

    current_page_key = st.session_state.page

    for page_name, phase in pages:
        is_active = current_page_key == page_name
        if is_active:
            st.markdown(f"""
            <div class="nav-active-pill">
                <span>{page_name}</span>
                <span style="margin-left:auto;font-size:9px;color:var(--blue);
                    background:var(--blue-bg);padding:2px 8px;
                    border-radius:100px;font-weight:600">{phase}</span>
            </div>
            """, unsafe_allow_html=True)
        else:
            if st.button(page_name, key=f"nav_{page_name}", use_container_width=True):
                st.session_state.page = page_name
                st.rerun()

    st.markdown('<div class="sidebar-divider"></div>', unsafe_allow_html=True)

    # Business status
    if st.session_state.onboarded:
        biz = st.session_state.business_data.get("company_name", "Unknown")
        industry = st.session_state.business_data.get("industry", "")
        st.markdown(f"""
        <div class="status-card active">
            <div class="status-dot"></div>
            <div>
                <div class="status-title">{biz}</div>
                <div class="status-sub">{industry} · ACTIVE</div>
            </div>
        </div>
        """, unsafe_allow_html=True)
    else:
        st.markdown("""
        <div class="status-card idle">
            <div class="status-dot idle"></div>
            <div>
                <div class="status-title">No Business Loaded</div>
                <div class="status-sub">Run Discovery to begin</div>
            </div>
        </div>
        """, unsafe_allow_html=True)

    st.markdown('<div class="sidebar-divider"></div>', unsafe_allow_html=True)
    st.markdown('<p class="sidebar-label">5D Framework</p>', unsafe_allow_html=True)

    framework_stages = [
        ("Discover",  st.session_state.onboarded),
        ("Design",    st.session_state.run_complete),
        ("Deliver",   st.session_state.run_complete),
        ("Develop",   False),
        ("Dominate",  False),
    ]
    for stage, done in framework_stages:
        icon = "●" if done else "○"
        color = "#34c759" if done else "#8e8e93"
        font_weight = "600" if done else "400"
        text_color = "var(--text-primary)" if done else "var(--text-secondary)"
        st.markdown(f"""
        <div class="framework-stage">
            <span style="color:{color};font-size:8px">{icon}</span>
            <span style="color:{text_color}; font-weight:{font_weight}; font-size:12px">{stage}</span>
            {'<span style="margin-left:auto;font-size:10px;color:#34c759;font-weight:bold">✓</span>' if done else ''}
        </div>
        """, unsafe_allow_html=True)

    st.markdown('<div class="sidebar-divider"></div>', unsafe_allow_html=True)

    # AI Copilot
    with st.expander("🤖 AI Copilot", expanded=False):
        st.markdown('<p style="color:var(--text-secondary);font-size:11px;margin-bottom:8px">Ask your business strategy AI</p>', unsafe_allow_html=True)
        copilot_input = st.text_input("", placeholder="How to reduce CAC?", key="copilot_q", label_visibility="collapsed")
        if st.button("Ask Copilot", use_container_width=True, key="copilot_btn"):
            if copilot_input:
                response = DataEngine.get_copilot_response(copilot_input, st.session_state.business_data)
                st.session_state.chat_history.append({"q": copilot_input, "a": response})
        for chat in st.session_state.chat_history[-3:]:
            st.markdown(f'<div style="font-size:11px;color:var(--text-secondary);margin-top:8px"><b>You:</b> {chat["q"]}</div>', unsafe_allow_html=True)
            st.markdown(f'<div style="font-size:11px;color:var(--text-primary);margin-top:4px"><b>Aegis:</b> {chat["a"]}</div>', unsafe_allow_html=True)
            st.markdown('<div style="height:8px"></div>', unsafe_allow_html=True)

    st.markdown("""
    <div class="sidebar-footer">
        NOT a CRM &nbsp;·&nbsp; NOT a chatbot<br>
        <span style="color:var(--text-primary);opacity:0.8;font-weight:600">Autonomous Multi-Agent OS</span>
    </div>
    """, unsafe_allow_html=True)

# ─────────────────────────────────────────────
# PAGE ROUTING
# ─────────────────────────────────────────────
current_page = st.session_state.page

if current_page == "🏢 Executive Dashboard":
    from pages.dashboard import render_dashboard
    render_dashboard()

elif current_page == "🚀 Discovery & Onboarding":
    from pages.discovery import render_discovery
    render_discovery()

elif current_page == "🧠 Agent Boardroom":
    from pages.boardroom import render_boardroom
    render_boardroom()

elif current_page == "📊 Architecture & Flows":
    from pages.architecture import render_architecture
    render_architecture()
# Refreshed for minimalist UI migration
# Updated technical architecture blueprint layout


