const axios = require('axios');

const GEMINI_API_URL =
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

/**
 * Call Gemini API with retry logic (up to 3 attempts)
 * @param {string} prompt
 * @returns {Promise<string>} Generated text
 */
const callGemini = async (prompt, config = {}, retries = 3) => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error('GEMINI_API_KEY not set in environment');

    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const response = await axios.post(
                `${GEMINI_API_URL}?key=${apiKey}`,
                {
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: {
                        maxOutputTokens: config.maxTokens || 2048,
                        temperature: config.temperature ?? 0.4,
                    },
                },
                { timeout: 60000 }
            );

            const text =
                response.data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
            return text.trim();
        } catch (err) {
            console.error('Gemini API Error:', err.response?.data || err.message);
            if (attempt === retries) throw err;
            if (err.response?.status === 429) {
                // Rate limit — wait 2 s before retry
                await new Promise((r) => setTimeout(r, 2000));
            } else {
                throw err;
            }
        }
    }
};

const simplifyScheme = async (description) => {
    const prompt = `Summarize the following government scheme in simple language suitable for rural citizens. Use short sentences and bullet points. Keep it under 200 words. Always respond in English.

Scheme: ${description}`;
    return callGemini(prompt, { maxTokens: 1024 });
};

/**
 * Explain a scheme like the user is 15 years old
 */
const explainLikeIAm15 = async (description) => {
    const prompt = `Explain the following government scheme as if I am a 15-year old student. Use very simple analogies, basic terms, and keep it extremely engaging and clear. Under 150 words. Always respond in English.
    
    Scheme: ${description}`;
    return callGemini(prompt, { maxTokens: 1024 });
};

/**
 * Generate 5 FAQs from a scheme description
 * Returns an array of {q, a} objects
 */
const generateFAQs = async (description) => {
    const prompt = `Generate exactly 5 frequently asked questions with short, clear answers about the following government scheme.

Rules:
- Each question should be practical (eligibility, how to apply, benefits, documents needed, deadlines).
- Each answer should be 1-2 sentences max.
- Respond in English only.
- Return ONLY a valid JSON array. No markdown, no code fences, no extra text.
- Format: [{"q": "question here", "a": "answer here"}]

Scheme: ${description}`;

    const raw = await callGemini(prompt, { maxTokens: 1536 });

    try {
        // Strip markdown code fences if present
        const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        const jsonMatch = cleaned.match(/\[[\s\S]*\]/);
        if (!jsonMatch) throw new Error('No JSON array found');
        return JSON.parse(jsonMatch[0]);
    } catch (err) {
        console.error('FAQ parse failed. Raw output:', raw);
        return [{ q: 'What is this scheme about?', a: raw.replace(/```[\s\S]*```/g, '').trim() }];
    }
};

/**
 * Translate content to a target language
 */
const translateContent = async (content, language) => {
    const prompt = `Translate the following content into ${language} in simple and clear tone. Preserve the meaning exactly. Do not add any extra commentary.

Content: ${content}`;
    return callGemini(prompt);
};

/**
 * Chatbot response — scheme-domain only
 */
const chatbotResponse = async (query, richContext) => {
    const prompt = `You are SchemeSathi, an expert assistant helping Indian citizens find and understand government welfare schemes.

You have been given REAL data from our database. Use it to give precise, factual answers.

${richContext}

User's question: "${query}"

Instructions:
- Use the "HIGHLY RELEVANT SCHEMES — Full Details" section to give specific answers about eligibility, documents, how to apply, and benefits.
- Mention specific amounts (like ₹6,000/year), deadlines, and documents when available.
- If no scheme is relevant, still help by listing related schemes from the brief list.
- If the question is completely off-topic (not about government schemes), say: "I can only help with government scheme related questions."
- Keep your response under 200 words.
- Use simple, friendly language — as if talking to a village elder.
- Always respond in the SAME language the user used. If they write in Hindi, respond in Hindi.
- Do NOT make up information. Only use what's in the context above.`;

    return callGemini(prompt, { maxTokens: 1024, temperature: 0.3 });
};


/**
 * Extract structured JSON data from raw scraped text
 */
const extractSchemeData = async (rawText) => {
    const prompt = `Following is raw text scraped from a government scheme page. 
Extract and structure it into a JSON object with the following fields:
{
  "name": "Full name of the scheme",
  "category": "One of: Agriculture, Women, Education, Health, Housing, Labor",
  "state": "State name or 'all'",
  "description": "A comprehensive description of the scheme",
  "summary": "A short 1-sentence summary",
  "eligibility": {
    "min_age": number (0 if none),
    "max_age": number (0 if none),
    "gender": "male", "female", or "any",
    "income_limit": number (0 if none),
    "occupation": "farmer", "student", "laborer", or "any",
    "state": "State name or 'all'"
  },
  "required_documents": ["list", "of", "strings"],
  "application_process": "Description of how to apply",
  "official_link": "URL to official portal if found in text"
}

Return ONLY the valid JSON object. No other text.

Raw Text:
${rawText}`;

    const raw = await callGemini(prompt, { maxTokens: 2048 });
    try {
        const jsonMatch = raw.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error('No JSON object found');
        return JSON.parse(jsonMatch[0]);
    } catch (err) {
        console.error('Failed to parse Gemini output as JSON:', raw);
        throw new Error('AI failed to structure scheme data');
    }
};

module.exports = {
    simplifyScheme,
    generateFAQs,
    translateContent,
    chatbotResponse,
    explainLikeIAm15,
    extractSchemeData,
};
