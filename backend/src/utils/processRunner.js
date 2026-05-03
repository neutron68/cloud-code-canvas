/**
 * Process Runner Utility
 * Handles spawning and managing child processes with timeout and output capture
 */

import { spawn } from 'child_process';
import { config } from '../config/config.js';
import logger from './logger.js';
import fs from 'fs';

class ProcessRunner {
  /**
   * Execute a command with timeout and output capture
   * @param {string} command - Command to execute
   * @param {string[]} args - Command arguments
   * @param {Object} options - Execution options
   * @returns {Promise<Object>} Execution result
   */
  async execute(command, args = [], options = {}) {
    const {
      cwd = process.cwd(),
      timeout = config.execution.maxExecutionTime,
      input = '',
      maxOutputSize = config.execution.maxOutputSize,
    } = options;

    return new Promise((resolve) => {
      const startTime = Date.now();
      let stdout = '';
      let stderr = '';
      let killed = false;
      let outputSizeExceeded = false;

      logger.debug(`Executing: ${command} ${args.join(' ')}`, { cwd });

      // Spawn the process
      const childProcess = spawn(command, args, {
        cwd,
        shell: true,
        windowsHide: true,
      });

      // Set timeout
      const timeoutId = setTimeout(() => {
        if (!childProcess.killed) {
          killed = true;
          childProcess.kill('SIGKILL');
          logger.warn(`Process killed due to timeout: ${command}`);
        }
      }, timeout);

      // Handle stdout
      childProcess.stdout.on('data', (data) => {
        const chunk = data.toString();
        
        if (stdout.length + chunk.length > maxOutputSize) {
          outputSizeExceeded = true;
          childProcess.kill('SIGKILL');
          return;
        }
        
        stdout += chunk;
      });

      // Handle stderr
      childProcess.stderr.on('data', (data) => {
        const chunk = data.toString();
        
        if (stderr.length + chunk.length > maxOutputSize) {
          outputSizeExceeded = true;
          childProcess.kill('SIGKILL');
          return;
        }
        
        stderr += chunk;
      });

      // Handle process error
      childProcess.on('error', (error) => {
        clearTimeout(timeoutId);
        logger.error(`Process error: ${error.message}`);
        
        resolve({
          success: false,
          stdout: '',
          stderr: error.message,
          exitCode: -1,
          executionTime: Date.now() - startTime,
          killed: false,
          timeout: false,
        });
      });

      // Handle process exit
      childProcess.on('close', (exitCode) => {
        clearTimeout(timeoutId);
        const executionTime = Date.now() - startTime;

        logger.debug(`Process exited with code ${exitCode}`, { 
          executionTime,
          stdoutLength: stdout.length,
          stderrLength: stderr.length,
        });

        resolve({
          success: exitCode === 0 && !killed && !outputSizeExceeded,
          stdout: stdout.trim(),
          stderr: stderr.trim(),
          exitCode,
          executionTime,
          killed,
          timeout: killed,
          outputSizeExceeded,
        });
      });

      // Write input to stdin if provided
      if (input) {
        childProcess.stdin.write(input);
        childProcess.stdin.end();
      }
    });
  }

  /**
   * Execute command with input from file
   * @param {string} command - Command to execute
   * @param {string[]} args - Command arguments
   * @param {string} inputFile - Path to input file
   * @param {Object} options - Execution options
   * @returns {Promise<Object>} Execution result
   */
  async executeWithInputFile(command, args = [], inputFile, options = {}) {
    const {
      cwd = process.cwd(),
      timeout = config.execution.maxExecutionTime,
      maxOutputSize = config.execution.maxOutputSize,
    } = options;

    return new Promise((resolve) => {
      const startTime = Date.now();
      let stdout = '';
      let stderr = '';
      let killed = false;
      let outputSizeExceeded = false;

      logger.debug(`Executing with input file: ${command} ${args.join(' ')} < ${inputFile}`, { cwd });

      // Create read stream for input
      const inputStream = fs.createReadStream(inputFile);

      // Spawn the process
      const childProcess = spawn(command, args, {
        cwd,
        shell: true,
        windowsHide: true,
      });

      // Pipe input file to stdin
      inputStream.pipe(childProcess.stdin);

      // Set timeout
      const timeoutId = setTimeout(() => {
        if (!childProcess.killed) {
          killed = true;
          childProcess.kill('SIGKILL');
          logger.warn(`Process killed due to timeout: ${command}`);
        }
      }, timeout);

      // Handle stdout
      childProcess.stdout.on('data', (data) => {
        const chunk = data.toString();
        
        if (stdout.length + chunk.length > maxOutputSize) {
          outputSizeExceeded = true;
          childProcess.kill('SIGKILL');
          return;
        }
        
        stdout += chunk;
      });

      // Handle stderr
      childProcess.stderr.on('data', (data) => {
        const chunk = data.toString();
        
        if (stderr.length + chunk.length > maxOutputSize) {
          outputSizeExceeded = true;
          childProcess.kill('SIGKILL');
          return;
        }
        
        stderr += chunk;
      });

      // Handle process error
      childProcess.on('error', (error) => {
        clearTimeout(timeoutId);
        logger.error(`Process error: ${error.message}`);
        
        resolve({
          success: false,
          stdout: '',
          stderr: error.message,
          exitCode: -1,
          executionTime: Date.now() - startTime,
          killed: false,
          timeout: false,
        });
      });

      // Handle process exit
      childProcess.on('close', (exitCode) => {
        clearTimeout(timeoutId);
        const executionTime = Date.now() - startTime;

        resolve({
          success: exitCode === 0 && !killed && !outputSizeExceeded,
          stdout: stdout.trim(),
          stderr: stderr.trim(),
          exitCode,
          executionTime,
          killed,
          timeout: killed,
          outputSizeExceeded,
        });
      });
    });
  }

  /**
   * Check if a command is available
   * @param {string} command - Command to check
   * @returns {Promise<boolean>}
   */
  async isCommandAvailable(command) {
    try {
      const result = await this.execute(
        process.platform === 'win32' ? 'where' : 'which',
        [command],
        { timeout: 2000 }
      );
      return result.success;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get command version
   * @param {string} command - Command name
   * @param {string[]} versionArgs - Arguments to get version
   * @returns {Promise<string>} Version string
   */
  async getCommandVersion(command, versionArgs = ['--version']) {
    try {
      const result = await this.execute(command, versionArgs, { timeout: 2000 });
      if (result.success) {
        return result.stdout.split('\n')[0];
      }
      return 'Unknown';
    } catch (error) {
      return 'Unknown';
    }
  }
}

// Export singleton instance
export default new ProcessRunner();
