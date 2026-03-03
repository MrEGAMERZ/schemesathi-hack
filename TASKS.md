# SchemeSathi — Task Tracker
> Last updated: 2026-03-03

Legend: ✅ Done · 🔄 In Progress · ❌ Not Started · ⚠️ Partial / Needs Fix

---

## 🏗️ LAYER 1 — Scheme Knowledge Engine (Backend + DB)

| # | Task | Status | Notes |
|---|------|--------|-------|
| 1.1 | Firebase Firestore setup | ✅ Done | `Backend/firebase/` configured |
| 1.2 | Scheme data model (name, desc, eligibility, docs, category, link, updated, verified) | ✅ Done | Fields all present in seeded data |
| 1.3 | Seed schemes into Firestore | ✅ Done | `execution/seed_schemes.js` — 12+ schemes |
| 1.4 | `GET /schemes` — list all schemes | ✅ Done | `routes/schemes.js` |
| 1.5 | `GET /schemes/:id` — single scheme | ✅ Done | `routes/schemes.js` |
| 1.6 | Verification badge / admin-approved flag in data | ✅ Done | Added to seeded data |
| 1.7 | Last-updated timestamp stored & displayed | ✅ Done | Stored in DB and shown in UI |
| 1.8 | Source / official link stored & displayed | ✅ Done | `official_link` field + displayed in Read More tab |

---

## 🤖 LAYER 2 — AI Structuring Engine (Admin Controlled)

| # | Task | Status | Notes |
|---|------|--------|-------|
| 2.1 | Admin URL scraping endpoint (axios + cheerio) | ❌ Not Started | Planned but not built |
| 2.2 | AI extracts structured JSON from raw scraped text | ❌ Not Started | Requires Gemini + scraper integration |
| 2.3 | Save scraped data to `pending_schemes` Firestore collection | ❌ Not Started | No pending_schemes collection yet |
| 2.4 | Admin review page (approve / reject pending schemes) | ❌ Not Started | No admin panel exists |
| 2.5 | Move approved scheme from `pending_schemes` → `schemes` | ❌ Not Started | Backend logic needed |
| 2.6 | Admin login / authentication | ❌ Not Started | Open question in idea.md |

---

## ⚡ LAYER 3 — Dynamic AI Assistance (On-Demand)

| # | Task | Status | Notes |
|---|------|--------|-------|
| 3.1 | Gemini API integration / service | ✅ Done | `services/geminiService.js` |
| 3.2 | `POST /simplify` — AI simplification | ✅ Done | Working with retry logic |
| 3.3 | `POST /translate` — Hindi / Kannada / Tamil | ✅ Done | 4 languages supported |
| 3.4 | `POST /generate-faq` — 5 AI-generated FAQs | ✅ Done | Returns `[{q, a}]` JSON |
| 3.5 | `POST /chatbot` — Scheme-restricted chatbot | ✅ Done | Includes scheme context |
| 3.6 | "Explain like I am 15" mode | ✅ Done | Service + Routing + UI Button |
| 3.7 | Compare two schemes feature | ✅ Done | Logic in frontend (rule-based comparison) |
| 3.8 | AI disclaimer shown to users | ✅ Done | Banner in Overview & Chatbot disclaimer |

---

## 🎯 LAYER 4 — Recommendation Engine

| # | Task | Status | Notes |
|---|------|--------|-------|
| 4.1 | `POST /recommend` — rule-based scoring | ✅ Done | Age, gender, income, state, occupation |
| 4.2 | Returns top 3 recommended schemes with reasons | ✅ Done | Score ≥ 50 filter + fallback |
| 4.3 | Frontend Recommend page | ✅ Done | `pages/Recommend.jsx` |
| 4.4 | Explain why schemes match the user | ✅ Done | `reason` field returned |

---

## 🖥️ FRONTEND — Core Pages & Components

| # | Task | Status | Notes |
|---|------|--------|-------|
| 5.1 | Home page — scheme listing | ✅ Done | `pages/Home.jsx` |
| 5.2 | Scheme search (by name/keyword) | ✅ Done | Live search in Home |
| 5.3 | Category filter | ✅ Done | `components/CategoryFilter.jsx` |
| 5.4 | Scheme Card component | ✅ Done | `components/SchemeCard.jsx` |
| 5.5 | Scheme Detail page (tabbed) | ✅ Done | Overview, Eligibility, Docs, FAQs, Read More |
| 5.6 | Overview Tab — AI simplified explanation | ✅ Done | Calls `/simplify` on load |
| 5.7 | Language selector (EN/HI/KN/TA) for translation | ✅ Done | In Overview tab |
| 5.8 | Eligibility Checker tab | ✅ Done | Form → `/eligibility-check` |
| 5.9 | Documents tab — required docs checklist | ✅ Done | Fallback defaults provided |
| 5.10 | FAQs tab — Generate / Regenerate FAQs | ✅ Done | On-demand Gemini call |
| 5.11 | Read More tab — full description + apply link | ✅ Done | Official portal link |
| 5.12 | ChatBot component (floating) | ✅ Done | `components/ChatBot.jsx` |
| 5.13 | Navbar + Footer | ✅ Done | `components/Navbar.jsx`, `Footer.jsx` |
| 5.14 | Recommend page (AI profile matcher) | ✅ Done | `pages/Recommend.jsx` |
| 5.15 | Verification badge display in UI | ✅ Done | Shown on Card & Detail page |
| 5.16 | AI disclaimer notice in UI | ✅ Done | Banner in Overview tab |
| 5.17 | "Explain like I am 15" button on scheme detail | ✅ Done | Toggle in Overview tab |
| 5.18 | Compare two schemes UI | ✅ Done | Side-by-side comparison page |
| 5.19 | Admin authentication UI | ✅ Done | Simple password-protected panel |

---

## 🛡️ TRUST & TRANSPARENCY

| # | Task | Status | Notes |
|---|------|--------|-------|
| 6.1 | Admin Approved verification badge | ✅ Done | UI & Backend seeding both updated |
| 6.2 | Last updated timestamp visible to users | ✅ Done | Shown on Detail hero |
| 6.3 | Source link displayed | ✅ Done | Official link in Read More tab |
| 6.4 | AI disclaimer banner / notice | ✅ Done | Critical ethical requirement met |

---

## 🚀 DEPLOYMENT

| # | Task | Status | Notes |
|---|------|--------|-------|
| 7.1 | Frontend on Vercel | ✅ Done | `schemesathi-hack.vercel.app` |
| 7.2 | Backend on Render | ✅ Done | Env vars configured |
| 7.3 | CORS configured for prod origins | ✅ Done | `server.js` allowedOrigins list |
| 7.4 | `.env.example` files present | ✅ Done | Both Backend and FrontEnd |
| 7.5 | GitHub version control | ✅ Done | `.gitignore` in place |

---

## 🔮 FUTURE / STRETCH GOALS

| # | Task | Status | Notes |
|---|------|--------|-------|
| 8.1 | Multi-state expansion | ❌ Future | idea.md expansion |
| 8.2 | Version history tracking | ❌ Future | |
| 8.3 | Daily update check (scheme freshness) | ❌ Future | |
| 8.4 | Document upload verification assistant | ❌ Future | |
| 8.5 | Voice interface for low-literacy users | ❌ Future | |
| 8.6 | WhatsApp bot integration | ❌ Future | |
| 8.7 | Analytics dashboard (most viewed schemes) | ❌ Future | |
| 8.8 | Community feedback section | ❌ Future | |
| 8.9 | Offline-lite mode for rural areas | ❌ Future | |

---

## 📋 PRIORITY ACTION ITEMS (Do These Next)

These are things from `idea.md` that are **incomplete** and should be built:

### 🔴 High Priority (Core feature gaps)
1. **[Task 5.16 / 6.4]** Add AI disclaimer banner — required per ethical guidelines
2. **[Task 5.15 / 6.1]** Show verification badge (Admin Approved) on scheme cards and detail page
3. **[Task 6.2]** Display `last_updated` timestamp on scheme detail page
4. **[Task 5.17 / 3.6]** "Explain like I am 15" mode — new Gemini prompt + UI button

### 🟡 Medium Priority (Admin Panel)
5. **[Task 2.1]** Build URL scraping endpoint (`POST /admin/scrape`) using axios + cheerio
6. **[Task 2.2]** Extract structured JSON from scraped content via Gemini
7. **[Task 2.3]** Store scraped data in `pending_schemes` Firestore collection
8. **[Task 2.4]** Admin review UI — approve/reject pending schemes
9. **[Task 2.5]** Move approved scheme from `pending_schemes` → `schemes`
10. **[Task 2.6]** Admin authentication (basic password or Firebase Auth)

### 🟢 Low Priority (Polish)
11. **[Task 5.18 / 3.7]** Compare two schemes feature — UI + backend endpoint
12. **[Task 8.7]** Analytics dashboard for most viewed schemes
