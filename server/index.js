require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// 1. Connect to Database
connectDB();

// 2. Dynamic CORS Configuration
// This allows your local dev environment AND your future live site to talk to the API
const allowedOrigins = [
    'http://localhost:3000',
    'https://expel-ai-frontend.vercel.app/' // ⬅️ Add your real link here
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin) return callback(null, true);

        const isAllowed = allowedOrigins.some((allowed) => {
            if (allowed instanceof RegExp) return allowed.test(origin);
            return allowed === origin;
        });

        if (isAllowed) {
            callback(null, true);
        } else {
            callback(new Error('CORS Policy Blocked this request'));
        }
    },
    credentials: true
}));

// 3. Middleware
app.use(express.json());

// 4. Routes
app.get('/api/status', (req, res) => {
    res.json({
        status: 'ok',
        message: 'ExpelAI API is running',
        system: 'Gemini 3 Flash Agentic Core', //
        timestamp: new Date().toISOString()
    });
});

app.use('/api/data', require('./routes/dataRoutes'));

// 5. Port Configuration
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 ExpelAI Server running on port ${PORT}`);
});