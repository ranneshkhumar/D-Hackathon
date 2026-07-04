# ⚡ Aegis — AI-Powered Business Growth Operating System

> **Not a CRM. Not a chatbot.** An autonomous multi-agent AI business intelligence platform powered by the **5D Framework**: Discover · Design · Deliver · Develop · Dominate.

---

## 🚀 Live Demo

Open the React app locally:
```bash
cd aegis-react
npm install
npm run dev
# → http://localhost:5173
```

---

## 🏗️ Architecture

Aegis runs **5 autonomous AI agents** sequentially to generate a complete business growth strategy from raw company data:

| Agent | Role | Output |
|-------|------|--------|
| 👔 CEO Agent | Chief Intelligence Officer | Health Score, Mandate, Executive Summary |
| 🧭 Strategy Agent | Chief Strategy Architect | Growth Pillars, KPIs, Market Positioning |
| 📣 Marketing Agent | Chief Growth Marketer | Ad Copy, Email Funnels, Content Calendar |
| 🎯 Sales Agent | Chief Revenue Officer | Pipeline Stages, Outbound Sequences, Lead Scoring |
| 💹 Finance Agent | Chief Financial Intelligence Officer | Risk Alerts, Cash Flow, Unit Economics |

---

## 📁 Project Structure

```
agri hack/
├── aegis-react/            ← React + Vite frontend (primary app)
│   ├── src/
│   │   ├── engine/agents.js        ← All 5 agent classes (JS port)
│   │   ├── context/AegisContext.jsx ← Global state management
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx       ← Executive Dashboard
│   │   │   ├── Discovery.jsx       ← Business Onboarding
│   │   │   ├── Boardroom.jsx       ← Agent Boardroom
│   │   │   └── Architecture.jsx    ← System Architecture
│   │   ├── components/Sidebar.jsx
│   │   └── index.css               ← Apple-style design system
│   └── package.json
│
├── app.py                  ← Original Streamlit app
├── agents.py               ← Python agent engine
├── pages/                  ← Streamlit page modules
│   ├── dashboard.py
│   ├── discovery.py
│   ├── boardroom.py
│   └── architecture.py
├── styles.py
├── data_engine.py
└── requirements.txt
```

---

## 🛠️ Tech Stack

**React App (Primary)**
- React 18 + Vite
- React Router v6
- Recharts (Revenue, Radar, Funnel, Cash Flow charts)
- Vanilla CSS — Apple-style minimalist design system

**Original Python App**
- Streamlit
- Plotly
- Python 3.10+

---

## 🧠 5D Framework

| Phase | Description |
|-------|-------------|
| **Discover** | Business context ingestion & vertical intelligence extraction |
| **Design** | Strategy formation, 12-month roadmap & KPI architecture |
| **Deliver** | Campaign assets, sales scripts & multi-channel mix |
| **Develop** | Financial modeling, risk analysis & feedback loops |
| **Dominate** | Category leadership positioning & continuous optimization |

---

## ⚡ Quick Start (React)

```bash
cd aegis-react
npm install
npm run dev
```

## 🐍 Quick Start (Streamlit)

```bash
pip install -r requirements.txt
streamlit run app.py
```

---

*Built for the Hackathon — Aegis demonstrates an autonomous multi-agent business growth OS. All agent simulations run client-side in JavaScript — no external API calls required.*
