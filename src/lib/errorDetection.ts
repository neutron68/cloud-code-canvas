// Advanced error detection and analysis for multiple programming languages
import { 
  STANDARD_CONSTANTS, 
  STANDARD_FUNCTIONS, 
  STANDARD_TYPES,
  validateFormatSpecifier,
  getSizeof 
} from './standardLibrary';
import { 
  TYPE_SIZES, 
  PREPROCESSOR_DIRECTIVES, 
  STANDARD_HEADERS 
} from './cppCompilerConfig';

export interface CodeError {
  line: number;
  column: number;
  severity: 'error' | 'warning' | 'info';
  message: string;
  code: string;
  suggestion: string;
  fix?: string;
  category: 'syntax' | 'semantic' | 'style' | 'security';
}

export interface ErrorAnalysis {
  hasErrors: boolean;
  hasWarnings: boolean;
  errors: CodeError[];
  warnings: CodeError[];
  summary: string;
  canRun: boolean;
}

// Language-specific error detectors
class ErrorDetector {
  detectErrors(code: string, language: string): ErrorAnalysis {
    const errors: CodeError[] = [];
    const warnings: CodeError[] = [];

    switch (language.toLowerCase()) {
      case 'python':
        this.detectPythonErrors(code, errors, warnings);
        break;
      case 'javascript':
      case 'typescript':
        this.detectJavaScriptErrors(code, errors, warnings);
        break;
      case 'html':
        this.detectHTMLErrors(code, errors, warnings);
        break;
      case 'css':
        this.detectCSSErrors(code, errors, warnings);
        break;
      case 'java':
        this.detectJavaErrors(code, errors, warnings);
        break;
      case 'cpp':
      case 'c':
        this.detectCppErrors(code, errors, warnings);
        break;
      case 'json':
        this.detectJSONErrors(code, errors, warnings);
        break;
      default:
        this.detectGenericErrors(code, errors, warnings);
    }

    const hasErrors = errors.length > 0;
    const hasWarnings = warnings.length > 0;
    const canRun = !hasErrors;

    let summary = '';
    if (hasErrors) {
      summary = `Found ${errors.length} error(s) and ${warnings.length} warning(s). Code cannot run until errors are fixed.`;
    } else if (hasWarnings) {
      summary = `Found ${warnings.length} warning(s). Code can run but may have issues.`;
    } else {
      summary = 'No errors detected. Code is ready to run.';
    }

    return {
      hasErrors,
      hasWarnings,
      errors,
      warnings,
      summary,
      canRun,
    };
  }

  private detectPythonErrors(code: string, errors: CodeError[], warnings: CodeError[]): void {
    const lines = code.split('\n');

    lines.forEach((line, index) => {
      const lineNum = index + 1;
      const trimmed = line.trim();

      // Indentation errors
      if (line.length > 0 && line[0] === ' ' && ((line.match(/^ +/)?.[0].length ?? 0) % 4 !== 0)) {
        warnings.push({
          line: lineNum,
          column: 1,
          severity: 'warning',
          message: 'Inconsistent indentation detected',
          code: 'PY001',
          suggestion: 'Python uses 4 spaces for indentation. Use consistent spacing.',
          category: 'style',
        });
      }

      // Missing colon after control structures
      if (trimmed.match(/^(if|elif|else|for|while|def|class|try|except|finally|with)\s+.*[^:]$/)) {
        errors.push({
          line: lineNum,
          column: line.length,
          severity: 'error',
          message: 'Missing colon at end of statement',
          code: 'PY002',
          suggestion: 'Add a colon (:) at the end of if/for/while/def/class statements',
          fix: line + ':',
          category: 'syntax',
        });
      }

      // Unclosed parentheses/brackets
      const openParen = (line.match(/\(/g) || []).length;
      const closeParen = (line.match(/\)/g) || []).length;
      if (openParen > closeParen) {
        errors.push({
          line: lineNum,
          column: line.lastIndexOf('(') + 1,
          severity: 'error',
          message: 'Unclosed parenthesis',
          code: 'PY003',
          suggestion: 'Add closing parenthesis ) to match the opening one',
          category: 'syntax',
        });
      }

      // Unclosed quotes
      const singleQuotes = (line.match(/'/g) || []).length;
      const doubleQuotes = (line.match(/"/g) || []).length;
      if (singleQuotes % 2 !== 0 && !line.includes('"""') && !line.includes("'''")) {
        errors.push({
          line: lineNum,
          column: line.lastIndexOf("'") + 1,
          severity: 'error',
          message: 'Unclosed string literal (single quote)',
          code: 'PY004',
          suggestion: "Add closing single quote ' to complete the string",
          category: 'syntax',
        });
      }
      if (doubleQuotes % 2 !== 0 && !line.includes('"""')) {
        errors.push({
          line: lineNum,
          column: line.lastIndexOf('"') + 1,
          severity: 'error',
          message: 'Unclosed string literal (double quote)',
          code: 'PY005',
          suggestion: 'Add closing double quote " to complete the string',
          category: 'syntax',
        });
      }

      // Undefined variable usage (basic check)
      if (trimmed.match(/^print\s*\(\s*(\w+)\s*\)/) && !code.includes(`${RegExp.$1} =`)) {
        warnings.push({
          line: lineNum,
          column: line.indexOf(RegExp.$1) + 1,
          severity: 'warning',
          message: `Variable '${RegExp.$1}' may not be defined`,
          code: 'PY006',
          suggestion: `Define the variable before using it: ${RegExp.$1} = value`,
          category: 'semantic',
        });
      }

      // Common typos
      if (trimmed.match(/^(pritn|pint|prnt)\s*\(/)) {
        errors.push({
          line: lineNum,
          column: 1,
          severity: 'error',
          message: `'${RegExp.$1}' is not defined. Did you mean 'print'?`,
          code: 'PY007',
          suggestion: "Change to 'print'",
          fix: line.replace(RegExp.$1, 'print'),
          category: 'syntax',
        });
      }
    });
  }

  private detectJavaScriptErrors(code: string, errors: CodeError[], warnings: CodeError[]): void {
    const lines = code.split('\n');

    lines.forEach((line, index) => {
      const lineNum = index + 1;
      const trimmed = line.trim();

      // Missing semicolons
      if (trimmed.match(/^(let|const|var|return)\s+.*[^;{}\s]$/) && !trimmed.endsWith(',')) {
        warnings.push({
          line: lineNum,
          column: line.length,
          severity: 'warning',
          message: 'Missing semicolon',
          code: 'JS001',
          suggestion: 'Add semicolon at the end of the statement',
          fix: line + ';',
          category: 'style',
        });
      }

      // Unclosed braces
      const openBraces = (line.match(/{/g) || []).length;
      const closeBraces = (line.match(/}/g) || []).length;
      if (openBraces > closeBraces && !trimmed.endsWith('{')) {
        warnings.push({
          line: lineNum,
          column: line.lastIndexOf('{') + 1,
          severity: 'warning',
          message: 'Unclosed brace - may need closing brace on another line',
          code: 'JS002',
          suggestion: 'Ensure all opening braces { have matching closing braces }',
          category: 'syntax',
        });
      }

      // Unclosed parentheses
      const openParen = (line.match(/\(/g) || []).length;
      const closeParen = (line.match(/\)/g) || []).length;
      if (openParen > closeParen) {
        errors.push({
          line: lineNum,
          column: line.lastIndexOf('(') + 1,
          severity: 'error',
          message: 'Unclosed parenthesis',
          code: 'JS003',
          suggestion: 'Add closing parenthesis ) to match the opening one',
          category: 'syntax',
        });
      }

      // Unclosed quotes
      const singleQuotes = (line.match(/(?<!\\)'/g) || []).length;
      const doubleQuotes = (line.match(/(?<!\\)"/g) || []).length;
      const backticks = (line.match(/(?<!\\)`/g) || []).length;
      
      if (singleQuotes % 2 !== 0) {
        errors.push({
          line: lineNum,
          column: line.lastIndexOf("'") + 1,
          severity: 'error',
          message: 'Unclosed string literal (single quote)',
          code: 'JS004',
          suggestion: "Add closing single quote ' to complete the string",
          category: 'syntax',
        });
      }
      if (doubleQuotes % 2 !== 0) {
        errors.push({
          line: lineNum,
          column: line.lastIndexOf('"') + 1,
          severity: 'error',
          message: 'Unclosed string literal (double quote)',
          code: 'JS005',
          suggestion: 'Add closing double quote " to complete the string',
          category: 'syntax',
        });
      }
      if (backticks % 2 !== 0) {
        errors.push({
          line: lineNum,
          column: line.lastIndexOf('`') + 1,
          severity: 'error',
          message: 'Unclosed template literal',
          code: 'JS006',
          suggestion: 'Add closing backtick ` to complete the template literal',
          category: 'syntax',
        });
      }

      // Using var instead of let/const
      if (trimmed.startsWith('var ')) {
        warnings.push({
          line: lineNum,
          column: 1,
          severity: 'warning',
          message: "Use 'let' or 'const' instead of 'var'",
          code: 'JS007',
          suggestion: "Modern JavaScript uses 'let' for variables and 'const' for constants",
          fix: line.replace('var ', 'let '),
          category: 'style',
        });
      }

      // Common typos
      if (trimmed.match(/^(consol\.log|console\.lg|consolelog)\s*\(/)) {
        errors.push({
          line: lineNum,
          column: 1,
          severity: 'error',
          message: `'${RegExp.$1}' is not defined. Did you mean 'console.log'?`,
          code: 'JS008',
          suggestion: "Change to 'console.log'",
          fix: line.replace(RegExp.$1, 'console.log'),
          category: 'syntax',
        });
      }

      // Missing function keyword
      if (trimmed.match(/^(\w+)\s*\([^)]*\)\s*{/) && !trimmed.startsWith('function') && !code.includes(`const ${RegExp.$1}`) && !code.includes(`let ${RegExp.$1}`)) {
        errors.push({
          line: lineNum,
          column: 1,
          severity: 'error',
          message: 'Missing function keyword or arrow function syntax',
          code: 'JS009',
          suggestion: "Add 'function' keyword or use arrow function syntax: const name = () => {}",
          fix: 'function ' + line,
          category: 'syntax',
        });
      }
    });
  }

  private detectHTMLErrors(code: string, errors: CodeError[], warnings: CodeError[]): void {
    const lines = code.split('\n');
    const tagStack: Array<{ tag: string; line: number }> = [];

    lines.forEach((line, index) => {
      const lineNum = index + 1;

      // Find opening tags
      const openTags = line.match(/<(\w+)[^>]*>/g);
      if (openTags) {
        openTags.forEach(tag => {
          const tagName = tag.match(/<(\w+)/)?.[1];
          if (tagName && !['br', 'hr', 'img', 'input', 'meta', 'link'].includes(tagName.toLowerCase())) {
            tagStack.push({ tag: tagName, line: lineNum });
          }
        });
      }

      // Find closing tags
      const closeTags = line.match(/<\/(\w+)>/g);
      if (closeTags) {
        closeTags.forEach(tag => {
          const tagName = tag.match(/<\/(\w+)>/)?.[1];
          if (tagName) {
            const lastOpen = tagStack[tagStack.length - 1];
            if (!lastOpen) {
              errors.push({
                line: lineNum,
                column: line.indexOf(tag) + 1,
                severity: 'error',
                message: `Closing tag </${tagName}> has no matching opening tag`,
                code: 'HTML001',
                suggestion: `Add opening tag <${tagName}> before this closing tag`,
                category: 'syntax',
              });
            } else if (lastOpen.tag.toLowerCase() !== tagName.toLowerCase()) {
              errors.push({
                line: lineNum,
                column: line.indexOf(tag) + 1,
                severity: 'error',
                message: `Mismatched tags: expected </${lastOpen.tag}> but found </${tagName}>`,
                code: 'HTML002',
                suggestion: `Change to </${lastOpen.tag}> or fix the opening tag on line ${lastOpen.line}`,
                category: 'syntax',
              });
            } else {
              tagStack.pop();
            }
          }
        });
      }

      // Check for unclosed quotes in attributes
      const attrQuotes = line.match(/(\w+)=["'][^"']*$/);
      if (attrQuotes) {
        errors.push({
          line: lineNum,
          column: line.indexOf(attrQuotes[0]) + 1,
          severity: 'error',
          message: 'Unclosed attribute value',
          code: 'HTML003',
          suggestion: 'Add closing quote for the attribute value',
          category: 'syntax',
        });
      }

      // Missing alt attribute on img tags
      if (line.match(/<img[^>]*>/) && !line.includes('alt=')) {
        warnings.push({
          line: lineNum,
          column: line.indexOf('<img') + 1,
          severity: 'warning',
          message: 'Missing alt attribute on img tag',
          code: 'HTML004',
          suggestion: 'Add alt attribute for accessibility: <img src="..." alt="description">',
          category: 'style',
        });
      }

      // Inline styles warning
      if (line.includes('style=')) {
        warnings.push({
          line: lineNum,
          column: line.indexOf('style=') + 1,
          severity: 'warning',
          message: 'Inline styles detected',
          code: 'HTML005',
          suggestion: 'Consider using CSS classes instead of inline styles for better maintainability',
          category: 'style',
        });
      }
    });

    // Check for unclosed tags at the end
    tagStack.forEach(({ tag, line }) => {
      errors.push({
        line,
        column: 1,
        severity: 'error',
        message: `Unclosed tag <${tag}>`,
        code: 'HTML006',
        suggestion: `Add closing tag </${tag}> at the end of the document`,
        category: 'syntax',
      });
    });
  }

  private detectCSSErrors(code: string, errors: CodeError[], warnings: CodeError[]): void {
    const lines = code.split('\n');
    let braceCount = 0;

    lines.forEach((line, index) => {
      const lineNum = index + 1;
      const trimmed = line.trim();

      braceCount += (line.match(/{/g) || []).length;
      braceCount -= (line.match(/}/g) || []).length;

      // Missing semicolon
      if (trimmed.match(/:\s*[^;{}\s]+$/) && !trimmed.endsWith('{') && !trimmed.startsWith('/*')) {
        warnings.push({
          line: lineNum,
          column: line.length,
          severity: 'warning',
          message: 'Missing semicolon',
          code: 'CSS001',
          suggestion: 'Add semicolon at the end of the property declaration',
          fix: line + ';',
          category: 'style',
        });
      }

      // Invalid property format
      if (trimmed.includes(':') && !trimmed.match(/^[\w-]+\s*:\s*.+/) && !trimmed.startsWith('/*') && !trimmed.includes('//')) {
        errors.push({
          line: lineNum,
          column: 1,
          severity: 'error',
          message: 'Invalid CSS property format',
          code: 'CSS002',
          suggestion: 'CSS properties should be in format: property: value;',
          category: 'syntax',
        });
      }

      // Unknown property warning (common typos)
      const commonTypos: Record<string, string> = {
        'colour': 'color',
        'boarder': 'border',
        'witdh': 'width',
        'heigth': 'height',
        'margn': 'margin',
        'padd': 'padding',
      };

      Object.entries(commonTypos).forEach(([typo, correct]) => {
        if (trimmed.includes(`${typo}:`)) {
          errors.push({
            line: lineNum,
            column: line.indexOf(typo) + 1,
            severity: 'error',
            message: `Unknown property '${typo}'. Did you mean '${correct}'?`,
            code: 'CSS003',
            suggestion: `Change '${typo}' to '${correct}'`,
            fix: line.replace(typo, correct),
            category: 'syntax',
          });
        }
      });

      // Missing closing brace
      if (braceCount < 0) {
        errors.push({
          line: lineNum,
          column: line.indexOf('}') + 1,
          severity: 'error',
          message: 'Unexpected closing brace',
          code: 'CSS004',
          suggestion: 'Remove this closing brace or add a matching opening brace',
          category: 'syntax',
        });
      }
    });

    // Check for unclosed braces at the end
    if (braceCount > 0) {
      errors.push({
        line: lines.length,
        column: 1,
        severity: 'error',
        message: `${braceCount} unclosed brace(s)`,
        code: 'CSS005',
        suggestion: `Add ${braceCount} closing brace(s) } at the end`,
        category: 'syntax',
      });
    }
  }

  private detectJavaErrors(code: string, errors: CodeError[], warnings: CodeError[]): void {
    const lines = code.split('\n');

    lines.forEach((line, index) => {
      const lineNum = index + 1;
      const trimmed = line.trim();

      // Missing semicolon
      if (trimmed.match(/^(int|String|boolean|double|float|char|long)\s+\w+\s*=\s*.+[^;]$/) || 
          trimmed.match(/^(return|System\.out\.print)\s*.+[^;{]$/)) {
        errors.push({
          line: lineNum,
          column: line.length,
          severity: 'error',
          message: 'Missing semicolon',
          code: 'JAVA001',
          suggestion: 'Add semicolon at the end of the statement',
          fix: line + ';',
          category: 'syntax',
        });
      }

      // Missing braces after control structures
      if (trimmed.match(/^(if|else|for|while)\s*\([^)]*\)\s*$/) && !lines[index + 1]?.trim().startsWith('{')) {
        warnings.push({
          line: lineNum,
          column: line.length,
          severity: 'warning',
          message: 'Missing braces after control structure',
          code: 'JAVA002',
          suggestion: 'Add braces {} after if/for/while statements for better code clarity',
          category: 'style',
        });
      }

      // Class name should match file name (basic check)
      if (trimmed.match(/^public\s+class\s+(\w+)/)) {
        const className = RegExp.$1;
        if (className !== 'Main') {
          warnings.push({
            line: lineNum,
            column: line.indexOf(className) + 1,
            severity: 'warning',
            message: `Class name '${className}' should match the file name`,
            code: 'JAVA003',
            suggestion: `Rename the class to 'Main' or save the file as ${className}.java`,
            category: 'semantic',
          });
        }
      }
    });
  }

  private detectCppErrors(code: string, errors: CodeError[], warnings: CodeError[]): void {
    const lines = code.split('\n');
    let braceCount = 0;
    let parenCount = 0;
    const declaredVariables = new Set<string>();
    const includedHeaders = new Set<string>();
    const definedMacros = new Set<string>();

    lines.forEach((line, index) => {
      const lineNum = index + 1;
      const trimmed = line.trim();

      // Track brace and parenthesis balance
      braceCount += (line.match(/{/g) || []).length;
      braceCount -= (line.match(/}/g) || []).length;
      parenCount += (line.match(/\(/g) || []).length;
      parenCount -= (line.match(/\)/g) || []).length;

      // Skip comments and preprocessor directives for some checks
      if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('#')) {
        // Handle includes
        const includeMatch = trimmed.match(/#include\s*[<"]([^>"]+)[>"]/);
        if (includeMatch) {
          const header = includeMatch[1];
          includedHeaders.add(header);
          
          // Check for valid standard headers
          const allHeaders = [...STANDARD_HEADERS.c, ...STANDARD_HEADERS.cpp];
          if (!allHeaders.includes(header) && !header.endsWith('.h') && !header.endsWith('.hpp')) {
            warnings.push({
              line: lineNum,
              column: line.indexOf(header) + 1,
              severity: 'warning',
              message: `Header '${header}' may not be available`,
              code: 'CPP010',
              suggestion: 'Verify that this header exists and is accessible',
              category: 'semantic',
            });
          }
        }

        // Handle defines
        const defineMatch = trimmed.match(/#define\s+(\w+)/);
        if (defineMatch) {
          definedMacros.add(defineMatch[1]);
        }
        return;
      }

      // Missing semicolon (enhanced detection)
      if (trimmed.match(/^(int|string|bool|double|float|char|long|short|unsigned|signed|size_t|auto|const|static)\s+\w+.*[^;{}\s]$/) ||
          trimmed.match(/^(cout|printf|return|delete|new)\s*.+[^;{}\s]$/) ||
          trimmed.match(/^\w+\s*\([^)]*\)\s*[^;{}\s]$/)) {
        errors.push({
          line: lineNum,
          column: line.length,
          severity: 'error',
          message: 'Expected \';\' at end of declaration',
          code: 'CPP001',
          suggestion: 'Add semicolon at the end of the statement',
          fix: line + ';',
          category: 'syntax',
        });
      }

      // Missing namespace std or std:: prefix
      const stdFunctions = ['cout', 'cin', 'endl', 'string', 'vector', 'map', 'set'];
      stdFunctions.forEach(func => {
        if (trimmed.includes(func) && !code.includes('using namespace std') && !trimmed.includes(`std::${func}`)) {
          errors.push({
            line: lineNum,
            column: line.indexOf(func) + 1,
            severity: 'error',
            message: `'${func}' was not declared in this scope`,
            code: 'CPP002',
            suggestion: `Add 'using namespace std;' or use 'std::${func}'`,
            fix: line.replace(func, `std::${func}`),
            category: 'semantic',
          });
        }
      });

      // Missing iostream include for cout/cin
      if ((trimmed.includes('cout') || trimmed.includes('cin')) && !includedHeaders.has('iostream')) {
        errors.push({
          line: lineNum,
          column: line.indexOf(trimmed.includes('cout') ? 'cout' : 'cin') + 1,
          severity: 'error',
          message: 'iostream: No such file or directory',
          code: 'CPP003',
          suggestion: 'Add #include <iostream> at the top of the file',
          category: 'semantic',
        });
      }

      // Missing stdio.h for printf/scanf
      if ((trimmed.includes('printf') || trimmed.includes('scanf')) && !includedHeaders.has('stdio.h')) {
        warnings.push({
          line: lineNum,
          column: line.indexOf(trimmed.includes('printf') ? 'printf' : 'scanf') + 1,
          severity: 'warning',
          message: 'Implicit declaration of function',
          code: 'CPP004',
          suggestion: 'Add #include <stdio.h> for C-style I/O functions',
          category: 'semantic',
        });
      }

      // Variable declaration tracking
      const varDeclMatch = trimmed.match(/^(int|float|double|char|bool|string|auto|const\s+\w+|static\s+\w+)\s+(\w+)/);
      if (varDeclMatch) {
        declaredVariables.add(varDeclMatch[2]);
      }

      // Undefined variable usage
      const varUsageMatch = trimmed.match(/\b(\w+)\b/g);
      if (varUsageMatch) {
        varUsageMatch.forEach(variable => {
          if (!declaredVariables.has(variable) && 
              !['int', 'float', 'double', 'char', 'bool', 'string', 'cout', 'cin', 'endl', 'main', 'return', 'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'break', 'continue', 'true', 'false', 'NULL', 'nullptr'].includes(variable) &&
              !definedMacros.has(variable) &&
              !Object.prototype.hasOwnProperty.call(STANDARD_FUNCTIONS, variable)) {
            warnings.push({
              line: lineNum,
              column: line.indexOf(variable) + 1,
              severity: 'warning',
              message: `'${variable}' was not declared in this scope`,
              code: 'CPP005',
              suggestion: `Declare variable '${variable}' before using it`,
              category: 'semantic',
            });
          }
        });
      }

      // Format specifier validation for printf
      const printfMatch = trimmed.match(/printf\s*\(\s*"([^"]*)"(?:,\s*(.+))?\)/);
      if (printfMatch) {
        const formatString = printfMatch[1];
        const args = printfMatch[2];
        const specifiers = formatString.match(/%[diouxXeEfFgGaAcspn%]/g) || [];
        
        if (args) {
          const argCount = args.split(',').length;
          if (specifiers.length !== argCount) {
            warnings.push({
              line: lineNum,
              column: line.indexOf('printf') + 1,
              severity: 'warning',
              message: `Format specifier count (${specifiers.length}) doesn't match argument count (${argCount})`,
              code: 'CPP006',
              suggestion: 'Ensure the number of format specifiers matches the number of arguments',
              category: 'semantic',
            });
          }
        }
      }

      // Missing main function (check at end)
      if (index === lines.length - 1 && !code.includes('int main') && !code.includes('void main')) {
        warnings.push({
          line: 1,
          column: 1,
          severity: 'warning',
          message: 'No main function found',
          code: 'CPP007',
          suggestion: 'Add a main function: int main() { return 0; }',
          category: 'semantic',
        });
      }

      // Unmatched braces
      if (braceCount < 0) {
        errors.push({
          line: lineNum,
          column: line.indexOf('}') + 1,
          severity: 'error',
          message: 'Unexpected \'}\'',
          code: 'CPP008',
          suggestion: 'Remove this closing brace or add a matching opening brace',
          category: 'syntax',
        });
      }

      // Unmatched parentheses
      if (parenCount < 0) {
        errors.push({
          line: lineNum,
          column: line.lastIndexOf(')') + 1,
          severity: 'error',
          message: 'Unexpected \')\'',
          code: 'CPP009',
          suggestion: 'Remove this closing parenthesis or add a matching opening parenthesis',
          category: 'syntax',
        });
      }

      // Type mismatch warnings (basic)
      const assignmentMatch = trimmed.match(/^(int|float|double)\s+\w+\s*=\s*(.+);/);
      if (assignmentMatch) {
        const type = assignmentMatch[1];
        const value = assignmentMatch[2].trim();
        
        if (type === 'int' && value.includes('.') && !value.includes('(int)')) {
          warnings.push({
            line: lineNum,
            column: line.indexOf(value) + 1,
            severity: 'warning',
            message: 'Implicit conversion from double to int',
            code: 'CPP011',
            suggestion: 'Use explicit cast: (int)value or change variable type to double',
            category: 'semantic',
          });
        }
      }

      // Memory leak detection (basic)
      if (trimmed.includes('new ') && !code.includes('delete')) {
        warnings.push({
          line: lineNum,
          column: line.indexOf('new') + 1,
          severity: 'warning',
          message: 'Potential memory leak: new without corresponding delete',
          code: 'CPP012',
          suggestion: 'Add corresponding delete statement or use smart pointers',
          category: 'security',
        });
      }

      // Array bounds (basic check)
      const arrayAccessMatch = trimmed.match(/(\w+)\[(\d+)\]/);
      if (arrayAccessMatch) {
        const arrayName = arrayAccessMatch[1];
        const index = parseInt(arrayAccessMatch[2]);
        
        // Look for array declaration
        const arrayDeclRegex = new RegExp(`${arrayName}\\[(\\d+)\\]`);
        const arrayDecl = code.match(arrayDeclRegex);
        if (arrayDecl) {
          const arraySize = parseInt(arrayDecl[1]);
          if (index >= arraySize) {
            errors.push({
              line: lineNum,
              column: line.indexOf(arrayAccessMatch[0]) + 1,
              severity: 'error',
              message: `Array index ${index} is out of bounds for array of size ${arraySize}`,
              code: 'CPP013',
              suggestion: `Use index between 0 and ${arraySize - 1}`,
              category: 'semantic',
            });
          }
        }
      }
    });

    // Final checks for unmatched braces/parentheses
    if (braceCount > 0) {
      errors.push({
        line: lines.length,
        column: 1,
        severity: 'error',
        message: `Expected '}' at end of input`,
        code: 'CPP014',
        suggestion: `Add ${braceCount} closing brace(s) }`,
        category: 'syntax',
      });
    }

    if (parenCount > 0) {
      errors.push({
        line: lines.length,
        column: 1,
        severity: 'error',
        message: `Expected ')' at end of input`,
        code: 'CPP015',
        suggestion: `Add ${parenCount} closing parenthesis(es) )`,
        category: 'syntax',
      });
    }
  }

  private detectJSONErrors(code: string, errors: CodeError[], warnings: CodeError[]): void {
    try {
      JSON.parse(code);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : String(e);
      const match = message.match(/position (\d+)/);
      const position = match ? parseInt(match[1]) : 0;
      
      // Calculate line and column from position
      const lines = code.substring(0, position).split('\n');
      const line = lines.length;
      const column = lines[lines.length - 1].length + 1;

      errors.push({
        line,
        column,
        severity: 'error',
        message,
        code: 'JSON001',
        suggestion: 'Check for missing commas, quotes, or brackets. JSON requires strict formatting.',
        category: 'syntax',
      });
    }
  }

  private detectGenericErrors(code: string, errors: CodeError[], warnings: CodeError[]): void {
    const lines = code.split('\n');

    lines.forEach((line, index) => {
      const lineNum = index + 1;

      // Very long lines
      if (line.length > 120) {
        warnings.push({
          line: lineNum,
          column: 120,
          severity: 'warning',
          message: 'Line is too long',
          code: 'GEN001',
          suggestion: 'Consider breaking this line into multiple lines for better readability',
          category: 'style',
        });
      }

      // Trailing whitespace
      if (line.match(/\s+$/)) {
        warnings.push({
          line: lineNum,
          column: line.trimEnd().length + 1,
          severity: 'info',
          message: 'Trailing whitespace',
          code: 'GEN002',
          suggestion: 'Remove trailing whitespace',
          fix: line.trimEnd(),
          category: 'style',
        });
      }
    });
  }
}

// Export singleton instance
export const errorDetector = new ErrorDetector();

// Main function to analyze code
export const analyzeCode = (code: string, language: string): ErrorAnalysis => {
  return errorDetector.detectErrors(code, language);
};