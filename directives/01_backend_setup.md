# Directive: Backend Setup

## Objective
Initialize and run the Node.js/Express backend for SchemeSathi.

## Inputs
- `Backend/` directory (empty initially)
- Firebase service account JSON key
- Gemini API key

## Tools / Scripts
- `execution/seed_schemes.js` – seeds Firestore with 12 schemes
- `Backend/server.js` – Express entry point

## Steps
1. `cd Backend && npm install`
2. Copy `.env.example` to `.env` and fill in credentials
3. Run seed: `node ../execution/seed_schemes.js`
4. Start dev server: `npm run dev`

## Outputs
- REST API running on `http://localhost:5000`

## Edge Cases
- Firestore quota issues: seed once, don't re-run unnecessarily
- Gemini rate limits: 15 req/min on free tier – add retry logic
- Missing env vars: server will throw on startup - check .env
