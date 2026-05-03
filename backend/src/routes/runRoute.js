/**
 * API Routes for Code Execution
 */

import express from 'express';
import executionService from '../services/executionService.js';
import logger from '../utils/logger.js';

const router = express.Router();

/**
 * POST /api/run
 * Execute code
 */
router.post('/run', async (req, res) => {
  try {
    const { language, code, input } = req.body;

    // Validate request
    if (!language) {
      return res.status(400).json({
        error: 'Language is required',
        success: false,
      });
    }

    if (!code) {
      return res.status(400).json({
        error: 'Code is required',
        success: false,
      });
    }

    logger.info(`Received execution request: ${language}`);

    // Execute code
    const result = await executionService.execute(
      language.toLowerCase(),
      code,
      input || ''
    );

    // Return result
    res.json(result);

  } catch (error) {
    logger.error(`API error: ${error.message}`);
    res.status(500).json({
      success: false,
      stdout: '',
      stderr: `Server error: ${error.message}`,
      compile_output: '',
      status: { id: 13, description: 'Internal Error' },
      time: 0,
      memory: 0,
    });
  }
});

/**
 * GET /api/status
 * Get system status
 */
router.get('/status', async (req, res) => {
  try {
    const status = await executionService.getSystemStatus();
    res.json({
      success: true,
      ...status,
    });
  } catch (error) {
    logger.error(`Status API error: ${error.message}`);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/health
 * Health check endpoint
 */
router.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    activeExecutions: executionService.getActiveExecutionsCount(),
  });
});

export default router;
