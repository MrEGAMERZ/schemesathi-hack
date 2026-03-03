# SchemeSathi

AI-Powered Government Scheme Intelligence Platform

---

## 1. Vision

SchemeSathi aims to simplify government schemes and make them understandable, accessible, and actionable for rural citizens, women, and low-income families.

We want to reduce confusion, eliminate dependency on middlemen, and improve access to public welfare through AI-powered assistance.

---

## 2. Core Problem

- Government schemes are written in complex language.
- Eligibility rules are difficult to interpret.
- Required documents are unclear.
- Citizens often miss benefits due to lack of awareness.
- Many depend on third parties for guidance.

Access to information should be simple and transparent.

---

## 3. Long-Term Goal

Build a trusted government scheme intelligence platform that:

- Structures scheme data automatically
- Simplifies information
- Checks eligibility instantly
- Recommends relevant schemes
- Provides AI-powered assistance
- Ensures data transparency and verification

---

## 4. System Architecture Overview

### Layer 1: Scheme Knowledge Engine (Persistent Storage)

Stores:
- Scheme name
- Description
- Simplified description
- Eligibility rules
- Required documents
- Category
- Official link
- Last updated date
- Verification status

Database: Firebase Firestore

---

### Layer 2: AI Structuring Engine (Admin Controlled)

Flow:
1. Admin enters official scheme URL
2. Backend scrapes raw content
3. AI extracts structured JSON
4. Data saved to `pending_schemes`
5. Admin reviews and approves
6. Approved data moves to `schemes`

This reduces manual work while maintaining accuracy.

---

### Layer 3: Dynamic AI Assistance (On-Demand)

Generated when user requests:

- FAQs
- Translation
- Chatbot responses
- Simplified explanations (if needed)
- Compare two schemes
- "Explain like I am 15" mode

These are not stored permanently.

---

### Layer 4: Recommendation Engine

User enters:
- Age
- Gender
- Income
- Location
- Occupation

System:
- Filters schemes using eligibility rules
- Ranks relevant schemes
- Returns top 3 recommendations
- Explains why they match

---

## 5. Key Features

### Must-Have

- Scheme search
- Category filters
- Scheme detail page
- Eligibility checker
- Document checklist
- Simplified explanation
- Official link redirect
- Recommendation system
- AI chatbot
- Language translation
- FAQ generation

---

### Trust & Transparency Features

- Verification badge (Admin Approved)
- Last updated timestamp
- Source link display
- AI disclaimer

---

## 6. Data Strategy

### Persistent (Store Once)

- Simplified description
- Structured eligibility
- Required documents
- Category
- Metadata

### Dynamic (Generate When Needed)

- FAQs
- Chatbot responses
- Translations
- Additional explanations

This reduces API cost and improves performance.

---

## 7. Scraping Strategy

- No automatic mass scraping
- Admin-triggered scraping only
- Use controlled extraction (axios + cheerio)
- AI converts raw text to structured JSON
- Manual approval required before publishing

---

## 8. Tech Stack

Frontend:
- React (Vercel)

Backend:
- Node.js + Express (Render)

Database:
- Firebase Firestore

AI:
- Gemini API (cost-efficient and scalable)

Hosting:
- GitHub for version control
- Vercel (frontend)
- Render (backend)

---

## 9. Future Expansion Ideas

- Multi-state expansion
- Version history tracking
- Daily update check
- Compare schemes feature
- Document upload verification assistant
- Voice interface for low-literacy users
- WhatsApp bot integration
- Analytics dashboard (most viewed schemes)
- Community feedback section
- Offline-lite mode for rural areas

---

## 10. Ethical Considerations

- Always show disclaimer: Informational use only
- Do not provide legal guarantees
- Display official government links
- Maintain transparency of AI-generated content
- Require admin approval before publishing scraped data

---

## 11. Cost Control Strategy

- Store structured AI outputs permanently
- Avoid repeated AI calls
- Limit chatbot response length
- Use free-tier AI models initially
- Monitor API usage carefully

---

## 12. Product Direction (To Be Decided)

- Portfolio-level project
- Startup-level product
- NGO-style impact tool
- Public platform for real deployment

Decision pending.

---

## 13. Open Questions

- Which state to focus on first?
- How many schemes initially?
- Should chatbot be scheme-restricted only?
- Should recommendation engine use rule-based or AI ranking?
- Should we add admin login panel?

---

This document will evolve as the product grows.
