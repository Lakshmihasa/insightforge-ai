⚡ InsightForge AI
https://insightforge-45e6dxux6-lakshmi-hasa-s-projects.vercel.app/


AI-powered dataset analytics platform — upload a CSV, get instant statistics, quality scores, visualizations, and natural language insights.

<img width="1841" height="712" alt="image" src="https://github.com/user-attachments/assets/6e7fc543-75ab-4af7-94ca-0decddab00c1" />
<img width="1847" height="797" alt="image" src="https://github.com/user-attachments/assets/be3ef0eb-552a-4504-a0bc-21ce9153436d" />



🎯 What is InsightForge AI?

InsightForge AI turns raw CSV files into instant, actionable intelligence — no data science background required. Upload a dataset and get a full analytics suite in seconds.

Upload CSV  →  Statistics  →  Quality Score  →  Charts  →  AI Insights  →  Report
Built as a full-stack portfolio project demonstrating production-grade architecture across a modern Python + TypeScript stack.

✨ Features

FeatureDescription📤 CSV UploadDrag & drop or click to upload any CSV dataset📊 StatisticsMean, median, min, max, std deviation per column🏆 Quality ScoreAutomated data quality scoring with missing value detection📈 Chart GenerationAuto-generates distribution charts using matplotlib🔍 Insights EnginePandas-powered natural language insights (InsightCore)💬 Ask Your DataNatural language Q&A interface over your dataset📝 Report DownloadOne-click .txt report export with full analysis🔎 Dataset SearchReal-time search across all uploaded datasets

🛠️ Tech Stack
Frontend

Next.js 15 — App Router, TypeScript
Tailwind CSS — Utility-first styling
Axios — HTTP client with base URL configuration
Syne + JetBrains Mono — Typography system

Backend

FastAPI — High-performance async Python API
SQLAlchemy — ORM with PostgreSQL
Pandas — Data analysis and statistics engine
Matplotlib — Chart generation
Pydantic — Request/response validation

Infrastructure

Vercel — Frontend deployment (CI/CD on push)
Railway — Backend + PostgreSQL hosting
PostgreSQL — Persistent dataset metadata storage


🚀 Getting Started

Prerequisites
bashnode >= 18
python >= 3.11
postgresql >= 14

1. Clone the repo
bashgit clone https://github.com/your-username/insightforge-ai.git
cd insightforge-ai

3. Backend setup
bashcd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
Create .env:
envDATABASE_URL=postgresql://user:password@localhost:5432/insightforge
Run migrations and start:
bashalembic upgrade head
uvicorn src.main:app --reload
API docs available at: http://localhost:8000/docs

5. Frontend setup
bashcd frontend
npm install
Create .env.local:
envNEXT_PUBLIC_API_URL=http://127.0.0.1:8000
Start dev server:
bashnpm run dev
App runs at: http://localhost:3000

📡 API Reference

MethodEndpointDescriptionPOST/datasets/uploadUpload a CSV fileGET/datasets/List all datasetsGET/datasets/{id}/summaryFilename, rows, columns, column namesGET/datasets/{id}/statisticsMean, median, min, max, std per columnGET/datasets/{id}/qualityMissing cells + quality score %GET/datasets/{id}/chartAuto-generated distribution chart (PNG)GET/datasets/{id}/insightsNatural language insights via InsightCorePOST/datasets/{id}/askAsk a question about the datasetGET/datasets/{id}/reportDownload full analysis report (.txt)
Full interactive docs: /docs (Swagger UI)

🗂️ Project Structure

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

🧠 InsightCore Engine

InsightCore is the analytics engine powering InsightForge AI. It runs entirely on pandas — no external AI API required — generating human-readable insights from statistical patterns:

python# Example output
"Age: average is 34.2"
"Dataset contains no missing values."
"Salary: minimum is 28000, maximum is 142000"
"Large dataset detected — 10,000+ records."

This approach ensures:

✅ Zero API costs
✅ Instant response times
✅ Works fully offline
✅ No rate limits


Upload a CSV → instant analytics dashboard

Upload & SearchStatistics CardsQuality Score(screenshot)(screenshot)(screenshot)

🌐 Deployment

Frontend → Vercel

link : https://insightforge-45e6dxux6-lakshmi-hasa-s-projects.vercel.app/

🤝 Contributing

Pull requests are welcome. For major changes, open an issue first.
bashgit checkout -b feature/your-feature
git commit -m "feat: your feature"
git push origin feature/your-feature

📄 License

MIT © 2025 — Built with precision by Your Name

<div align="center">
    
FastAPI · PostgreSQL · Next.js · InsightCore · Vercel · Railway
If this helped you, consider giving it a ⭐

</div>
