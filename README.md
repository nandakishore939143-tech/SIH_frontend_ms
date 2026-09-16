# SatQuery AI

**Earth Insights. Beyond Boundaries.**

---

## Overview

SatQuery AI is an AI-powered satellite imagery analysis platform that allows users to ask natural-language questions about satellite imagery and receive structured, AI-generated insights. Upload any satellite image, type your question, and SatQuery AI will analyse features like buildings, water bodies, vegetation, land-use changes, and damage assessment.

---

## Features

- 🛰️ **Natural-language satellite queries** — Ask questions in plain English about what's in the image
- 🖼️ **Satellite image upload** — Upload your own satellite or aerial imagery
- 📂 **Drag-and-drop image upload** — Intuitive drag-and-drop file upload interface
- 🔄 **Two-image comparison** — Compare before/after imagery for change detection
- 🤖 **AI analysis interface** — Real-time AI processing with confidence scores
- 📊 **Analysis results** — Structured results with detected features and findings
- 💡 **AI insights** — Contextual insights derived from the analysis
- ❓ **Follow-up questions** — Ask follow-up questions about your analysis results
- 📜 **Analysis history** — Browse and revisit past analysis sessions (stored locally)
- 🧭 **Use cases** — Explore example use cases and guided queries
- 🔍 **Search** — Search across datasets and history
- 🔔 **Notifications** — In-app notification system
- 🌍 **Interactive 3D space experience** — Immersive Three.js globe and satellite visualisation
- ⚙️ **Settings** — Configurable model and analysis options

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [React 19](https://react.dev/) |
| Build Tool | [Vite](https://vitejs.dev/) |
| Language | JavaScript (ES Modules) |
| Routing | [React Router DOM v7](https://reactrouter.com/) |
| 3D / WebGL | [Three.js](https://threejs.org/) + [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) + [Drei](https://github.com/pmndrs/drei) |
| Icons | [Lucide React](https://lucide.dev/) |
| Styling | Vanilla CSS (component-scoped) |
| Linting | ESLint |

---

## Project Structure

```
src/
├── components/
│   ├── 3d/               # Three.js 3D components (EarthGlobe, SpaceScene, Satellite, …)
│   ├── analysis/         # Analysis UI (QueryPanel, AnalysisResult, AIInsights, FollowUp, …)
│   ├── layout/           # App shell (Header, Sidebar, Footer)
│   └── ui/               # Shared UI primitives
├── pages/                # Route-level pages (Home, Analyze, History, Datasets, UseCases, Settings, About)
├── services/
│   └── analysisService.js  # Analysis logic & localStorage history management
├── App.jsx               # Root component & router setup
└── main.jsx              # Entry point
```

---

## Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev
```

The app will be available at `http://localhost:5173` by default.

```bash
# Build for production
npm run build

# Preview the production build
npm run preview
```

---

## Notes

- The analysis service currently uses **mock data** to simulate AI responses. To connect a real AI/satellite API, update `src/services/analysisService.js`.
- Analysis history is stored in **localStorage** (no backend required).
- No API keys or secrets are required to run the app locally in its current state.

---

## License

This project is private. All rights reserved.
