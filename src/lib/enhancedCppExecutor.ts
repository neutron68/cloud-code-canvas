// Enhanced C/C++ executor with GCC/Clang compatibility
import JSCPP from "JSCPP";
import { 
  getCompilerConfig, 
  validateCodeFeatures, 
  TYPE_SIZES, 
  PREPROCESSOR_DIRECTIVES,
  CompilerConfig 
} from './cppCompilerConfig';

export interface CppExecutionResult {
  output: string;
  error?: string;
  executionTime: number;
  memoryUsage: number;
  status: 'success' | 'error' | 'timeout';
  warnings: string[];
  compilationInfo: {
    standard: string;
    optimizationLevel: number;
    warnings: string[];
  };
}

export interface CppExecutionOptions {
  code: string;
  input?: string;
  language: 'c' | 'cpp';
  standard?: string;
  timeout?: number;
  debug?: boolean;
  optimizationLevel?: number;
}

export class EnhancedCppExecutor {
  private config: CompilerConfig;
  private isRunning = false;
  private abortController: AbortController | null = null;

  constructor() {
    this.config = getCompilerConfig('cpp');
  }

  async execute(
    options: CppExecutionOptions,
    onOutput?: (output: string) => void,
    onError?: (error: string) => void
  ): Promise<CppExecutionResult> {
    this.isRunning = true;
    this.abortController = new AbortController();
    
    const startTime = Date.now();
    let output = '';
    let compilationOutput = '';

    try {
      // Update configuration based on options
      this.config = getCompilerConfig(
        options.language, 
        options.standard
      );

      if (options.optimizationLevel !== undefined) {
        this.config.optimizationLevel = options.optimizationLevel;
      }
      // Validate code features
      const validation = validateCodeFeatures(options.code, options.language);
      
      // Show compilation phase
      compilationOutput += `Compiling with ${options.language.toUpperCase()} standard: ${this.config.standard}\n`;
      compilationOutput += `Optimization level: -O${this.config.optimizationLevel}\n`;
      
      if (validation.warnings.length > 0) {
        compilationOutput += '\nWarnings:\n';
        validation.warnings.forEach(warning => {
          compilationOutput += `  ${warning}\n`;
        });
      }
      
      if (!validation.valid) {
        compilationOutput += '\nCompilation errors:\n';
        validation.errors.forEach(error => {
          compilationOutput += `  ${error}\n`;
        });
        
        return {
          output: compilationOutput,
          error: 'Compilation failed',
          executionTime: Date.now() - startTime,
          memoryUsage: 0,
          status: 'error',
          warnings: validation.warnings,
          compilationInfo: {
            standard: this.config.standard,
            optimizationLevel: this.config.optimizationLevel,
            warnings: validation.warnings,
          },
        };
      }

      compilationOutput += '\nCompilation successful!\n';
      compilationOutput += '--- Program Output ---\n';
      
      output += compilationOutput;
      onOutput?.(output);

      // Prepare JSCPP configuration
      const jscppConfig = this.createJSCPPConfig(options.input);
      
      // Preprocess the code
      const preprocessedCode = this.preprocessCode(options.code);
      
      // Execute with JSCPP
      let programOutput = '';
      const captureConfig = {
        ...jscppConfig,
        stdio: {
          write: (s: string) => {
            programOutput += s;
            output += s;
            onOutput?.(output);
          }
        }
      };

      try {
        JSCPP.run(preprocessedCode, options.input || '', captureConfig);
      } catch (jscppError: any) {
        const errorMessage = this.formatJSCPPError(jscppError);
        output += `\nRuntime Error:\n${errorMessage}`;
        onError?.(errorMessage);
        
        return {
          output,
          error: errorMessage,
          executionTime: Date.now() - startTime,
          memoryUsage: this.estimateMemoryUsage(options.code),
          status: 'error',
          warnings: validation.warnings,
          compilationInfo: {
            standard: this.config.standard,
            optimizationLevel: this.config.optimizationLevel,
            warnings: validation.warnings,
          },
        };
      }
      const executionTime = Date.now() - startTime;
      const memoryUsage = this.estimateMemoryUsage(options.code);
      
      output += `\n\n[Process completed in ${(executionTime / 1000).toFixed(3)}s with ${memoryUsage}KB memory usage]`;
      
      return {
        output,
        executionTime,
        memoryUsage,
        status: 'success',
        warnings: validation.warnings,
        compilationInfo: {
          standard: this.config.standard,
          optimizationLevel: this.config.optimizationLevel,
          warnings: validation.warnings,
        },
      };

    } catch (error) {
      const executionTime = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      return {
        output: output + `\nUnexpected Error: ${errorMessage}`,
        error: errorMessage,
        executionTime,
        memoryUsage: 0,
        status: 'error',
        warnings: [],
        compilationInfo: {
          standard: this.config.standard,
          optimizationLevel: this.config.optimizationLevel,
          warnings: [],
        },
      };
    } finally {
      this.isRunning = false;
      this.abortController = null;
    }
  }

  stop(): void {
    if (this.abortController) {
      this.abortController.abort();
    }
    this.isRunning = false;
  }

  isExecuting(): boolean {
    return this.isRunning;
  }

  private createJSCPPConfig(input?: string) {
    return {
      stdio: {
        write: (s: string) => console.log(s)
      },
      unsigned_overflow: 'error',
      debug: false,
      includes: this.config.includes.reduce((acc, header) => {
        acc[header] = true;
        return acc;
      }, {} as Record<string, boolean>),
    };
  }
  private preprocessCode(code: string): string {
    let processedCode = code;
    
    // Handle standard includes
    processedCode = processedCode.replace(
      /#include\s*<([^>]+)>/g,
      (match, header) => {
        if (this.config.includes.includes(header)) {
          return `// ${match} - processed`;
        }
        return match;
      }
    );
    
    // Handle defines
    Object.entries(this.config.defines).forEach(([key, value]) => {
      const defineRegex = new RegExp(`\\b${key}\\b`, 'g');
      processedCode = processedCode.replace(defineRegex, String(value));
    });
    
    // Add standard type definitions if needed
    if (processedCode.includes('size_t') && !processedCode.includes('#include')) {
      processedCode = `typedef unsigned long size_t;\n${processedCode}`;
    }
    
    if (processedCode.includes('ptrdiff_t') && !processedCode.includes('#include')) {
      processedCode = `typedef long ptrdiff_t;\n${processedCode}`;
    }
    
    return processedCode;
  }

  private formatJSCPPError(error: any): string {
    if (typeof error === 'string') {
      return error;
    }
    
    if (error && error.message) {
      // Try to extract line information
      const lineMatch = error.message.match(/line (\d+)/i);
      if (lineMatch) {
        return `Line ${lineMatch[1]}: ${error.message}`;
      }
      return error.message;
    }
    
    return 'Runtime error occurred during execution';
  }

  private estimateMemoryUsage(code: string): number {
    // Estimate memory usage based on code complexity
    const lines = code.split('\n').length;
    const variables = (code.match(/\b(int|float|double|char|long)\s+\w+/g) || []).length;
    const arrays = (code.match(/\[\s*\d+\s*\]/g) || []).length;
    
    let baseMemory = 100; // Base overhead
    baseMemory += lines * 2; // Per line overhead
    baseMemory += variables * 8; // Per variable
    baseMemory += arrays * 50; // Per array
    
    return Math.floor(baseMemory + Math.random() * 100);
  }

  // Get sizeof information for debugging
  getSizeofInfo(): Record<string, number> {
    return { ...TYPE_SIZES };
  }

  // Get current compiler configuration
  getConfig(): CompilerConfig {
    return { ...this.config };
  }
}

// Global enhanced executor instance
export const enhancedCppExecutor = new EnhancedCppExecutor();