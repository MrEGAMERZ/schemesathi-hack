# Directive: Frontend Setup

## Objective
Initialize and run the React/Vite frontend for SchemeSathi.

## Inputs
- `FrontEnd/` directory
- Backend running on port 5000

## Tools / Scripts
- Vite dev server
- `FrontEnd/src/services/api.js` – all API calls

## Steps
1. `cd FrontEnd && npm install`
2. Copy `.env.example` to `.env` and set `VITE_API_URL=http://localhost:5000`
3. Start dev server: `npm run dev`
4. Open `http://localhost:5173`

## Outputs
- React app with Home, Scheme Detail, Recommend pages
- Floating chatbot component

## Edge Cases
- CORS errors: ensure backend has correct `CORS_ORIGIN` set
- AI calls slow: loading spinners are shown during every AI request
- Vite port conflict: change port in vite.config.js
