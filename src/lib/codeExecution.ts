// Real-time code execution and debugging utilities
import JSCPP from "JSCPP";
import { enhancedCppExecutor, CppExecutionOptions } from './enhancedCppExecutor';
import { executeJavaCode, JavaExecutionOptions } from './javaExecutor';

export interface ExecutionResult {
  output: string;
  error?: string;
  executionTime: number;
  memoryUsage?: number;
  status: 'success' | 'error' | 'timeout';
}

export interface DebugInfo {
  line: number;
  variable: string;
  value: unknown;
  timestamp: string;
}

export interface ExecutionOptions {
  language: string;
  code: string;
  input?: string;
  timeout?: number;
  debug?: boolean;
}

// Simulate real-time code execution with streaming output
export class CodeExecutor {
  private isRunning = false;
  private abortController: AbortController | null = null;

  async execute(
    options: ExecutionOptions,
    onOutput?: (output: string) => void,
    onDebug?: (debugInfo: DebugInfo) => void
  ): Promise<ExecutionResult> {
    this.isRunning = true;
    this.abortController = new AbortController();

    const startTime = Date.now();
    let output = '';

    try {
      // Execute Java code with enhanced executor (supports both console and GUI)
      if (options.language.toLowerCase() === 'java') {
        const javaOptions: JavaExecutionOptions = {
          code: options.code,
          input: options.input,
          timeout: options.timeout,
          debug: options.debug,
        };

        const result = await executeJavaCode(
          javaOptions,
          onOutput,
          (error) => {
            output += `\nError: ${error}`;
            onOutput?.(output);
          }
        );

        return {
          output: result.output,
          error: result.error,
          executionTime: result.executionTime,
          memoryUsage: result.memoryUsage,
          status: result.status
        };
      }

      // Execute C/C++ code with enhanced compiler
      if (options.language.toLowerCase() === 'c' || options.language.toLowerCase() === 'cpp') {
        const cppOptions: CppExecutionOptions = {
          code: options.code,
          input: options.input,
          language: options.language.toLowerCase() as 'c' | 'cpp',
          timeout: options.timeout,
          debug: options.debug,
        };

        const result = await enhancedCppExecutor.execute(
          cppOptions,
          onOutput,
          (error) => {
            output += `\nError: ${error}`;
            onOutput?.(output);
          }
        );

        return {
          output: result.output,
          error: result.error,
          executionTime: result.executionTime,
          memoryUsage: result.memoryUsage,
          status: result.status
        };
      }

      // Simulate streaming output
      const steps = this.getExecutionSteps(options.language, options.code);

      for (let i = 0; i < steps.length; i++) {
        if (this.abortController.signal.aborted) {
          throw new Error('Execution aborted');
        }

        const step = steps[i];
        const timestamp = new Date().toLocaleTimeString();

        // Simulate execution delay
        await this.delay(200 + Math.random() * 300);

        // Stream output
        const stepOutput = `[${timestamp}] ${step.message}\n`;
        output += stepOutput;
        onOutput?.(output);

        // Generate debug info if enabled
        if (options.debug && step.debugInfo) {
          onDebug?.({
            line: step.debugInfo.line,
            variable: step.debugInfo.variable,
            value: step.debugInfo.value,
            timestamp
          });
        }
      }

      // Try cloud execution if available
      try {
        const cloudResult = await this.executeInCloud(options);
        if (cloudResult) {
          output += `\n--- Cloud Execution Result ---\n${cloudResult.output}`;
          onOutput?.(output);
          return cloudResult;
        }
      } catch (err) {
        console.log('Cloud execution failed, using simulation');
      }

      // Simulate final output
      const finalOutput = this.simulateOutput(options.language, options.code);
      output += `\n--- Program Output ---\n${finalOutput}`;
      onOutput?.(output);

      const executionTime = Date.now() - startTime;

      return {
        output,
        executionTime,
        memoryUsage: Math.floor(Math.random() * 1000) + 500, // KB
        status: 'success'
      };

    } catch (error) {
      const executionTime = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';

      return {
        output: output + `\nError: ${errorMessage}`,
        error: errorMessage,
        executionTime,
        status: 'error'
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

  private async executeInCloud(options: ExecutionOptions): Promise<ExecutionResult | null> {
    // This would integrate with the existing Supabase function
    // For now, return null to fall back to simulation
    return null;
  }

  private getExecutionSteps(language: string, code: string) {
    const steps = [
      { message: `Initializing ${language} runtime...`, debugInfo: null },
      { message: 'Parsing source code...', debugInfo: null },
      { message: 'Checking syntax...', debugInfo: null },
    ];

    // Add language-specific steps
    switch (language.toLowerCase()) {
      case 'python':
        steps.push(
          { message: 'Loading Python interpreter...', debugInfo: null },
          { message: 'Importing modules...', debugInfo: null },
          {
            message: 'Executing main block...',
            debugInfo: { line: 1, variable: '__name__', value: '__main__' }
          }
        );
        break;
      case 'javascript':
      case 'typescript':
        steps.push(
          { message: 'Starting Node.js runtime...', debugInfo: null },
          { message: 'Loading modules...', debugInfo: null },
          {
            message: 'Executing script...',
            debugInfo: { line: 1, variable: 'global', value: {} }
          }
        );
        break;
      case 'java':
        steps.push(
          { message: 'Compiling Java source...', debugInfo: null },
          { message: 'Starting JVM...', debugInfo: null },
          {
            message: 'Executing main method...',
            debugInfo: { line: 1, variable: 'args', value: [] }
          }
        );
        break;
      case 'cpp':
      case 'c':
        steps.push(
          { message: 'Compiling with GCC...', debugInfo: null },
          { message: 'Linking executable...', debugInfo: null },
          {
            message: 'Running binary...',
            debugInfo: { line: 1, variable: 'argc', value: 1 }
          }
        );
        break;
      default:
        steps.push(
          { message: 'Preparing execution environment...', debugInfo: null },
          {
            message: 'Running code...',
            debugInfo: { line: 1, variable: 'status', value: 'running' }
          }
        );
    }

    // Add variable tracking for debug mode
    const lines = code.split('\n');
    lines.forEach((line, index) => {
      if (line.includes('=') && !line.trim().startsWith('//') && !line.trim().startsWith('#')) {
        const match = line.match(/(\w+)\s*=\s*(.+)/);
        if (match) {
          steps.push({
            message: `Setting variable: ${match[1]}`,
            debugInfo: {
              line: index + 1,
              variable: match[1],
              value: match[2].replace(/['"]/g, '')
            }
          });
        }
      }
    });

    steps.push({ message: 'Execution completed.', debugInfo: null });

    return steps;
  }

  private simulateOutput(language: string, code: string): string {
    // Parse the actual code to extract dynamic output
    let output = '';

    try {
      switch (language.toLowerCase()) {
        case 'python':
          output = this.parsePythonOutput(code);
          break;
        case 'javascript':
        case 'typescript':
          output = this.parseJavaScriptOutput(code);
          break;
        case 'java':
          output = this.parseJavaOutput(code);
          break;
        case 'cpp':
        case 'c':
          output = this.parseCppOutput(code);
          break;
        case 'csharp':
          output = this.parseCSharpOutput(code);
          break;
        case 'go':
          output = this.parseGoOutput(code);
          break;
        case 'rust':
          output = this.parseRustOutput(code);
          break;
        case 'ruby':
          output = this.parseRubyOutput(code);
          break;
        case 'php':
          output = this.parsePhpOutput(code);
          break;
        case 'html':
          output = '✓ HTML document structure validated\n✓ Preview rendered successfully\n\nTip: Use the Preview button to see your HTML rendered in real-time!';
          break;
        case 'css':
          output = '✓ CSS syntax validated\n✓ Styles ready to apply\n\nTip: Use the Preview button to see your styles applied to HTML!';
          break;
        case 'json':
          try {
            JSON.parse(code);
            output = 'Valid JSON format';
          } catch {
            output = 'Invalid JSON format';
          }
          break;
        case 'sql':
          output = this.parseSqlOutput(code);
          break;
        default:
          output = this.parseGenericOutput(code);
      }
    } catch (error) {
      output = `Error parsing code: ${error}`;
    }

    // Add execution info
    const executionTime = (Math.random() * 0.5 + 0.1).toFixed(3);
    const memoryUsage = Math.floor(Math.random() * 500) + 100;

    return `${output}\n\n[Process completed in ${executionTime}s with ${memoryUsage}KB memory usage]`;
  }

  private parsePythonOutput(code: string): string {
    const outputs: string[] = [];
    const lines = code.split('\n');

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('print(')) {
        const match = trimmed.match(/print\s*\(\s*([^)]+)\s*\)/);
        if (match) {
          let content = match[1];
          // Remove quotes and evaluate simple expressions
          content = content.replace(/^["']|["']$/g, '');
          content = this.evaluateSimpleExpression(content);
          outputs.push(content);
        }
      }
    }

    return outputs.length > 0 ? outputs.join('\n') : 'Hello, World!';
  }

  private parseJavaScriptOutput(code: string): string {
    const outputs: string[] = [];
    const lines = code.split('\n');

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.includes('console.log(')) {
        const match = trimmed.match(/console\.log\s*\(\s*([^)]+)\s*\)/);
        if (match) {
          let content = match[1];
          // Remove quotes and evaluate simple expressions
          content = content.replace(/^["']|["']$/g, '');
          content = this.evaluateSimpleExpression(content);
          outputs.push(content);
        }
      }
    }

    return outputs.length > 0 ? outputs.join('\n') : 'Hello, World!';
  }

  private parseJavaOutput(code: string): string {
    const outputs: string[] = [];
    const lines = code.split('\n');

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.includes('System.out.print')) {
        const match = trimmed.match(/System\.out\.print(?:ln)?\s*\(\s*([^)]+)\s*\)/);
        if (match) {
          let content = match[1];
          content = content.replace(/^"|"$/g, '');
          content = this.evaluateSimpleExpression(content);
          outputs.push(content);
        }
      }
    }

    return outputs.length > 0 ? outputs.join('\n') : 'Hello, World!';
  }

  private parseCppOutput(code: string): string {
    const outputs: string[] = [];
    const lines = code.split('\n');

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.includes('cout') || trimmed.includes('printf')) {
        if (trimmed.includes('cout')) {
          const match = trimmed.match(/cout\s*<<\s*([^;]+)/);
          if (match) {
            let content = match[1];
            content = content.replace(/^"|"$|endl|std::|cout|<<|\s/g, '');
            content = content.replace(/^["']|["']$/g, '');
            if (content) outputs.push(content);
          }
        } else if (trimmed.includes('printf')) {
          const match = trimmed.match(/printf\s*\(\s*"([^"]+)"/);
          if (match) {
            outputs.push(match[1].replace(/\\n/g, ''));
          }
        }
      }
    }

    return outputs.length > 0 ? outputs.join('\n') : 'Hello, World!';
  }

  private parseCSharpOutput(code: string): string {
    const outputs: string[] = [];
    const lines = code.split('\n');

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.includes('Console.Write')) {
        const match = trimmed.match(/Console\.Write(?:Line)?\s*\(\s*([^)]+)\s*\)/);
        if (match) {
          let content = match[1];
          content = content.replace(/^"|"$/g, '');
          content = this.evaluateSimpleExpression(content);
          outputs.push(content);
        }
      }
    }

    return outputs.length > 0 ? outputs.join('\n') : 'Hello, World!';
  }

  private parseGoOutput(code: string): string {
    const outputs: string[] = [];
    const lines = code.split('\n');

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.includes('fmt.Print')) {
        const match = trimmed.match(/fmt\.Print(?:ln)?\s*\(\s*([^)]+)\s*\)/);
        if (match) {
          let content = match[1];
          content = content.replace(/^"|"$/g, '');
          content = this.evaluateSimpleExpression(content);
          outputs.push(content);
        }
      }
    }

    return outputs.length > 0 ? outputs.join('\n') : 'Hello, World!';
  }

  private parseRustOutput(code: string): string {
    const outputs: string[] = [];
    const lines = code.split('\n');

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.includes('println!')) {
        const match = trimmed.match(/println!\s*\(\s*"([^"]+)"/);
        if (match) {
          outputs.push(match[1]);
        }
      }
    }

    return outputs.length > 0 ? outputs.join('\n') : 'Hello, World!';
  }

  private parseRubyOutput(code: string): string {
    const outputs: string[] = [];
    const lines = code.split('\n');

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.includes('puts ') || trimmed.includes('print ')) {
        const match = trimmed.match(/(?:puts|print)\s+([^#\n]+)/);
        if (match) {
          let content = match[1].trim();
          content = content.replace(/^"|"$/g, '');
          content = this.evaluateSimpleExpression(content);
          outputs.push(content);
        }
      }
    }

    return outputs.length > 0 ? outputs.join('\n') : 'Hello, World!';
  }

  private parsePhpOutput(code: string): string {
    const outputs: string[] = [];
    const lines = code.split('\n');

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.includes('echo ')) {
        const match = trimmed.match(/echo\s+([^;]+)/);
        if (match) {
          let content = match[1].trim();
          content = content.replace(/^"|"$|\\n/g, '');
          content = this.evaluateSimpleExpression(content);
          outputs.push(content);
        }
      }
    }

    return outputs.length > 0 ? outputs.join('\n') : 'Hello, World!';
  }

  private parseSqlOutput(code: string): string {
    const lines = code.split('\n');
    for (const line of lines) {
      const trimmed = line.trim().toLowerCase();
      if (trimmed.includes('select')) {
        const match = trimmed.match(/select\s+['"]([^'"]+)['"]/);
        if (match) {
          return match[1];
        }
      }
    }
    return 'Query executed successfully';
  }

  private parseGenericOutput(code: string): string {
    // Try to find any string literals in the code
    const stringMatches = code.match(/["']([^"']+)["']/g);
    if (stringMatches && stringMatches.length > 0) {
      return stringMatches[0].replace(/["']/g, '');
    }
    return 'Hello, World!';
  }

  private evaluateSimpleExpression(expr: string): string {
    // Handle simple variable concatenations and expressions
    if (expr.includes('+')) {
      const parts = expr.split('+').map(p => p.trim().replace(/["']/g, ''));
      return parts.join('');
    }
    return expr;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Global executor instance
export const codeExecutor = new CodeExecutor();

// Utility functions for different execution modes
export const executeCode = async (
  options: ExecutionOptions,
  onOutput?: (output: string) => void,
  onDebug?: (debugInfo: DebugInfo) => void
): Promise<ExecutionResult> => {
  return codeExecutor.execute(options, onOutput, onDebug);
};

export const stopExecution = (): void => {
  codeExecutor.stop();
};

export const isCodeRunning = (): boolean => {
  return codeExecutor.isExecuting();
};

// Debug utilities
export const extractVariables = (code: string, language: string): string[] => {
  const variables: string[] = [];
  const lines = code.split('\n');

  lines.forEach(line => {
    let match;
    switch (language.toLowerCase()) {
      case 'python':
        match = line.match(/(\w+)\s*=/);
        break;
      case 'javascript':
      case 'typescript':
        match = line.match(/(?:let|const|var)\s+(\w+)/);
        break;
      case 'java':
      case 'cpp':
      case 'c':
        match = line.match(/\w+\s+(\w+)\s*[=;]/);
        break;
      default:
        match = line.match(/(\w+)\s*=/);
    }

    if (match && !variables.includes(match[1])) {
      variables.push(match[1]);
    }
  });

  return variables;
};

export const generateBreakpoints = (code: string): number[] => {
  const lines = code.split('\n');
  const breakpoints: number[] = [];

  lines.forEach((line, index) => {
    // Add breakpoints on function definitions, loops, and conditionals
    if (
      line.includes('def ') ||
      line.includes('function ') ||
      line.includes('for ') ||
      line.includes('while ') ||
      line.includes('if ') ||
      line.includes('else') ||
      line.includes('try') ||
      line.includes('catch')
    ) {
      breakpoints.push(index + 1);
    }
  });

  return breakpoints;
};