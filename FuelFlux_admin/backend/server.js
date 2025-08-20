import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import apiRoutes from './routes/api.js';
import jwt from 'jsonwebtoken';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https:"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'", "http://localhost:*", "https://*"],
            fontSrc: ["'self'", "https:", "data:"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'self'"],
        }
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS configuration
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        // List of allowed origins
        const allowedOrigins = [
            'http://localhost:3000',
            'http://localhost:5173',
            'http://localhost:5174',
            'http://127.0.0.1:5173',
            'http://127.0.0.1:3000',
            'http://127.0.0.1:5173',
            'http://127.0.0.1:5174'
        ];

        // Allow all localhost origins in development
        if (process.env.NODE_ENV === 'development' && 
            (origin.startsWith('http://localhost:') || 
             origin.startsWith('http://127.0.0.1:'))) {
            return callback(null, true);
        }

        // Check if the origin is allowed
        if (allowedOrigins.indexOf(origin) !== -1) {
            return callback(null, true);
        }

        // Origin not allowed
        const msg = `CORS not allowed for origin: ${origin}`;
        console.error(msg);
        return callback(new Error(msg), false);
    },
    credentials: true,  // Allow credentials (cookies, authorization headers)
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
        'Content-Type', 
        'Authorization', 
        'X-Requested-With',
        'Cache-Control',
        'Pragma',
        'X-Requested-With',
        'XMLHttpRequest'
    ],
    exposedHeaders: [
        'Content-Range', 
        'X-Content-Range',
        'Content-Length',
        'Content-Type'
    ],
    preflightContinue: false,
    optionsSuccessStatus: 204
}));

app.use(express.json({ limit: '10mb', strict: true }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser(process.env.COOKIE_SECRET));

// More sophisticated rate limiter
const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
    max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => process.env.NODE_ENV === 'development'
});

// Apply rate limiter to all routes
app.use(limiter);

// Handle .well-known requests to suppress 404 errors
app.get('/.well-known/*', (req, res) => {
    res.status(204).send();
});

// Mount API routes
app.use('/api', apiRoutes);

// Performance monitoring middleware
app.use((req, res, next) => {
    req.startTime = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - req.startTime;
        console.log(`${req.method} ${req.url} ${res.statusCode} - ${duration}ms`);
        if (duration > 1000) {
            console.warn(`Slow request: ${req.method} ${req.url} took ${duration}ms`);
        }
    });
    next();
});

// Enhanced error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', {
        message: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
        path: req.path,
        method: req.method,
        timestamp: new Date().toISOString()
    });

    // Handle specific error types
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            error: 'Validation Error',
            details: err.message
        });
    }

    if (err.name === 'UnauthorizedError') {
        return res.status(401).json({
            error: 'Unauthorized',
            details: 'Invalid or expired token'
        });
    }

    // Default error response
    res.status(err.status || 500).json({
        error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
        requestId: req.id
    });
});

// Database connection and server startup
const startServer = async () => {
    try {
        // MongoDB connection options - optimized for local development
        const mongooseOptions = {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            family: 4,
            connectTimeoutMS: 5000,
            autoIndex: true,
            minPoolSize: 3,
            maxPoolSize: 10
        };

        // Connect to MongoDB with enhanced retry logic
        const connectWithRetry = async (retries = 3) => {
            try {
                console.log('Attempting to connect to MongoDB...');
                const mongoUri = 'mongodb://127.0.0.1:27017/FUELFLUX';
                
                await mongoose.connect(mongoUri, mongooseOptions);
                console.log('✓ Connected to MongoDB successfully');
                
                // Verify database connection
                const collections = await mongoose.connection.db.listCollections().toArray();
                console.log('Available collections:', collections.map(c => c.name).join(', '));
                
                // Monitor for disconnections
                mongoose.connection.on('disconnected', () => {
                    console.warn('Lost MongoDB connection! Attempting to reconnect...');
                    setTimeout(() => connectWithRetry(1), 5000);
                });

                mongoose.connection.on('error', (err) => {
                    console.error('MongoDB connection error:', err);
                });

                // Graceful shutdown handler
                process.on('SIGINT', async () => {
                    try {
                        await mongoose.connection.close();
                        console.log('MongoDB connection closed through app termination');
                        process.exit(0);
                    } catch (err) {
                        console.error('Error during MongoDB shutdown:', err);
                        process.exit(1);
                    }
                });
                
            } catch (error) {
                console.error('MongoDB connection error:', error.message);
                
                if (error.message.includes('ECONNREFUSED')) {
                    console.error('Make sure MongoDB is running on localhost:27017');
                }
                
                if (retries > 0) {
                    const retryDelay = 5000;
                    console.log(`Retrying connection in ${retryDelay/1000} seconds... (${retries} attempts left)`);
                    await new Promise(resolve => setTimeout(resolve, retryDelay));
                    return connectWithRetry(retries - 1);
                }
                throw error;
            }
        };

        await connectWithRetry();

        // Try to start server with enhanced port handling
        const tryPort = async (port) => {
            if (port >= 65536) {
                throw new Error('No available ports found in valid range (1-65535)');
            }

            return new Promise((resolve, reject) => {
                console.log(`Attempting to start server on port ${port}...`);
                
                const server = app.listen(port)
                    .once('error', (err) => {
                        if (err.code === 'EADDRINUSE') {
                            console.log(`Port ${port} is in use`);
                            server.close();
                            // Try next port
                            const nextPort = Math.min(port + 1, 65535);
                            console.log(`Attempting port ${nextPort}...`);
                            resolve(tryPort(nextPort));
                        } else {
                            console.error('Server startup error:', err);
                            reject(err);
                        }
                    })
                    .once('listening', () => {
                        // Explicitly log the active port
                        const activePort = process.env.PORT || 3000;
                        console.log(`✓ Server is running on http://localhost:${activePort}`);
                        console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
                        
                        // Enhanced graceful shutdown
                        const shutdown = async (signal) => {
                            console.log(`\n${signal} received. Initiating graceful shutdown...`);
                            
                            // Set a timeout for forceful shutdown
                            const forceShutdown = setTimeout(() => {
                                console.error('Forceful shutdown initiated after timeout');
                                process.exit(1);
                            }, 10000); // 10 second timeout
                            
                            try {
                                // Close server first
                                await new Promise((resolve) => server.close(resolve));
                                console.log('✓ Server closed');
                                
                                // Then close database connection
                                await mongoose.connection.close(false);
                                console.log('✓ Database connection closed');
                                
                                clearTimeout(forceShutdown);
                                console.log('✓ Graceful shutdown completed');
                                process.exit(0);
                            } catch (err) {
                                console.error('Error during shutdown:', err);
                                clearTimeout(forceShutdown);
                                process.exit(1);
                            }
                        };

                        // Handle various shutdown signals
                        process.on('SIGTERM', () => shutdown('SIGTERM'));
                        process.on('SIGINT', () => shutdown('SIGINT'));
                        process.on('uncaughtException', (err) => {
                            console.error('Uncaught Exception:', err);
                            shutdown('Uncaught Exception');
                        });
                        
                        resolve(server);
                    });
            });
        };

        const initialPort = parseInt(process.env.PORT) || 3000;
        await tryPort(initialPort);

        // Graceful shutdown
        process.on('SIGTERM', () => {
            console.log('SIGTERM received. Shutting down gracefully...');
            server.close(() => {
                console.log('Server closed.');
                mongoose.connection.close(false, () => {
                    console.log('MongoDB connection closed.');
                    process.exit(0);
                });
            });
        });

    } catch (error) {
        console.error('Startup error:', error);
        process.exit(1);
    }
};

startServer();