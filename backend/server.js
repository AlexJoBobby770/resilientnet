const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ── Middleware ────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Database Connection ───────────────────────────────────
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB connected to ResilientNet DB'))
    .catch(err => console.error('❌ MongoDB connection error:', err));

// ── Health Check ──────────────────────────────────────────
app.get('/api/health', (req, res) => res.json({ status: 'ok', message: 'ResilientNet Backend is live!' }));

// ── Auth Routes (Public) ──────────────────────────────────
// POST /api/auth/google  — verify Google token, return JWT
app.use('/api/auth', require('./routes/auth'));

// ── Protected Routes (require valid JWT) ──────────────────
// Import the auth middleware once and apply to any route that needs protection.
const authMiddleware = require('./middleware/auth');

app.use('/api/households', authMiddleware, require('./routes/households'));
app.use('/api/logs',       authMiddleware, require('./routes/logs'));
app.use('/api/forecast',   authMiddleware, require('./routes/forecast'));
app.use('/api/alerts',     authMiddleware, require('./routes/alerts'));
app.use('/api/resilience', authMiddleware, require('./routes/forecast'));

// ── Start Server ──────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));