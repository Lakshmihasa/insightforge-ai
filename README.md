# ⚡ InsightForge AI

https://insightforge-ai-ochre.vercel.app/

> **AI-powered dataset analytics platform** — upload a CSV, get instant statistics, quality scores, visualizations, and natural language insights.

<div align="center">

![InsightForge AI](https://img.shields.io/badge/InsightForge-AI-6366f1?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0id2hpdGUiIGQ9Ik0xMyAyTDMgMTRoOWwtMSA4IDEwLTEyaC05bDEtOHoiLz48L3N2Zz4=)
![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![FastAPI](https://img.shields.io/badge/FastAPI-0.110-009688?style=for-the-badge&logo=fastapi)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=for-the-badge&logo=postgresql)
![Python](https://img.shields.io/badge/Python-3.11-3776AB?style=for-the-badge&logo=python)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-Visit_App-22d3ee?style=for-the-badge)](https://insightforge-45e6dxux6-lakshmi-hasa-s-projects.vercel.app/)
[![Backend](https://img.shields.io/badge/⚙️_Backend-Railway-6366f1?style=for-the-badge)](https://your-railway-url.up.railway.app/docs)

</div>

---

## 🎯 What is InsightForge AI?

InsightForge AI turns raw CSV files into **instant, actionable intelligence** — no data science background required. Upload a dataset and get a full analytics suite in seconds.

```
Upload CSV  →  Statistics  →  Quality Score  →  Charts  →  AI Insights  →  Report
```

Built as a **full-stack portfolio project** demonstrating production-grade architecture across a modern Python + TypeScript stack.

---

## ✨ Features

| Feature | Description |
|---|---|
| 📤 **CSV Upload** | Drag & drop or click to upload any CSV dataset |
| 📊 **Statistics** | Mean, median, min, max, std deviation per column |
| 🏆 **Quality Score** | Automated data quality scoring with missing value detection |
| 📈 **Chart Generation** | Auto-generates distribution charts using matplotlib |
| 🔍 **Insights Engine** | Pandas-powered natural language insights (InsightCore) |
| 💬 **Ask Your Data** | Natural language Q&A interface over your dataset |
| 📝 **Report Download** | One-click `.txt` report export with full analysis |
| 🔎 **Dataset Search** | Real-time search across all uploaded datasets |

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** — App Router, TypeScript
- **Tailwind CSS** — Utility-first styling
- **Axios** — HTTP client with base URL configuration
- **Syne + JetBrains Mono** — Typography system

### Backend
- **FastAPI** — High-performance async Python API
- **SQLAlchemy** — ORM with PostgreSQL
- **Pandas** — Data analysis and statistics engine
- **Matplotlib** — Chart generation
- **Pydantic** — Request/response validation

### Infrastructure
- **Vercel** — Frontend deployment (CI/CD on push)
- **Render** — Backend + PostgreSQL hosting
- **PostgreSQL** — Persistent dataset metadata storage

---

## 🚀 Getting Started

### Prerequisites
```bash
node >= 18
python >= 3.11
postgresql >= 14
```

### 1. Clone the repo
```bash
git clone https://github.com/Lakshmihasa/insightforge-ai.git
cd insightforge-ai
```

### 2. Backend setup
```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Create `.env`:
```env
DATABASE_URL=postgresql://user:Hasa@22062003@localhost:5432/insightforge
```

Run migrations and start:
```bash
alembic upgrade head
uvicorn src.main:app --reload
```

API docs available at: `http://localhost:8000/docs`

### 3. Frontend setup
```bash
cd frontend
npm install
```

Create `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

Start dev server:
```bash
npm run dev
```

App runs at: `http://localhost:3000`

---

## 📡 API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/datasets/upload` | Upload a CSV file |
| `GET`  | `/datasets/` | List all datasets |
| `GET`  | `/datasets/{id}/summary` | Filename, rows, columns, column names |
| `GET`  | `/datasets/{id}/statistics` | Mean, median, min, max, std per column |
| `GET`  | `/datasets/{id}/quality` | Missing cells + quality score % |
| `GET`  | `/datasets/{id}/chart` | Auto-generated distribution chart (PNG) |
| `GET`  | `/datasets/{id}/insights` | Natural language insights via InsightCore |
| `POST` | `/datasets/{id}/ask` | Ask a question about the dataset |
| `GET`  | `/datasets/{id}/report` | Download full analysis report (.txt) |

Full interactive docs: `/docs` (Swagger UI)

---

## 🗂️ Project Structure

```
insightforge-ai/
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   └── page.tsx          # Main UI
│   │   └── services/
│   │       └── api.ts            # Axios instance
│   └── package.json
│
└── backend/
    └── src/
        ├── api/
        │   └── dataset.py        # All dataset endpoints
        ├── models/
        │   └── dataset.py        # SQLAlchemy model
        ├── schemas/
        │   └── question_schema.py
        ├── database/
        │   └── session.py        # DB connection
        └── main.py               # FastAPI app entry
```

---

## 🧠 InsightCore Engine

InsightCore is the analytics engine powering InsightForge AI. It runs entirely on **pandas** — no external AI API required — generating human-readable insights from statistical patterns:

```python
# Example output
"Age: average is 34.2"
"Dataset contains no missing values."
"Salary: minimum is 28000, maximum is 142000"
"Large dataset detected — 10,000+ records."
```

This approach ensures:
- ✅ Zero API costs
- ✅ Instant response times
- ✅ Works fully offline
- ✅ No rate limits

---

## 📸 Screenshots

> Upload a CSV → instant analytics dashboard
>
> | UI of InsightForge AI |
>
> | <img width="1841" height="712" alt="Screenshot 2026-06-07 100859" src="https://github.com/user-attachments/assets/be66425d-1b7b-4aa0-8b5a-44659f9fd59e" />

| Upload & Search |

<img width="427" height="458" alt="image" src="https://github.com/user-attachments/assets/e8632209-644f-4654-9bda-9010eb493970" />

| Statistics Cards |

 | <img width="646" height="412" alt="image" src="https://github.com/user-attachments/assets/4cf2173a-43f7-499b-9a0a-318ad587fb24" />
 
 | Quality Score |
 
 | <img width="1727" height="413" alt="image" src="https://github.com/user-attachments/assets/69fef896-2b24-449c-8fd5-516e1945bef9" />
 

---


## 🤝 Contributing

Pull requests are welcome. For major changes, open an issue first.

```bash
git checkout -b feature/your-feature
git commit -m "feat: your feature"
git push origin feature/your-feature
```

---

## 📄 License

MIT © 2025 — Built with precision by [Lakshmi Hasa](https://github.com/Lakshmihasa)

---

<div align="center">

**FastAPI · PostgreSQL · Next.js · InsightCore · Vercel · Render**

*If this helped you, consider giving it a ⭐*

</div>
