/**
 * File Management Utility
 * Handles temporary file creation, cleanup, and directory management
 */

import fs from 'fs/promises';
import fsSync from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../config/config.js';
import logger from './logger.js';

class FileManager {
  constructor() {
    this.tempDirBase = config.execution.tempDirBase;
    this.ensureTempDir();
  }

  /**
   * Ensure base temp directory exists
   */
  ensureTempDir() {
    if (!fsSync.existsSync(this.tempDirBase)) {
      fsSync.mkdirSync(this.tempDirBase, { recursive: true });
      logger.info(`Created temp directory: ${this.tempDirBase}`);
    }
  }

  /**
   * Create a unique temporary directory for execution
   * @returns {Promise<string>} Path to the created directory
   */
  async createExecutionDir() {
    const uniqueId = uuidv4();
    const execDir = path.join(this.tempDirBase, `exec_${uniqueId}`);
    
    try {
      await fs.mkdir(execDir, { recursive: true });
      logger.debug(`Created execution directory: ${execDir}`);
      return execDir;
    } catch (error) {
      logger.error(`Failed to create execution directory: ${error.message}`);
      throw new Error(`Failed to create execution directory: ${error.message}`);
    }
  }

  /**
   * Write code to a file
   * @param {string} dirPath - Directory path
   * @param {string} filename - File name
   * @param {string} content - File content
   * @returns {Promise<string>} Full path to the created file
   */
  async writeCodeFile(dirPath, filename, content) {
    const filePath = path.join(dirPath, filename);
    
    try {
      await fs.writeFile(filePath, content, 'utf8');
      logger.debug(`Wrote code file: ${filePath}`);
      return filePath;
    } catch (error) {
      logger.error(`Failed to write code file: ${error.message}`);
      throw new Error(`Failed to write code file: ${error.message}`);
    }
  }

  /**
   * Write stdin input to a file
   * @param {string} dirPath - Directory path
   * @param {string} input - Input content
   * @returns {Promise<string>} Full path to the input file
   */
  async writeInputFile(dirPath, input) {
    const inputPath = path.join(dirPath, 'input.txt');
    
    try {
      await fs.writeFile(inputPath, input, 'utf8');
      logger.debug(`Wrote input file: ${inputPath}`);
      return inputPath;
    } catch (error) {
      logger.error(`Failed to write input file: ${error.message}`);
      throw new Error(`Failed to write input file: ${error.message}`);
    }
  }

  /**
   * Read file content
   * @param {string} filePath - Path to file
   * @returns {Promise<string>} File content
   */
  async readFile(filePath) {
    try {
      const content = await fs.readFile(filePath, 'utf8');
      return content;
    } catch (error) {
      logger.error(`Failed to read file ${filePath}: ${error.message}`);
      return '';
    }
  }

  /**
   * Check if file exists
   * @param {string} filePath - Path to file
   * @returns {Promise<boolean>}
   */
  async fileExists(filePath) {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Clean up execution directory
   * @param {string} dirPath - Directory to clean up
   * @param {number} delay - Delay before cleanup (ms)
   */
  async cleanupExecutionDir(dirPath, delay = config.execution.cleanupDelay) {
    setTimeout(async () => {
      try {
        await fs.rm(dirPath, { recursive: true, force: true });
        logger.debug(`Cleaned up execution directory: ${dirPath}`);
      } catch (error) {
        logger.error(`Failed to cleanup directory ${dirPath}: ${error.message}`);
      }
    }, delay);
  }

  /**
   * Get file size
   * @param {string} filePath - Path to file
   * @returns {Promise<number>} File size in bytes
   */
  async getFileSize(filePath) {
    try {
      const stats = await fs.stat(filePath);
      return stats.size;
    } catch (error) {
      return 0;
    }
  }

  /**
   * List files in directory
   * @param {string} dirPath - Directory path
   * @returns {Promise<string[]>} Array of file names
   */
  async listFiles(dirPath) {
    try {
      const files = await fs.readdir(dirPath);
      return files;
    } catch (error) {
      logger.error(`Failed to list files in ${dirPath}: ${error.message}`);
      return [];
    }
  }

  /**
   * Clean up old execution directories (older than 1 hour)
   */
  async cleanupOldDirectories() {
    try {
      const files = await fs.readdir(this.tempDirBase);
      const now = Date.now();
      const oneHour = 60 * 60 * 1000;

      for (const file of files) {
        if (file.startsWith('exec_')) {
          const dirPath = path.join(this.tempDirBase, file);
          const stats = await fs.stat(dirPath);
          
          if (now - stats.mtimeMs > oneHour) {
            await fs.rm(dirPath, { recursive: true, force: true });
            logger.info(`Cleaned up old directory: ${dirPath}`);
          }
        }
      }
    } catch (error) {
      logger.error(`Failed to cleanup old directories: ${error.message}`);
    }
  }
}

// Export singleton instance
export default new FileManager();
