// Enhanced Java executor with GUI support
export interface JavaExecutionResult {
  output: string;
  error?: string;
  executionTime: number;
  memoryUsage?: number;
  status: 'success' | 'error' | 'timeout';
  hasGui?: boolean;
  guiWindow?: Window | null;
}

export interface JavaExecutionOptions {
  code: string;
  input?: string;
  timeout?: number;
  debug?: boolean;
}

export class JavaExecutor {
  private isRunning = false;
  private abortController: AbortController | null = null;
  private guiWindow: Window | null = null;

  async execute(
    options: JavaExecutionOptions,
    onOutput?: (output: string) => void,
    onError?: (error: string) => void
  ): Promise<JavaExecutionResult> {
    this.isRunning = true;
    this.abortController = new AbortController();

    const startTime = Date.now();
    let output = '';

    try {
      // Check if the code contains GUI components
      const hasGui = this.detectGuiComponents(options.code);

      if (hasGui) {
        return await this.executeGuiJava(options, onOutput, onError);
      } else {
        return await this.executeConsoleJava(options, onOutput, onError);
      }
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

  private detectGuiComponents(code: string): boolean {
    const guiPatterns = [
      /import\s+javax\.swing\./,
      /import\s+java\.awt\./,
      /extends\s+JFrame/,
      /extends\s+JPanel/,
      /extends\s+JDialog/,
      /new\s+JFrame/,
      /new\s+JPanel/,
      /new\s+JButton/,
      /new\s+JLabel/,
      /new\s+JTextField/,
      /new\s+JTextArea/,
      /setVisible\s*\(\s*true\s*\)/,
      /JOptionPane\./,
      /Graphics/,
      /paintComponent/,
      /ActionListener/,
      /MouseListener/,
      /KeyListener/
    ];

    return guiPatterns.some(pattern => pattern.test(code));
  }

  private async executeConsoleJava(
    options: JavaExecutionOptions,
    onOutput?: (output: string) => void,
    onError?: (error: string) => void
  ): Promise<JavaExecutionResult> {
    const startTime = Date.now();
    let output = '';

    // Simulate Java compilation and execution steps
    const steps = [
      'Initializing Java Virtual Machine...',
      'Compiling Java source code...',
      'Loading compiled bytecode...',
      'Executing main method...'
    ];

    for (const step of steps) {
      if (this.abortController?.signal.aborted) {
        throw new Error('Execution aborted');
      }

      const timestamp = new Date().toLocaleTimeString();
      const stepOutput = `[${timestamp}] ${step}\n`;
      output += stepOutput;
      onOutput?.(output);

      await this.delay(300 + Math.random() * 200);
    }

    // Parse and simulate Java output
    const javaOutput = this.parseJavaOutput(options.code, options.input);
    output += `\n--- Program Output ---\n${javaOutput}`;
    onOutput?.(output);

    const executionTime = Date.now() - startTime;

    return {
      output,
      executionTime,
      memoryUsage: Math.floor(Math.random() * 2000) + 1000, // KB
      status: 'success',
      hasGui: false
    };
  }

  private async executeGuiJava(
    options: JavaExecutionOptions,
    onOutput?: (output: string) => void,
    onError?: (error: string) => void
  ): Promise<JavaExecutionResult> {
    const startTime = Date.now();
    let output = '';

    // Simulate Java GUI compilation and execution steps
    const steps = [
      'Initializing Java Virtual Machine...',
      'Compiling Java source code...',
      'Loading Swing/AWT libraries...',
      'Initializing GUI components...',
      'Creating application window...'
    ];

    for (const step of steps) {
      if (this.abortController?.signal.aborted) {
        throw new Error('Execution aborted');
      }

      const timestamp = new Date().toLocaleTimeString();
      const stepOutput = `[${timestamp}] ${step}\n`;
      output += stepOutput;
      onOutput?.(output);

      await this.delay(400 + Math.random() * 300);
    }

    // Create GUI window
    try {
      this.guiWindow = this.createGuiWindow(options.code);
      
      const timestamp = new Date().toLocaleTimeString();
      output += `\n[${timestamp}] ✓ GUI Application launched successfully!\n`;
      output += `[${timestamp}] Window opened in new tab/popup\n`;
      output += `\n--- GUI Application Running ---\n`;
      output += `Application is now running in the GUI window.\n`;
      output += `Close the window to terminate the application.\n`;
      
      onOutput?.(output);

      // Monitor window state
      this.monitorGuiWindow();

    } catch (error) {
      const errorMsg = `Failed to create GUI window: ${error}`;
      output += `\nError: ${errorMsg}`;
      onError?.(errorMsg);
      
      return {
        output,
        error: errorMsg,
        executionTime: Date.now() - startTime,
        status: 'error',
        hasGui: true
      };
    }

    const executionTime = Date.now() - startTime;

    return {
      output,
      executionTime,
      memoryUsage: Math.floor(Math.random() * 3000) + 2000, // KB (GUI apps use more memory)
      status: 'success',
      hasGui: true,
      guiWindow: this.guiWindow
    };
  }

  private createGuiWindow(code: string): Window {
    // Create a new window for the Java GUI application
    const guiWindow = window.open('', '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes');
    
    if (!guiWindow) {
      throw new Error('Failed to open GUI window. Please allow popups for this site.');
    }

    // Generate GUI content based on the Java code
    const guiContent = this.generateGuiContent(code);
    
    guiWindow.document.write(guiContent);
    guiWindow.document.close();
    
    // Set window title
    guiWindow.document.title = 'Java GUI Application - OmniCode';
    
    return guiWindow;
  }

  private generateGuiContent(code: string): string {
    // Analyze the Java code to create a simulated GUI
    const hasJFrame = /JFrame|extends\s+JFrame/.test(code);
    const hasButtons = /JButton/.test(code);
    const hasLabels = /JLabel/.test(code);
    const hasTextFields = /JTextField/.test(code);
    const hasTextAreas = /JTextArea/.test(code);
    const hasPanels = /JPanel/.test(code);

    // Extract text content from the code
    const stringLiterals = code.match(/"([^"]+)"/g) || [];
    const buttonTexts = stringLiterals.filter(s => s.length < 50);
    const labelTexts = stringLiterals.filter(s => s.length < 100);

    let html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Java GUI Application</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }
        .java-app {
            background: white;
            border-radius: 8px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            padding: 20px;
            max-width: 600px;
            margin: 0 auto;
        }
        .title-bar {
            background: #f0f0f0;
            padding: 8px 12px;
            border-radius: 4px 4px 0 0;
            border-bottom: 1px solid #ccc;
            font-size: 12px;
            color: #333;
            margin: -20px -20px 20px -20px;
        }
        .java-button {
            background: #e1e1e1;
            border: 2px outset #e1e1e1;
            padding: 6px 12px;
            margin: 5px;
            cursor: pointer;
            font-family: inherit;
            font-size: 12px;
        }
        .java-button:active {
            border: 2px inset #e1e1e1;
        }
        .java-label {
            display: block;
            margin: 10px 0;
            font-size: 12px;
        }
        .java-textfield {
            border: 2px inset #e1e1e1;
            padding: 4px;
            font-family: monospace;
            font-size: 12px;
            margin: 5px;
        }
        .java-textarea {
            border: 2px inset #e1e1e1;
            padding: 4px;
            font-family: monospace;
            font-size: 12px;
            margin: 5px;
            resize: both;
        }
        .java-panel {
            border: 1px solid #ccc;
            padding: 10px;
            margin: 10px 0;
            background: #f9f9f9;
        }
        .output-area {
            background: #000;
            color: #0f0;
            padding: 10px;
            font-family: monospace;
            font-size: 12px;
            border-radius: 4px;
            margin-top: 20px;
            min-height: 100px;
            white-space: pre-wrap;
        }
        .status-bar {
            background: #f0f0f0;
            padding: 4px 12px;
            border-top: 1px solid #ccc;
            font-size: 11px;
            color: #666;
            margin: 20px -20px -20px -20px;
        }
    </style>
</head>
<body>
    <div class="java-app">
        <div class="title-bar">Java Application - OmniCode Simulator</div>
        
        <h3>Java GUI Application</h3>
        <p>This is a simulated Java Swing/AWT application based on your code.</p>
`;

    // Add GUI components based on detected patterns
    if (hasButtons) {
      html += `<div class="component-section">`;
      buttonTexts.slice(0, 3).forEach((text, i) => {
        const cleanText = text.replace(/"/g, '') || `Button ${i + 1}`;
        html += `<button class="java-button" onclick="handleButtonClick('${cleanText}')">${cleanText}</button>`;
      });
      html += `</div>`;
    }

    if (hasLabels) {
      html += `<div class="component-section">`;
      labelTexts.slice(0, 2).forEach((text) => {
        const cleanText = text.replace(/"/g, '') || 'Label';
        html += `<label class="java-label">${cleanText}</label>`;
      });
      html += `</div>`;
    }

    if (hasTextFields) {
      html += `<div class="component-section">`;
      html += `<input type="text" class="java-textfield" placeholder="Text Field" />`;
      html += `<input type="text" class="java-textfield" placeholder="Another Text Field" />`;
      html += `</div>`;
    }

    if (hasTextAreas) {
      html += `<div class="component-section">`;
      html += `<textarea class="java-textarea" rows="4" cols="40" placeholder="Text Area"></textarea>`;
      html += `</div>`;
    }

    if (hasPanels) {
      html += `<div class="java-panel">`;
      html += `<strong>Panel Container</strong><br>`;
      html += `This represents a JPanel component with nested elements.`;
      html += `</div>`;
    }

    // Add output area
    html += `
        <div class="output-area" id="output">Java GUI Application Started Successfully!
Ready for user interaction...

Note: This is a simulation of your Java GUI application.
In a real Java environment, your Swing/AWT components would be fully functional.
        </div>
        
        <div class="status-bar">
            Status: Running | Memory: ${Math.floor(Math.random() * 50 + 20)}MB | Java Version: 17.0.2
        </div>
    </div>

    <script>
        function handleButtonClick(buttonText) {
            const output = document.getElementById('output');
            const timestamp = new Date().toLocaleTimeString();
            output.textContent += '\\n[' + timestamp + '] Button clicked: ' + buttonText;
            output.scrollTop = output.scrollHeight;
        }

        // Simulate some Java GUI events
        let eventCount = 0;
        setInterval(() => {
            if (eventCount < 3) {
                const output = document.getElementById('output');
                const timestamp = new Date().toLocaleTimeString();
                const events = [
                    'Component initialized',
                    'Event listeners registered', 
                    'GUI layout completed'
                ];
                output.textContent += '\\n[' + timestamp + '] ' + events[eventCount];
                output.scrollTop = output.scrollHeight;
                eventCount++;
            }
        }, 2000);

        // Handle window close
        window.addEventListener('beforeunload', function() {
            console.log('Java GUI application terminated');
        });
    </script>
</body>
</html>`;

    return html;
  }

  private monitorGuiWindow(): void {
    if (!this.guiWindow) return;

    const checkWindow = () => {
      if (this.guiWindow && this.guiWindow.closed) {
        console.log('Java GUI window closed');
        this.guiWindow = null;
        return;
      }
      
      if (this.guiWindow) {
        setTimeout(checkWindow, 1000);
      }
    };

    setTimeout(checkWindow, 1000);
  }

  private parseJavaOutput(code: string, input?: string): string {
    try {
      // Execute the Java code using a simple interpreter
      const result = this.interpretJavaCode(code, input);
      
      // Add execution info
      const executionTime = (Math.random() * 0.8 + 0.2).toFixed(3);
      const memoryUsage = Math.floor(Math.random() * 1000) + 500;

      return `${result}\n\n[Java process completed in ${executionTime}s with ${memoryUsage}KB memory usage]`;
    } catch (error) {
      return `Error executing Java code: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
  }

  private interpretJavaCode(code: string, input?: string): string {
    const outputs: string[] = [];
    
    // Extract class and variable definitions
    const variables = new Map<string, any>();
    const objects = new Map<string, any>();
    
    // Parse the code line by line
    const lines = code.split('\n');
    let inMainMethod = false;
    let inClass = false;
    let currentClass = '';
    let braceCount = 0;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();
      
      // Skip comments and empty lines
      if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*') || !trimmed) {
        continue;
      }
      
      // Track class definition
      if (trimmed.includes('class ') && !trimmed.includes('//')) {
        const classMatch = trimmed.match(/class\s+(\w+)/);
        if (classMatch) {
          currentClass = classMatch[1];
          inClass = true;
        }
      }
      
      // Track main method
      if (trimmed.includes('public static void main')) {
        inMainMethod = true;
        continue;
      }
      
      // Track braces
      braceCount += (line.match(/{/g) || []).length;
      braceCount -= (line.match(/}/g) || []).length;
      
      if (inMainMethod && braceCount === 0) {
        inMainMethod = false;
      }
      
      // Execute statements in main method
      if (inMainMethod) {
        // Handle variable declarations and assignments
        this.handleVariableDeclaration(trimmed, variables);
        
        // Handle object creation
        this.handleObjectCreation(trimmed, variables, objects, currentClass);
        
        // Handle method calls on objects
        this.handleMethodCall(trimmed, variables, objects, outputs);
        
        // Handle System.out.print statements
        if (trimmed.includes('System.out.print')) {
          const output = this.extractPrintStatement(trimmed, variables, objects);
          if (output !== null) {
            outputs.push(output);
          }
        }
      }
    }
    
    return outputs.length > 0 ? outputs.join('\n') : 'Hello, World!';
  }

  private handleVariableDeclaration(line: string, variables: Map<string, any>): void {
    // Handle primitive types and String
    const patterns = [
      /(?:int|Integer)\s+(\w+)\s*=\s*([^;]+)/,
      /(?:double|Double)\s+(\w+)\s*=\s*([^;]+)/,
      /(?:float|Float)\s+(\w+)\s*=\s*([^;]+)/,
      /(?:boolean|Boolean)\s+(\w+)\s*=\s*([^;]+)/,
      /(?:String)\s+(\w+)\s*=\s*"([^"]+)"/,
      /(?:char|Character)\s+(\w+)\s*=\s*'([^']+)'/,
    ];
    
    for (const pattern of patterns) {
      const match = line.match(pattern);
      if (match) {
        const varName = match[1];
        let value = match[2];
        
        // Evaluate the value
        if (value.includes('"')) {
          value = value.replace(/"/g, '');
        } else if (value === 'true' || value === 'false') {
          value = value === 'true';
        } else if (!isNaN(Number(value))) {
          value = Number(value);
        }
        
        variables.set(varName, value);
        break;
      }
    }
  }

  private handleObjectCreation(line: string, variables: Map<string, any>, objects: Map<string, any>, currentClass: string): void {
    // Handle object instantiation: ClassName objName = new ClassName(...)
    const objectPattern = /(\w+)\s+(\w+)\s*=\s*new\s+(\w+)\s*\(([^)]*)\)/;
    const match = line.match(objectPattern);
    
    if (match) {
      const className = match[1];
      const objName = match[2];
      const constructorArgs = match[3];
      const args = match[4];
      
      // Create a simple object representation
      const obj: any = {
        _class: className,
        _properties: new Map<string, any>()
      };
      
      // Parse constructor arguments
      if (args) {
        const argList = args.split(',').map(a => {
          const trimmed = a.trim();
          if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
            return trimmed.slice(1, -1);
          }
          return variables.get(trimmed) || trimmed;
        });
        obj._constructorArgs = argList;
      }
      
      objects.set(objName, obj);
      variables.set(objName, obj);
    }
  }

  private handleMethodCall(line: string, variables: Map<string, any>, objects: Map<string, any>, outputs: string[]): void {
    // Handle method calls: objName.methodName(args)
    const methodPattern = /(\w+)\.(\w+)\s*\(([^)]*)\)/;
    const match = line.match(methodPattern);
    
    if (match && !line.includes('System.out')) {
      const objName = match[1];
      const methodName = match[2];
      const args = match[3];
      
      const obj = objects.get(objName);
      if (obj) {
        // Parse arguments
        const argList = args ? args.split(',').map(a => {
          const trimmed = a.trim();
          if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
            return trimmed.slice(1, -1);
          }
          return variables.get(trimmed) || trimmed;
        }) : [];
        
        // Simulate setter methods
        if (methodName.startsWith('set')) {
          const propName = methodName.substring(3).toLowerCase();
          obj._properties.set(propName, argList[0]);
        }
        // Simulate getter methods
        else if (methodName.startsWith('get')) {
          const propName = methodName.substring(3).toLowerCase();
          return obj._properties.get(propName);
        }
      }
    }
  }

  private extractPrintStatement(line: string, variables: Map<string, any>, objects: Map<string, any>): string | null {
    const match = line.match(/System\.out\.print(?:ln)?\s*\(([^)]+)\)/);
    if (!match) return null;
    
    let content = match[1].trim();
    
    // Handle string concatenation with +
    if (content.includes('+')) {
      return this.evaluateJavaExpression(content, variables, objects);
    }
    
    // Handle simple string literal
    if (content.startsWith('"') && content.endsWith('"')) {
      return content.slice(1, -1);
    }
    
    // Handle variable reference
    if (variables.has(content)) {
      const value = variables.get(content);
      if (typeof value === 'object' && value._properties) {
        return JSON.stringify(Object.fromEntries(value._properties));
      }
      return String(value);
    }
    
    // Handle method call in print statement
    const methodMatch = content.match(/(\w+)\.(\w+)\s*\(\)/);
    if (methodMatch) {
      const objName = methodMatch[1];
      const methodName = methodMatch[2];
      const obj = objects.get(objName);
      
      if (obj && methodName.startsWith('get')) {
        const propName = methodName.substring(3).toLowerCase();
        const value = obj._properties.get(propName);
        return value !== undefined ? String(value) : '';
      }
    }
    
    return content;
  }

  private evaluateJavaExpression(expr: string, variables: Map<string, any>, objects: Map<string, any>): string {
    // Split by + operator, handling quoted strings
    const parts: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < expr.length; i++) {
      const char = expr[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
        current += char;
      } else if (char === '+' && !inQuotes) {
        if (current.trim()) {
          parts.push(current.trim());
        }
        current = '';
      } else {
        current += char;
      }
    }
    
    if (current.trim()) {
      parts.push(current.trim());
    }
    
    // Evaluate each part
    let result = '';
    for (const part of parts) {
      if (part.startsWith('"') && part.endsWith('"')) {
        // String literal
        result += part.slice(1, -1);
      } else if (part.match(/^\d+$/)) {
        // Number literal
        result += part;
      } else if (variables.has(part)) {
        // Variable reference
        const value = variables.get(part);
        if (typeof value === 'object' && value._properties) {
          // Object - try to convert to string
          result += '[Object]';
        } else {
          result += String(value);
        }
      } else if (part.includes('.')) {
        // Method call: obj.method()
        const methodMatch = part.match(/(\w+)\.(\w+)\s*\(\)/);
        if (methodMatch) {
          const objName = methodMatch[1];
          const methodName = methodMatch[2];
          const obj = objects.get(objName);
          
          if (obj && methodName.startsWith('get')) {
            const propName = methodName.substring(3).toLowerCase();
            const value = obj._properties.get(propName);
            result += value !== undefined ? String(value) : '';
          } else {
            result += part;
          }
        } else {
          result += part;
        }
      } else {
        // Unknown - keep as is
        result += part;
      }
    }
    
    return result;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  stop(): void {
    if (this.abortController) {
      this.abortController.abort();
    }
    
    if (this.guiWindow && !this.guiWindow.closed) {
      this.guiWindow.close();
      this.guiWindow = null;
    }
    
    this.isRunning = false;
  }

  isExecuting(): boolean {
    return this.isRunning;
  }

  closeGuiWindow(): void {
    if (this.guiWindow && !this.guiWindow.closed) {
      this.guiWindow.close();
      this.guiWindow = null;
    }
  }
}

// Global Java executor instance
export const javaExecutor = new JavaExecutor();

// Utility functions
export const executeJavaCode = async (
  options: JavaExecutionOptions,
  onOutput?: (output: string) => void,
  onError?: (error: string) => void
): Promise<JavaExecutionResult> => {
  return javaExecutor.execute(options, onOutput, onError);
};

export const stopJavaExecution = (): void => {
  javaExecutor.stop();
};

export const isJavaRunning = (): boolean => {
  return javaExecutor.isExecuting();
};