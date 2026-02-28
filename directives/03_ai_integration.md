# Directive: AI Integration (Google Gemini)

## Objective
Integrate Google Gemini 1.5 Flash for simplification, translation, FAQ generation, and chatbot responses.

## Inputs
- `GEMINI_API_KEY` environment variable
- Scheme description text
- Target language (for translation)
- User query (for chatbot)

## Tools / Scripts
- `Backend/services/geminiService.js` – all Gemini API calls

## Prompts
### Simplification
```
Summarize the following government scheme in simple language suitable for rural citizens. 
Use short sentences and bullet points. Keep it under 200 words.
Scheme: {description}
```

### FAQ Generation
```
Generate exactly 5 frequently asked questions with short clear answers based on this scheme.
Format as JSON array: [{"q": "...", "a": "..."}]
Scheme: {description}
```

### Translation
```
Translate the following content into {language} in simple and clear tone. 
Preserve the meaning exactly.
Content: {content}
```

### Chatbot
```
You are SchemeSathi, a government scheme assistant for Indian citizens.
Available schemes: {schemesSummary}
User question: {query}
Answer only about government schemes. If unrelated, politely redirect.
Keep response under 150 words.
```

## Edge Cases
- API key missing: return 500 with clear error message
- Rate limit hit: retry after 2 seconds (up to 3 times)
- Invalid JSON from FAQ: fallback to text parsing
- Language not supported: default to English
