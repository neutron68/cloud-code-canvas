// GCC/Clang-compatible C/C++ compiler configuration
// Supports C89, C99, C11, C17 and C++11, C++14, C++17, C++20

export interface CompilerConfig {
  standard: string;
  includes: string[];
  defines: Record<string, string | number>;
  warnings: string[];
  optimizationLevel: number;
}

export const C_STANDARDS = {
  C89: 'c89',
  C99: 'c99',
  C11: 'c11',
  C17: 'c17',
} as const;

export const CPP_STANDARDS = {
  CPP11: 'c++11',
  CPP14: 'c++14',
  CPP17: 'c++17',
  CPP20: 'c++20',
} as const;

// Standard type sizes (in bytes) matching GCC/Clang on most platforms
export const TYPE_SIZES = {
  char: 1,
  short: 2,
  int: 4,
  long: 4,        // 4 on 32-bit, 8 on 64-bit (we use 4 for compatibility)
  'long long': 8,
  float: 4,
  double: 8,
  'long double': 16,  // Can be 8, 12, or 16 depending on platform
  pointer: 8,     // 64-bit pointers
  size_t: 8,
  ptrdiff_t: 8,
  intptr_t: 8,
} as const;

// Standard library headers support
export const STANDARD_HEADERS = {
  c: [
    'stdio.h',
    'stdlib.h',
    'string.h',
    'math.h',
    'stdint.h',
    'stdbool.h',
    'limits.h',
    'float.h',
    'time.h',
    'ctype.h',
    'assert.h',
    'errno.h',
    'stdarg.h',
    'setjmp.h',
    'signal.h',
    'locale.h',
  ],
  cpp: [
    'iostream',
    'string',
    'vector',
    'map',
    'set',
    'algorithm',
    'memory',
    'utility',
    'functional',
    'iterator',
    'numeric',
    'cmath',
    'cstdlib',
    'cstring',
    'cstdio',
    'cstdint',
    'limits',
    'type_traits',
    'tuple',
    'array',
  ],
} as const;

// Format specifiers for printf/scanf
export const FORMAT_SPECIFIERS = {
  '%d': 'int',
  '%i': 'int',
  '%ld': 'long',
  '%lld': 'long long',
  '%u': 'unsigned int',
  '%lu': 'unsigned long',
  '%llu': 'unsigned long long',
  '%f': 'float/double',
  '%lf': 'double',
  '%Lf': 'long double',
  '%e': 'double (scientific)',
  '%g': 'double (shortest)',
  '%c': 'char',
  '%s': 'string',
  '%p': 'pointer',
  '%x': 'hex int',
  '%o': 'octal int',
  '%zu': 'size_t',
  '%zd': 'ssize_t',
} as const;

// Literal suffixes
export const LITERAL_SUFFIXES = {
  integer: {
    L: 'long',
    LL: 'long long',
    U: 'unsigned',
    UL: 'unsigned long',
    ULL: 'unsigned long long',
  },
  floating: {
    F: 'float',
    L: 'long double',
  },
} as const;

// Default compiler configuration for C
export const DEFAULT_C_CONFIG: CompilerConfig = {
  standard: C_STANDARDS.C11,
  includes: STANDARD_HEADERS.c,
  defines: {
    __STDC__: 1,
    __STDC_VERSION__: 201112,
    __STDC_HOSTED__: 1,
  },
  warnings: ['-Wall', '-Wextra', '-Wpedantic'],
  optimizationLevel: 0,
};

// Default compiler configuration for C++
export const DEFAULT_CPP_CONFIG: CompilerConfig = {
  standard: CPP_STANDARDS.CPP17,
  includes: STANDARD_HEADERS.cpp,
  defines: {
    __cplusplus: 201703,
    __GNUC__: 11,
    __GNUC_MINOR__: 2,
  },
  warnings: ['-Wall', '-Wextra', '-Wpedantic'],
  optimizationLevel: 0,
};

// Preprocessor directives support
export const PREPROCESSOR_DIRECTIVES = [
  '#include',
  '#define',
  '#undef',
  '#ifdef',
  '#ifndef',
  '#if',
  '#else',
  '#elif',
  '#endif',
  '#pragma',
  '#error',
  '#warning',
] as const;

// Get compiler configuration based on language and standard
export function getCompilerConfig(
  language: 'c' | 'cpp',
  standard?: string
): CompilerConfig {
  const baseConfig = language === 'c' ? DEFAULT_C_CONFIG : DEFAULT_CPP_CONFIG;
  
  if (standard) {
    return {
      ...baseConfig,
      standard,
      defines: {
        ...baseConfig.defines,
        ...(language === 'c' && getStdcVersion(standard)),
        ...(language === 'cpp' && { __cplusplus: getCppVersion(standard) }),
      },
    };
  }
  
  return baseConfig;
}

function getStdcVersion(standard: string): { __STDC_VERSION__: number } {
  const versions: Record<string, number> = {
    c89: 199409,
    c99: 199901,
    c11: 201112,
    c17: 201710,
  };
  return { __STDC_VERSION__: versions[standard] || 201112 };
}

function getCppVersion(standard: string): number {
  const versions: Record<string, number> = {
    'c++11': 201103,
    'c++14': 201402,
    'c++17': 201703,
    'c++20': 202002,
  };
  return versions[standard] || 201703;
}

// Validate if code uses supported features
export function validateCodeFeatures(code: string, language: 'c' | 'cpp'): {
  valid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Check for unsupported features
  const lines = code.split('\n');
  
  lines.forEach((line, index) => {
    const lineNum = index + 1;
    
    // Check for proper include syntax
    if (line.includes('#include')) {
      const match = line.match(/#include\s*[<"]([^>"]+)[>"]/);
      if (match) {
        const header = match[1];
        const validHeaders = language === 'c' ? STANDARD_HEADERS.c : [...STANDARD_HEADERS.c, ...STANDARD_HEADERS.cpp];
        if (!validHeaders.includes(header)) {
          warnings.push(`Line ${lineNum}: Header '${header}' may not be available`);
        }
      }
    }
  });
  
  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}
