/**
 * C Code Executor
 * Compiles and executes C code
 */

import path from 'path';
import { config } from '../../config/config.js';
import fileManager from '../../utils/fileManager.js';
import processRunner from '../../utils/processRunner.js';
import logger from '../../utils/logger.js';

class CExecutor {
  constructor() {
    this.compiler = config.compilers.c.compiler;
    this.flags = config.compilers.c.flags;
    this.outputName = config.compilers.c.outputName;
  }

  /**
   * Execute C code
   * @param {string} code - C source code
   * @param {string} input - Standard input
   * @returns {Promise<Object>} Execution result
   */
  async execute(code, input = '') {
    const startTime = Date.now();
    let execDir = null;

    try {
      // Create execution directory
      execDir = await fileManager.createExecutionDir();

      // Write source file
      const sourceFile = await fileManager.writeCodeFile(
        execDir,
        'main.c',
        code
      );

      logger.info('Compiling C code');

      // Determine executable name based on platform
      const executableName = process.platform === 'win32' 
        ? `${this.outputName}.exe` 
        : this.outputName;

      // Compile C code
      const compileArgs = [
        ...this.flags,
        'main.c',
        '-o',
        executableName,
        '-lm', // Link math library
      ];

      const compileResult = await processRunner.execute(
        this.compiler,
        compileArgs,
        { cwd: execDir, timeout: 10000 }
      );

      if (!compileResult.success) {
        logger.warn(`C compilation failed: ${compileResult.stderr}`);
        return {
          success: false,
          stdout: '',
          stderr: compileResult.stderr || compileResult.stdout,
          compile_output: compileResult.stderr || compileResult.stdout,
          status: { id: 6, description: 'Compilation Error' },
          time: (Date.now() - startTime) / 1000,
          memory: 0,
        };
      }

      logger.info('Running C code');

      // Run compiled executable
      const executablePath = process.platform === 'win32'
        ? executableName
        : `./${executableName}`;

      let runResult;
      if (input) {
        // Write input to file
        const inputFile = await fileManager.writeInputFile(execDir, input);
        runResult = await processRunner.executeWithInputFile(
          executablePath,
          [],
          inputFile,
          { cwd: execDir }
        );
      } else {
        runResult = await processRunner.execute(
          executablePath,
          [],
          { cwd: execDir, input }
        );
      }

      // Handle timeout
      if (runResult.timeout) {
        logger.warn('C execution timeout');
        return {
          success: false,
          stdout: runResult.stdout,
          stderr: 'Time Limit Exceeded',
          compile_output: '',
          status: { id: 5, description: 'Time Limit Exceeded' },
          time: config.execution.maxExecutionTime / 1000,
          memory: 0,
        };
      }

      // Handle runtime error
      if (!runResult.success && runResult.stderr) {
        logger.warn(`C runtime error: ${runResult.stderr}`);
        return {
          success: false,
          stdout: runResult.stdout,
          stderr: runResult.stderr,
          compile_output: '',
          status: { id: 11, description: 'Runtime Error' },
          time: runResult.executionTime / 1000,
          memory: 0,
        };
      }

      // Success
      logger.info('C execution successful');
      return {
        success: true,
        stdout: runResult.stdout,
        stderr: runResult.stderr,
        compile_output: compileResult.stdout,
        status: { id: 3, description: 'Accepted' },
        time: runResult.executionTime / 1000,
        memory: 0,
      };

    } catch (error) {
      logger.error(`C execution error: ${error.message}`);
      return {
        success: false,
        stdout: '',
        stderr: error.message,
        compile_output: '',
        status: { id: 13, description: 'Internal Error' },
        time: (Date.now() - startTime) / 1000,
        memory: 0,
      };
    } finally {
      // Cleanup
      if (execDir) {
        fileManager.cleanupExecutionDir(execDir);
      }
    }
  }

  /**
   * Check if C compiler is available
   * @returns {Promise<boolean>}
   */
  async isAvailable() {
    return await processRunner.isCommandAvailable(this.compiler);
  }

  /**
   * Get GCC version
   * @returns {Promise<string>}
   */
  async getVersion() {
    return await processRunner.getCommandVersion(this.compiler, ['--version']);
  }
}

export default new CExecutor();
