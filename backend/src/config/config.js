/**
 * Configuration for OmniCode Execution Engine
 */

export const config = {
  // Server Configuration
  port: process.env.PORT || 3001,
  host: process.env.HOST || 'localhost',
  
  // Execution Configuration
  execution: {
    maxExecutionTime: parseInt(process.env.MAX_EXECUTION_TIME) || 5000, // 5 seconds
    maxOutputSize: parseInt(process.env.MAX_OUTPUT_SIZE) || 1048576, // 1MB
    tempDirBase: process.env.TEMP_DIR || './temp',
    cleanupDelay: 5000, // 5 seconds after execution
  },
  
  // Compiler Paths (auto-detected or configured)
  compilers: {
    java: {
      compiler: process.env.JAVAC_PATH || 'javac',
      runner: process.env.JAVA_PATH || 'java',
      version: '11', // Minimum required version
    },
    c: {
      compiler: process.env.GCC_PATH || 'gcc',
      flags: ['-Wall', '-std=c11'],
      outputName: 'main',
    },
    cpp: {
      compiler: process.env.GPP_PATH || 'g++',
      flags: ['-Wall', '-std=c++17'],
      outputName: 'main',
    },
  },
  
  // Security Configuration
  security: {
    enableSandbox: process.env.ENABLE_SANDBOX === 'true',
    maxConcurrentExecutions: parseInt(process.env.MAX_CONCURRENT) || 5,
    allowedLanguages: ['java', 'c', 'cpp'],
  },
  
  // Logging Configuration
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    file: process.env.LOG_FILE || './logs/execution.log',
  },
};

export default config;
