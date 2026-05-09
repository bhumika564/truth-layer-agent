# 🔍 Truth Layer Agent — AI-Powered Fact-Checking System

<div align="center">

![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-2.x-000000?style=for-the-badge&logo=flask&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Gemini](https://img.shields.io/badge/Gemini_2.5_Flash-AI-4285F4?style=for-the-badge&logo=google&logoColor=white)
![Tavily](https://img.shields.io/badge/Tavily-Web_Search-FF6B35?style=for-the-badge)

**Upload any PDF → AI extracts claims → Live web verification → Instant fact-check report**

[Live Demo](https://truth-layer-agent.vercel.app) · [Backend API](https://truth-layer-agent.onrender.com) · [Report Bug](https://github.com/bhumika564/truth-layer-agent/issues) · [API Docs](#-api-endpoints)

</div>

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [System Architecture](#-system-architecture)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [API Endpoints](#-api-endpoints)
- [How It Works](#-how-it-works)
- [Results & Demo](#-results--demo)
- [Assignment Context](#-assignment-context)

---

## 🧠 Overview

**Truth Layer Agent** is a two-phase AI fact-checking system built for the Product Management Trainee assessment. It automatically:

1. **Extracts** all verifiable claims (stats, dates, financial figures, technical data) from any uploaded PDF
2. **Verifies** each claim against live web sources using AI-powered search
3. **Reports** each claim as `✅ Verified`, `⚠️ Inaccurate`, or `❌ False` — with confidence scores and reasoning

---

## ✨ Features

| Feature | Description |
|---|---|
| 📄 **PDF Parsing** | Extracts raw text from any PDF using PyMuPDF |
| 🤖 **AI Claim Extraction** | Gemini 2.5 Flash identifies stats, dates, figures, financial data |
| 🌐 **Live Web Verification** | Tavily Search API fetches real-time sources for each claim |
| ⚡ **Parallel Processing** | All claims verified simultaneously via ThreadPoolExecutor |
| 📊 **Confidence Scoring** | Each result includes a confidence percentage |
| 🎨 **React Dashboard** | Professional dark-theme UI with analytics view |
| 🔒 **Error Handling** | Graceful fallbacks for API failures and malformed responses |

---

## 🏗 System Architecture

```
┌─────────────────┐         ┌──────────────────────────────────────┐
│  Next.js UI     │──POST──▶│         Flask Backend (app.py)       │
│ (Glassmorphism) │         │                                      │
└─────────────────┘         │  1. PyMuPDF → Extract PDF text       │
                             │  2. Gemini 2.5 → Extract all claims  │
         ┌───────────────────│  3. Tavily → High-speed Web Search   │
         │                   │  4. Gemini 2.5 → Batch Verification  │
         ▼                   │     (Evaluates all claims in 1 call) │
  ┌─────────────┐            │  5. Return structured JSON report    │
  │  JSON Report │◀──────────│     (Verified/Inaccurate/False)      │
  └─────────────┘            └──────────────────────────────────────┘
```

---

## 🛠 Tech Stack

**Backend**
- `Python 3.10+` — core language
- `Flask` — REST API server
- `Flask-CORS` — cross-origin requests
- `PyMuPDF (fitz)` — PDF text extraction
- `google-generativeai` — Gemini 2.5 Flash for NLP
- `tavily-python` — live web search & fact retrieval
- `concurrent.futures` — parallel claim verification

**Frontend**
- `Next.js 15 (App Router)` — core framework
- `Tailwind CSS` — for premium Glassmorphism styling
- `Lucide React` — for sleek iconography
- Dark theme dashboard with live status cards and confidence scores

---

## 🚀 Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+ (for frontend)
- Gemini API Key → [Get here](https://aistudio.google.com/app/apikey)
- Tavily API Key → [Get here](https://tavily.com)

### 1. Clone the Repository

```bash
git clone https://github.com/bhumika564/truth-layer-agent.git
cd truth-layer-agent
```

### 2. Backend Setup

```bash
cd backend
python -m venv venv

# Windows
.\venv\Scripts\activate

# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
```

### 3. Environment Variables

Create a `.env` file inside the `backend/` folder:

```env
GEMINI_API_KEY=your_gemini_api_key_here
TAVILY_API_KEY=your_tavily_api_key_here
```

### 4. Run the Backend

```bash
python app.py
# Server starts at http://127.0.0.1:5000
```

### 5. Run the Frontend

```bash
cd ../frontend
npm install
npm run dev
# Opens at http://localhost:3000
```

---

## 📁 Project Structure

```
truth-layer-agent/
│
├── backend/
│   ├── app.py                  # Main Flask application
│   ├── test_api.py             # API testing script
│   ├── test_gemini.py          # Gemini connection test
│   ├── dummy.pdf               # Sample PDF for testing
│   ├── trap_document.pdf       # Intentional false-claims PDF for demo
│   ├── requirements.txt        # Python dependencies
│   └── .env                    # API keys (not committed to Git)
│
├── frontend/
│   ├── src/
│   │   └── app/
│   │       ├── layout.tsx      # Next.js Root Layout
│   │       ├── page.tsx        # Main Dashboard UI & Logic
│   │       └── globals.css     # Tailwind & Custom Styles
│   ├── tailwind.config.ts
│   └── package.json
│
└── README.md
```

---

## 📡 API Endpoints

### `GET /health`
Check if the backend is running.

```json
{ "status": "Fact-Check Agent backend is live!" }
```

### `POST /fact-check`
Upload a PDF and receive a full fact-check report.

**Request:** `multipart/form-data` with key `file`

**Response:**
```json
{
  "status": "success",
  "extracted_claims": [...],
  "verified_report": [
    {
      "claim": "Apple's revenue in 2024 was $500 billion.",
      "status": "False",
      "reason": "Apple's FY2023 revenue was approximately $383 billion, not $500 billion.",
      "confidence": 94
    }
  ]
}
```

**Status values:**
| Status | Meaning |
|---|---|
| `Verified` | Claim matches live web sources |
| `Inaccurate` | Claim is partially correct but contains errors |
| `False` | Claim is directly contradicted by sources |

---

## ⚙️ How It Works

### Phase 1 — Claim Extraction
```
PDF Upload → PyMuPDF extracts raw text → Gemini 2.5 Flash reads text →
Returns JSON array of specific, verifiable claims (max 10)
```

### Phase 2 — Fast Batch Verification
```
Instead of sequential or heavy parallel processing (which triggers API rate limits), the system uses an optimized Batch Processing architecture:
  → Tavily instantly searches the live web for all extracted claims.
  → All contexts are compiled and sent to Gemini in a SINGLE batch prompt.
  → Gemini analyzes the full batch and returns a complete JSON report.
All results assembled → JSON report returned to frontend
```

**Why Batching?** It drops the verification time from ~80s to under 10s and uses only 1 API call per document, making the system highly scalable and cost-effective.

---

## 📊 Results & Demo

Sample output from `trap_document.pdf` (intentionally mixed true/false claims):

| Claim | Result | Confidence |
|---|---|---|
| ChatGPT reached 100M users in 2 months | ✅ Verified | 96% |
| Microsoft acquired Activision for $68.7B | ✅ Verified | 95% |
| Apple revenue was $500B in FY2023 | ❌ False | 94% |
| Global obesity rate is 65% | ❌ False | 93% |
| Google was founded in 1996 | ⚠️ Inaccurate | 91% |
| AI market was $1.3T in 2023 | ⚠️ Inaccurate | 89% |

---

## 📋 Assignment Context

This project was built as part of the **Product Management Trainee Assessment** for GEO (Generative Engine Optimization).

**Part 1** — Product Strategy (PPT): Feature design, competitive analysis, and monetization roadmap for a GEO analytics product.

**Part 2** — AI Engineering: This fact-checking agent — demonstrating ability to scope, build, and ship an AI-powered product end-to-end.

**Evaluation criteria met:**
- [x] Claims extraction from PDF
- [x] Live web verification (not static database)
- [x] Verified / Inaccurate / False classification
- [x] Confidence scoring
- [x] React frontend with analytics dashboard
- [x] Parallel processing for performance
- [x] Clean code with error handling
- [x] GitHub repository with README and requirements.txt

---

## 📦 requirements.txt

```
flask==3.0.3
flask-cors==4.0.1
pymupdf==1.24.5
google-generativeai==0.7.2
tavily-python==0.3.3
python-dotenv==1.0.1
requests==2.32.3
```

---

<div align="center">

Built with ❤️ by Bhumika Sharma

</div>
