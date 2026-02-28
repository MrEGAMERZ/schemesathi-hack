# SchemeSathi 🇮🇳

> AI-powered government scheme assistant — helping rural citizens navigate benefits confidently.

## Quick Start

### Prerequisites
- Node.js 18+
- Firebase project with Firestore enabled
- Google Gemini API key ([Get free key](https://aistudio.google.com/))

### Backend Setup
```bash
cd Backend
npm install
cp .env.example .env
# Fill in GEMINI_API_KEY and FIREBASE_SERVICE_ACCOUNT in .env
npm run dev            # starts on http://localhost:5000
```

### Seed Firestore (run once)
```bash
cd execution
node seed_schemes.js   # populates 12 real schemes
```

### Frontend Setup
```bash
cd FrontEnd
npm install
cp .env.example .env   # set VITE_API_URL=http://localhost:5000
npm run dev            # starts on http://localhost:5173
```

## Features
- 🔍 Search & filter 12 government schemes
- 🤖 AI-simplified explanations (Gemini)
- ✅ Eligibility checker with reasons
- 📋 Document checklist
- 🌐 Translation to Hindi, Kannada, Tamil
- ❓ Auto-generated FAQs
- 🎯 Profile-based scheme recommendations
- 💬 Floating AI chatbot

## Project Structure
```
schemesathi-hack/
├── directives/          # Agent instruction SOPs
├── execution/           # Seed scripts
├── Backend/             # Node.js + Express API
│   ├── firebase/        # Firebase Admin SDK
│   ├── routes/          # API routes
│   └── services/        # Gemini AI service
└── FrontEnd/            # React + Vite
    └── src/
        ├── components/  # Navbar, Footer, ChatBot, SchemeCard
        ├── pages/       # Home, SchemeDetail, Recommend
        └── services/    # api.js
```

## Deployment
- **Frontend** → Vercel (set `VITE_API_URL` env var)
- **Backend** → Render (set `GEMINI_API_KEY` + `FIREBASE_SERVICE_ACCOUNT` env vars)

See `directives/05_deployment.md` for full deploy guide.

---
⚠️ *This platform provides informational guidance only. Verify details on official government websites.*