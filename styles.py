"""
CSS Style Engine for Aegis — Apple.com Minimalist Design
Clean white background · SF Pro typography · Lots of whitespace · Zero noise
"""

def inject_css():
    import streamlit as st
    st.markdown("""
    <style>
    /* ── GOOGLE FONTS ── */
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

    /* ══════════════════════════════════════════════════════
       APPLE MINIMALIST DESIGN SYSTEM
       White · Clean · Breathing Room · Purposeful
    ══════════════════════════════════════════════════════ */
    :root {
        --bg:        #ffffff;
        --bg-soft:   #f5f5f7;
        --bg-card:   #ffffff;
        --border:    #d2d2d7;
        --border-color: #d2d2d7;
        --border-subtle: #e8e8ed;

        --text:      #1d1d1f;
        --text-primary: #1d1d1f;
        --text-secondary: #86868b;
        --text-tertiary: #86868b;
        --text-muted: #86868b;
        --text-2:    #424245;
        --text-3:    #86868b;
        --text-4:    #86868b;

        --blue:      #0071e3;
        --blue-soft: #0077ed;
        --blue-bg:   #f0f6ff;
        
        --accent-blue:      #0071e3;
        --accent-blue-dim:  rgba(0, 113, 227, 0.06);
        --accent-green:     #1d1d1f; /* Clean minimal, or green */
        --accent-green-dim: rgba(29, 29, 31, 0.05);
        --accent-purple:    #af52de;
        --accent-purple-dim: rgba(175, 82, 222, 0.06);
        --accent-cyan:      #0071e3;
        --accent-cyan-dim:  rgba(0, 113, 227, 0.06);

        --green:     #1d1d1f;
        --green-bg:  #f5f5f7;
        --red:       #ff3b30;
        --red-bg:    #fff2f2;
        --amber:     #ff9500;
        --amber-bg:  #fffaf0;

        --radius-lg: 20px;
        --radius-md: 12px;
        --radius-sm: 8px;
        --radius-pill: 980px;

        --shadow-xs: 0 1px 2px rgba(0,0,0,0.03);
        --shadow-sm: 0 4px 12px rgba(0,0,0,0.04);
        --shadow-md: 0 8px 30px rgba(0,0,0,0.06);
    }

    /* ── GLOBAL BASE OVERRIDES ── */
    html, body, [data-testid="stApp"] {
        background-color: var(--bg-soft) !important;
        color: var(--text) !important;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif !important;
        -webkit-font-smoothing: antialiased !important;
    }

    /* Override standard Streamlit backgrounds */
    [data-testid="stAppViewContainer"], [data-testid="stHeader"] {
        background-color: var(--bg-soft) !important;
    }

    .main .block-container {
        padding: 40px 48px 80px !important;
        max-width: 1280px !important;
        background: transparent !important;
    }

    /* ══════════════════════════════════════════════════════
       SIDEBAR — APPLE CLEAN WHITE NAV
    ══════════════════════════════════════════════════════ */
    [data-testid="stSidebar"] {
        background-color: var(--bg) !important;
        border-right: 1px solid var(--border-subtle) !important;
        box-shadow: none !important;
    }
    [data-testid="stSidebar"] > div {
        padding: 0 !important;
        background-color: var(--bg) !important;
    }

    /* Brand */
    .sidebar-brand {
        padding: 32px 24px 20px;
        display: flex;
        align-items: center;
        gap: 10px;
    }
    .brand-icon {
        font-size: 20px;
        color: var(--text-primary);
        font-weight: bold;
    }
    .brand-name {
        font-size: 19px;
        font-weight: 700;
        color: var(--text);
        letter-spacing: -0.5px;
        display: block;
    }
    .brand-sub {
        font-size: 11px;
        color: var(--text-secondary);
        display: block;
        margin-top: 1px;
        font-weight: 400;
        letter-spacing: -0.1px;
    }

    /* Nav buttons */
    [data-testid="stSidebar"] .stButton > button {
        background: transparent !important;
        color: var(--text-secondary) !important;
        border: none !important;
        text-align: left !important;
        font-size: 14px !important;
        font-weight: 500 !important;
        padding: 10px 24px !important;
        border-radius: 0 !important;
        transition: all 0.15s ease !important;
        margin: 0 !important;
        width: 100% !important;
        box-shadow: none !important;
        letter-spacing: -0.1px !important;
    }
    [data-testid="stSidebar"] .stButton > button:hover {
        color: var(--text-primary) !important;
        background: var(--bg-soft) !important;
        box-shadow: none !important;
    }
    [data-testid="stSidebar"] .stButton > button:focus {
        box-shadow: none !important;
        outline: none !important;
    }

    /* Sidebar misc */
    .sidebar-divider {
        height: 1px;
        background: var(--border-subtle);
        margin: 12px 0;
    }
    .sidebar-label {
        font-size: 10px !important;
        font-weight: 600 !important;
        letter-spacing: 0.8px !important;
        color: var(--text-secondary) !important;
        padding: 12px 24px 6px !important;
        margin: 0 !important;
        text-transform: uppercase !important;
        opacity: 0.6;
    }
    .sidebar-footer {
        padding: 24px;
        font-size: 11px;
        color: var(--text-secondary);
        line-height: 1.5;
        border-top: 1px solid var(--border-subtle);
        margin-top: 20px;
    }

    /* Active nav pill */
    .nav-active-pill {
        display: flex;
        align-items: center;
        padding: 10px 24px;
        font-size: 14px;
        font-weight: 600;
        color: var(--text-primary);
        background: var(--bg-soft);
        border-left: 3px solid var(--text-primary);
        cursor: pointer;
    }

    /* Status card */
    .status-card {
        margin: 12px 20px;
        padding: 12px 16px;
        border-radius: var(--radius-md);
        border: 1px solid var(--border-subtle);
        background: var(--bg-soft);
        display: flex;
        align-items: center;
        gap: 10px;
    }
    .status-title { font-size: 13px; font-weight: 600; color: var(--text-primary); }
    .status-sub   { font-size: 11px; color: var(--text-secondary); margin-top: 1px; }
    .status-dot {
        width: 6px; height: 6px; border-radius: 50%;
        background: #34c759; /* Apple Green */
        display: inline-block;
    }
    .status-dot.idle { background: #8e8e93; }

    /* Framework stages */
    .framework-stage {
        display: flex; align-items: center; gap: 10px;
        padding: 6px 24px; font-size: 13px;
        color: var(--text-secondary);
    }
    .framework-stage-name {
        font-weight: 500;
        font-size: 12px;
    }

    /* ══════════════════════════════════════════════════════
       PAGE HERO — MINIMAL WHITE HEADER
    ══════════════════════════════════════════════════════ */
    .page-hero {
        background: var(--bg);
        border: 1px solid var(--border-subtle);
        border-radius: var(--radius-lg);
        padding: 40px;
        margin-bottom: 32px;
        box-shadow: var(--shadow-sm);
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
    }
    .hero-badge {
        display: inline-block;
        font-size: 11px;
        font-weight: 600;
        color: var(--blue);
        letter-spacing: 0.5px;
        margin-bottom: 12px;
        text-transform: uppercase;
    }
    .hero-title {
        font-size: 32px;
        font-weight: 700;
        color: var(--text);
        letter-spacing: -0.8px;
        line-height: 1.15;
        margin-bottom: 8px;
    }
    .hero-sub {
        font-size: 15px;
        color: var(--text-secondary);
        font-weight: 400;
        line-height: 1.6;
        max-width: 680px;
    }

    /* ══════════════════════════════════════════════════════
       METRIC CARDS — CLEAN STORE TILES
    ══════════════════════════════════════════════════════ */
    .metric-card {
        background: var(--bg);
        border: 1px solid var(--border-subtle);
        border-radius: var(--radius-lg);
        padding: 24px 22px;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
        box-shadow: var(--shadow-xs);
        position: relative;
    }
    .metric-card:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow-sm);
    }
    .metric-label {
        font-size: 11px;
        font-weight: 600;
        color: var(--text-secondary);
        text-transform: uppercase;
        letter-spacing: 0.6px;
        margin-bottom: 8px;
    }
    .metric-value {
        font-size: 28px;
        font-weight: 700;
        color: var(--text-primary);
        letter-spacing: -0.6px;
        line-height: 1.1;
        margin-bottom: 6px;
    }
    .metric-delta {
        font-size: 11px;
        font-weight: 500;
    }
    .metric-delta.pos { color: #34c759; }
    .metric-delta.neg { color: #ff3b30; }
    .metric-icon {
        position: absolute; right: 18px; top: 18px;
        font-size: 18px; opacity: 0.45;
    }

    /* ══════════════════════════════════════════════════════
       CONTENT PANELS — STORE CATEGORY CARDS
    ══════════════════════════════════════════════════════ */
    .content-panel {
        background: var(--bg);
        border: 1px solid var(--border-subtle);
        border-radius: var(--radius-lg);
        padding: 32px;
        margin-bottom: 24px;
        box-shadow: var(--shadow-xs);
    }
    .panel-title {
        font-size: 18px;
        font-weight: 600;
        color: var(--text-primary);
        margin-bottom: 20px;
        display: flex;
        align-items: center;
        gap: 8px;
        letter-spacing: -0.3px;
    }

    /* Eyebrow */
    .section-eyebrow {
        font-size: 11px;
        font-weight: 600;
        letter-spacing: 1px;
        text-transform: uppercase;
        color: var(--text-secondary);
        margin-bottom: 16px;
        padding-left: 2px;
        opacity: 0.8;
    }

    /* ══════════════════════════════════════════════════════
       RISK ALERTS — Minimalist Clean
    ══════════════════════════════════════════════════════ */
    .risk-alert {
        display: flex; align-items: flex-start; gap: 12px;
        padding: 16px;
        border-radius: var(--radius-md);
        margin-bottom: 12px;
        background: #fff2f2;
        border: 1px solid rgba(255, 59, 48, 0.15);
    }
    .risk-alert.amber {
        background: #fffaf0;
        border-color: rgba(255, 149, 0, 0.15);
    }
    .risk-alert.green {
        background: #f5f5f7;
        border-color: var(--border-subtle);
    }
    .risk-severity {
        font-size: 10px; font-weight: 700; letter-spacing: 0.8px;
        text-transform: uppercase; margin-bottom: 4px;
    }
    .risk-severity.red    { color: #ff3b30; }
    .risk-severity.amber  { color: #ff9500; }
    .risk-severity.green  { color: var(--text-primary); }
    .risk-desc { font-size: 13px; color: var(--text-2); line-height: 1.5; }

    /* ══════════════════════════════════════════════════════
       RECOMMENDATION ITEMS
    ══════════════════════════════════════════════════════ */
    .rec-item {
        display: flex; align-items: flex-start; gap: 14px;
        padding: 16px;
        border-radius: var(--radius-md);
        margin-bottom: 10px;
        background: var(--bg-soft);
        border: 1px solid var(--border-subtle);
        transition: border-color 0.15s, background 0.15s;
    }
    .rec-item:hover {
        border-color: var(--text-primary);
        background: #ffffff;
    }
    .rec-num {
        width: 22px; height: 22px; border-radius: 50%;
        background: var(--text-primary); color: white;
        font-size: 11px; font-weight: 600;
        display: flex; align-items: center; justify-content: center;
        flex-shrink: 0; margin-top: 1px;
    }
    .rec-text { font-size: 13.5px; color: var(--text-2); line-height: 1.6; }

    /* ══════════════════════════════════════════════════════
       FLOW NODES — CLEAN TILES
    ══════════════════════════════════════════════════════ */
    .flow-node {
        background: var(--bg);
        border: 1px solid var(--border-subtle);
        border-radius: var(--radius-md);
        padding: 20px 16px;
        text-align: center;
        transition: border-color 0.2s, box-shadow 0.2s;
        box-shadow: var(--shadow-xs);
    }
    .flow-node:hover {
        border-color: var(--blue);
        box-shadow: var(--shadow-sm);
    }
    .flow-node-icon  { font-size: 24px; margin-bottom: 8px; }
    .flow-node-label { font-size: 13px; font-weight: 600; color: var(--text-primary); }
    .flow-node-sub   { font-size: 11.5px; color: var(--text-secondary); margin-top: 6px; line-height: 1.45; }

    /* ══════════════════════════════════════════════════════
       LOG TIMELINE
    ══════════════════════════════════════════════════════ */
    .log-entry {
        display: flex; align-items: flex-start; gap: 12px;
        padding: 12px 0;
        border-bottom: 1px solid var(--border-subtle);
    }
    .log-time {
        font-family: SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        font-size: 11px; color: var(--text-secondary);
        min-width: 60px; padding-top: 2px;
        opacity: 0.7;
    }
    .log-dot {
        width: 6px; height: 6px; border-radius: 50%;
        margin-top: 7px; flex-shrink: 0;
    }
    .log-msg { font-size: 13.5px; color: var(--text-2); line-height: 1.5; }
    .log-msg strong { color: var(--text-primary); font-weight: 600; }

    /* ══════════════════════════════════════════════════════
       FORM INPUTS — APPLE CLEAN STYLE
    ══════════════════════════════════════════════════════ */
    div[data-baseweb="input"] {
        background-color: var(--bg) !important;
        border: 1px solid var(--border) !important;
        border-radius: var(--radius-sm) !important;
    }
    input, textarea {
        background-color: var(--bg) !important;
        color: var(--text-primary) !important;
        font-family: inherit !important;
    }
    
    /* ══════════════════════════════════════════════════════
       BUTTONS — APPLE CLEAN
    ══════════════════════════════════════════════════════ */
    .stButton > button {
        background: var(--blue) !important;
        color: white !important;
        border: none !important;
        border-radius: var(--radius-pill) !important;
        font-weight: 500 !important;
        font-family: inherit !important;
        font-size: 14px !important;
        padding: 8px 20px !important;
        transition: background 0.15s ease !important;
        letter-spacing: -0.1px !important;
        box-shadow: none !important;
    }
    .stButton > button:hover {
        background: var(--blue-soft) !important;
        transform: none !important;
        box-shadow: none !important;
    }

    /* ══════════════════════════════════════════════════════
       TABS — MINIMAL UNDERLINE (Apple design)
    ══════════════════════════════════════════════════════ */
    [data-testid="stTabs"] [data-baseweb="tab-list"] {
        background-color: transparent !important;
        border-bottom: 1px solid var(--border-subtle) !important;
        gap: 20px !important;
        padding: 0 4px !important;
    }
    [data-testid="stTabs"] [data-baseweb="tab"] {
        color: var(--text-secondary) !important;
        font-family: inherit !important;
        font-weight: 500 !important;
        font-size: 14px !important;
        padding: 12px 8px !important;
        background: transparent !important;
        border-bottom: 2px solid transparent !important;
    }
    [data-testid="stTabs"] [aria-selected="true"] {
        color: var(--text-primary) !important;
        border-bottom: 2px solid var(--text-primary) !important;
    }

    /* Expander override */
    [data-testid="stExpander"] {
        border: 1px solid var(--border-subtle) !important;
        background-color: var(--bg) !important;
        border-radius: var(--radius-md) !important;
        box-shadow: none !important;
    }
    
    </style>
    """, unsafe_allow_html=True)
