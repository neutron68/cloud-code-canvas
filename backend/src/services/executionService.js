/**
 * Execution Service
 * Main service that routes code execution to appropriate language executors
 */

import javaExecutor from './executor/javaExecutor.js';
import cExecutor from './executor/cExecutor.js';
import cppExecutor from './executor/cppExecutor.js';
import logger from '../utils/logger.js';
import { config } from '../config/config.js';

class ExecutionService {
  constructor() {
    this.executors = {
      java: javaExecutor,
      c: cExecutor,
      cpp: cppExecutor,
    };
    
    this.activeExecutions = 0;
    this.maxConcurrent = config.security.maxConcurrentExecutions;
  }

  /**
   * Execute code in specified language
   * @param {string} language - Programming language (java, c, cpp)
   * @param {string} code - Source code
   * @param {string} input - Standard input
   * @returns {Promise<Object>} Execution result
   */
  async execute(language, code, input = '') {
    // Validate language
    if (!this.executors[language]) {
      logger.error(`Unsupported language: ${language}`);
      return {
        success: false,
        stdout: '',
        stderr: `Unsupported language: ${language}`,
        compile_output: '',
        status: { id: 13, description: 'Internal Error' },
        time: 0,
        memory: 0,
      };
    }

    // Check concurrent execution limit
    if (this.activeExecutions >= this.maxConcurrent) {
      logger.warn('Maximum concurrent executions reached');
      return {
        success: false,
        stdout: '',
        stderr: 'Server is busy. Please try again later.',
        compile_output: '',
        status: { id: 13, description: 'Internal Error' },
        time: 0,
        memory: 0,
      };
    }

    // Validate code
    if (!code || code.trim().length === 0) {
      logger.error('Empty code provided');
      return {
        success: false,
        stdout: '',
        stderr: 'No code provided',
        compile_output: '',
        status: { id: 13, description: 'Internal Error' },
        time: 0,
        memory: 0,
      };
    }

    this.activeExecutions++;
    logger.info(`Starting execution: ${language} (active: ${this.activeExecutions})`);

    try {
      const executor = this.executors[language];
      const result = await executor.execute(code, input);
      
      logger.info(`Execution completed: ${language} (status: ${result.status.description})`);
      return result;
    } catch (error) {
      logger.error(`Execution service error: ${error.message}`);
      return {
        success: false,
        stdout: '',
        stderr: `Execution error: ${error.message}`,
        compile_output: '',
        status: { id: 13, description: 'Internal Error' },
        time: 0,
        memory: 0,
      };
    } finally {
      this.activeExecutions--;
      logger.debug(`Execution finished (active: ${this.activeExecutions})`);
    }
  }

  /**
   * Check system status and available compilers
   * @returns {Promise<Object>} System status
   */
  async getSystemStatus() {
    const status = {
      activeExecutions: this.activeExecutions,
      maxConcurrentExecutions: this.maxConcurrent,
      compilers: {},
    };

    // Check each compiler
    for (const [lang, executor] of Object.entries(this.executors)) {
      const available = await executor.isAvailable();
      const version = available ? await executor.getVersion() : 'Not installed';
      
      status.compilers[lang] = {
        available,
        version,
      };
    }

    return status;
  }

  /**
   * Get active executions count
   * @returns {number}
   */
  getActiveExecutionsCount() {
    return this.activeExecutions;
  }
}

export default new ExecutionService();
