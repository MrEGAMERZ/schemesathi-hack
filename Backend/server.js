require('dotenv').config();
const express = require('express');
const cors = require('cors');

const schemesRouter = require('./routes/schemes');
const eligibilityRouter = require('./routes/eligibility');
const recommendRouter = require('./routes/recommend');
const aiRouter = require('./routes/ai');

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ──────────────────────────────────────────────────────────────
const allowedOrigins = [
  process.env.CORS_ORIGIN,
  'http://localhost:5173',
  'https://schemesathi-hack.vercel.app'
].filter(Boolean);
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes('*')) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
  })
);

app.use(express.json({ limit: '2mb' }));

// ── Routes ──────────────────────────────────────────────────────────────────
app.use('/schemes', schemesRouter);
app.use('/eligibility-check', eligibilityRouter);
app.use('/recommend', recommendRouter);
app.use('/simplify', aiRouter);
app.use('/translate', aiRouter);
app.use('/generate-faq', aiRouter);
app.use('/chatbot', aiRouter);

// ── Health check ─────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'SchemeSathi API is running 🇮🇳' });
});

// ── Global error handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error', details: err.message });
});

app.listen(PORT, () => {
  console.log(`✅ SchemeSathi Backend running on http://localhost:${PORT}`);
});

module.exports = app;
