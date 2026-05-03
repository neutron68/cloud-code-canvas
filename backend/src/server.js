/**
 * OmniCode Execution Engine Server
 * Main server file
 */

import express from 'express';
import cors from 'cors';
import { config } from './config/config.js';
import logger from './utils/logger.js';
import fileManager from './utils/fileManager.js';
import runRoute from './routes/runRoute.js';

const app = express();

// Middleware
app.use(cors({
  origin: '*', // Allow all origins for development
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('user-agent'),
  });
  next();
});

// API Routes
app.use('/api', runRoute);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'OmniCode Execution Engine',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      execute: 'POST /api/run',
      status: 'GET /api/status',
      health: 'GET /api/health',
    },
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(`Unhandled error: ${err.message}`, { stack: err.stack });
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: err.message,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
  });
});

// Start server
const PORT = config.port;
const HOST = config.host;

app.listen(PORT, HOST, () => {
  logger.info(`🚀 OmniCode Execution Engine started`);
  logger.info(`📡 Server running at http://${HOST}:${PORT}`);
  logger.info(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`⏱️  Max execution time: ${config.execution.maxExecutionTime}ms`);
  logger.info(`📁 Temp directory: ${config.execution.tempDirBase}`);
  
  // Cleanup old directories on startup
  fileManager.cleanupOldDirectories();
  
  // Schedule periodic cleanup
  setInterval(() => {
    fileManager.cleanupOldDirectories();
  }, 60 * 60 * 1000); // Every hour
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled rejection at:', promise, 'reason:', reason);
});

export default app;
