// Local development server for testing API endpoints
// This simulates Vercel's serverless functions locally

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(__dirname));

// Import API handlers
import registerHandler from './api/register.js';
import contactHandler from './api/contact.js';
import adminHandler from './api/admin.js';

// API Routes
app.post('/api/register', registerHandler);
app.post('/api/contact', contactHandler);
app.get('/api/admin', adminHandler);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Cyber Oasis API is running',
        timestamp: new Date().toISOString()
    });
});

// Serve static files
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Error handling
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ 
        error: 'Internal server error',
        message: err.message 
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Cyber Oasis server running at http://localhost:${PORT}`);
    console.log(`📊 Admin dashboard: http://localhost:${PORT}/admin.html`);
    console.log(`🧪 Test API: npm run test`);
    console.log(`\nEnvironment check:`);
    console.log(`- Google Sheet ID: ${process.env.GOOGLE_SHEET_ID ? '✅ Set' : '❌ Missing'}`);
    console.log(`- Google Client Email: ${process.env.GOOGLE_CLIENT_EMAIL ? '✅ Set' : '❌ Missing'}`);
    console.log(`- Admin Token: ${process.env.ADMIN_TOKEN ? '✅ Set' : '❌ Missing'}`);
    console.log(`\nPress Ctrl+C to stop the server`);
});

export default app;
