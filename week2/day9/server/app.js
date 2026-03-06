const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
// const { body, validationResult } = require('express-validator'); // Not directly used in app.js

// Import custom middleware
const { authMiddleware } = require('./middleware/auth');
const { validationMiddleware } = require('./middleware/validation'); // Will ensure validation handles next() correctly if empty
const { errorHandler, logger } = require('./middleware/errorHandler');
const loggerMiddleware = require('./middleware/logger');
const { performanceMiddleware } = require('./middleware/performance');

// Import routes
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');

class ExpressApp {
    constructor() {
        this.app = express();
        this.port = process.env.PORT || 3000;
        this.setupMiddleware();
        this.setupRoutes();
        this.setupErrorHandling();
    }

    setupMiddleware() {
        // Security middleware
        this.app.use(helmet({
            contentSecurityPolicy: {
                directives: {
                    defaultSrc: ["'self'"],
                    styleSrc: ["'self'", "'unsafe-inline'"],
                    scriptSrc: ["'self'"],
                    imgSrc: ["'self'", "data:", "https:"],
                },
            },
        }));

        // CORS configuration
        this.app.use(cors({
            origin: process.env.FRONTEND_URL || 'http://localhost:3000',
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
            allowedHeaders: ['Content-Type', 'Authorization']
        }));

        // Compression
        this.app.use(compression());

        // Rate limiting
        const limiter = rateLimit({
            windowMs: 15 * 60 * 1000, // 15 minutes
            max: 100, // limit each IP to 100 requests per windowMs
            message: {
                error: 'Too many requests from this IP, please try again later.'
            },
            standardHeaders: true,
            legacyHeaders: false,
        });
        this.app.use('/api/', limiter);

        // Logging
        this.app.use(morgan('combined'));
        this.app.use(loggerMiddleware);

        // Performance monitoring
        this.app.use(performanceMiddleware);

        // Body parsing
        this.app.use(express.json({ limit: '10mb' }));
        this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

        // Request validation (Global validation middleware if setup, omitted or mocked to not crash)
        // this.app.use(validationMiddleware);
    }

    setupRoutes() {
        // Health check
        this.app.get('/health', (req, res) => {
            res.json({
                status: 'OK',
                timestamp: new Date().toISOString(),
                uptime: process.uptime(),
                memory: process.memoryUsage(),
                version: process.version
            });
        });

        // API routes
        this.app.use('/api/users', userRoutes);
        this.app.use('/api/products', productRoutes);
        this.app.use('/api/orders', orderRoutes);

        // 404 handler
        this.app.use((req, res) => {
            res.status(404).json({
                success: false,
                message: 'Route not found',
                path: req.originalUrl
            });
        });
    }

    setupErrorHandling() {
        this.app.use(errorHandler);
    }

    start() {
        this.app.listen(this.port, () => {
            console.log(`Server running on port ${this.port}`);
            console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
        });
    }
}

module.exports = ExpressApp;
