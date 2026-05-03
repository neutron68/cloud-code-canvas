/**
 * Java Code Executor
 * Compiles and executes Java code
 */

import path from 'path';
import { config } from '../../config/config.js';
import fileManager from '../../utils/fileManager.js';
import processRunner from '../../utils/processRunner.js';
import logger from '../../utils/logger.js';

class JavaExecutor {
  constructor() {
    this.compiler = config.compilers.java.compiler;
    this.runner = config.compilers.java.runner;
  }

  /**
   * Execute Java code
   * @param {string} code - Java source code
   * @param {string} input - Standard input
   * @returns {Promise<Object>} Execution result
   */
  async execute(code, input = '') {
    const startTime = Date.now();
    let execDir = null;

    try {
      // Create execution directory
      execDir = await fileManager.createExecutionDir();

      // Extract class name from code
      const className = this.extractClassName(code);
      if (!className) {
        throw new Error('Could not find public class declaration in Java code');
      }

      // Write source file
      const sourceFile = await fileManager.writeCodeFile(
        execDir,
        `${className}.java`,
        code
      );

      logger.info(`Compiling Java code: ${className}`);

      // Compile Java code
      const compileResult = await processRunner.execute(
        this.compiler,
        ['-encoding', 'UTF-8', `${className}.java`],
        { cwd: execDir, timeout: 10000 }
      );

      if (!compileResult.success) {
        logger.warn(`Java compilation failed: ${compileResult.stderr}`);
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

      logger.info(`Running Java code: ${className}`);

      // Run Java code
      let runResult;
      if (input) {
        // Write input to file
        const inputFile = await fileManager.writeInputFile(execDir, input);
        runResult = await processRunner.executeWithInputFile(
          this.runner,
          ['-Dfile.encoding=UTF-8', className],
          inputFile,
          { cwd: execDir }
        );
      } else {
        runResult = await processRunner.execute(
          this.runner,
          ['-Dfile.encoding=UTF-8', className],
          { cwd: execDir, input }
        );
      }

      // Handle timeout
      if (runResult.timeout) {
        logger.warn(`Java execution timeout: ${className}`);
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
        logger.warn(`Java runtime error: ${runResult.stderr}`);
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
      logger.info(`Java execution successful: ${className}`);
      return {
        success: true,
        stdout: runResult.stdout,
        stderr: runResult.stderr,
        compile_output: compileResult.stdout,
        status: { id: 3, description: 'Accepted' },
        time: runResult.executionTime / 1000,
        memory: 0, // Java memory tracking would require additional tools
      };

    } catch (error) {
      logger.error(`Java execution error: ${error.message}`);
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
   * Extract class name from Java code
   * @param {string} code - Java source code
   * @returns {string|null} Class name or null
   */
  extractClassName(code) {
    // Look for public class declaration
    const publicClassMatch = code.match(/public\s+class\s+(\w+)/);
    if (publicClassMatch) {
      return publicClassMatch[1];
    }

    // Look for any class declaration
    const classMatch = code.match(/class\s+(\w+)/);
    if (classMatch) {
      return classMatch[1];
    }

    return null;
  }

  /**
   * Check if Java compiler is available
   * @returns {Promise<boolean>}
   */
  async isAvailable() {
    const javacAvailable = await processRunner.isCommandAvailable(this.compiler);
    const javaAvailable = await processRunner.isCommandAvailable(this.runner);
    return javacAvailable && javaAvailable;
  }

  /**
   * Get Java version
   * @returns {Promise<string>}
   */
  async getVersion() {
    return await processRunner.getCommandVersion(this.runner, ['-version']);
  }
}

export default new JavaExecutor();
