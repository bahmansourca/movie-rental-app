const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const routes = require('./routes');
const authRoutes = require('./routes/authRoutes');
const filmRoutes = require('./routes/filmRoutes');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({
    origin: ['http://localhost:3000', 'https://movie-rental-app-1.onrender.com'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204
}));

// Security headers
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    res.setHeader('Access-Control-Allow-Origin', 'https://movie-rental-app-1.onrender.com');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
    next();
});

// Parse JSON bodies
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, '../../public')));
app.use('/images', express.static(path.join(__dirname, '../public/images')));

// Routes
app.use('/api', routes);
app.use('/api/auth', authRoutes);
app.use('/api/films', filmRoutes);

// Route par défaut
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Add a test route
app.get('/test', (req, res) => {
    res.send('Server is working!');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
}); 