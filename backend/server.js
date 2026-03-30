const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB connected to ResilientNet DB'))
    .catch(err => console.error('❌ MongoDB connection error:', err));

// Health Check
app.get('/api/health', (req, res) => res.json({ status: "ok", message: "ResilientNet Backend is live!" }));

// Routes (We will fill these files next)
app.use('/api/households', require('./routes/households'));
app.use('/api/logs', require('./routes/logs'));
app.use('/api/forecast', require('./routes/forecast'));
app.use('/api/alerts', require('./routes/alerts'));

// Note: Your teammate will handle app.use('/api/auth', ...)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));