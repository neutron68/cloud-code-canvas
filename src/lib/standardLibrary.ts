// Standard library implementations for C/C++ compatibility
// Provides GCC/Clang compatible functions and constants

export const STANDARD_CONSTANTS = {
  // limits.h constants
  CHAR_BIT: 8,
  CHAR_MAX: 127,
  CHAR_MIN: -128,
  INT_MAX: 2147483647,
  INT_MIN: -2147483648,
  LONG_MAX: 2147483647,
  LONG_MIN: -2147483648,
  LLONG_MAX: 9223372036854775807n,
  LLONG_MIN: -9223372036854775808n,
  SCHAR_MAX: 127,
  SCHAR_MIN: -128,
  SHRT_MAX: 32767,
  SHRT_MIN: -32768,
  UCHAR_MAX: 255,
  UINT_MAX: 4294967295,
  ULONG_MAX: 4294967295,
  ULLONG_MAX: 18446744073709551615n,
  USHRT_MAX: 65535,

  // float.h constants
  FLT_MAX: 3.402823466e+38,
  FLT_MIN: 1.175494351e-38,
  FLT_EPSILON: 1.192092896e-07,
  DBL_MAX: 1.7976931348623157e+308,
  DBL_MIN: 2.2250738585072014e-308,
  DBL_EPSILON: 2.2204460492503131e-16,
  LDBL_MAX: 1.18973149535723176502e+4932,
  LDBL_MIN: 3.36210314311209350626e-4932,
  LDBL_EPSILON: 1.08420217248550443401e-19,

  // math.h constants
  M_PI: 3.14159265358979323846,
  M_E: 2.7182818284590452354,
  M_LOG2E: 1.4426950408889634074,
  M_LOG10E: 0.43429448190325182765,
  M_LN2: 0.69314718055994530942,
  M_LN10: 2.30258509299404568402,
  M_SQRT2: 1.41421356237309504880,
  M_SQRT1_2: 0.70710678118654752440,

  // stdio.h constants
  EOF: -1,
  BUFSIZ: 8192,
  FILENAME_MAX: 4096,
} as const;
// Standard library function implementations
export const STANDARD_FUNCTIONS = {
  // string.h functions
  strlen: (str: string): number => str.length,
  
  strcpy: (dest: string, src: string): string => src,
  
  strcat: (dest: string, src: string): string => dest + src,
  
  strcmp: (str1: string, str2: string): number => {
    if (str1 < str2) return -1;
    if (str1 > str2) return 1;
    return 0;
  },
  
  strncmp: (str1: string, str2: string, n: number): number => {
    const s1 = str1.substring(0, n);
    const s2 = str2.substring(0, n);
    if (s1 < s2) return -1;
    if (s1 > s2) return 1;
    return 0;
  },
  
  strchr: (str: string, char: string): number => {
    const index = str.indexOf(char);
    return index === -1 ? 0 : index;
  },
  
  // math.h functions
  abs: (x: number): number => Math.abs(x),
  fabs: (x: number): number => Math.abs(x),
  ceil: (x: number): number => Math.ceil(x),
  floor: (x: number): number => Math.floor(x),
  round: (x: number): number => Math.round(x),
  sqrt: (x: number): number => Math.sqrt(x),
  pow: (x: number, y: number): number => Math.pow(x, y),
  exp: (x: number): number => Math.exp(x),
  log: (x: number): number => Math.log(x),
  log10: (x: number): number => Math.log10(x),
  sin: (x: number): number => Math.sin(x),
  cos: (x: number): number => Math.cos(x),
  tan: (x: number): number => Math.tan(x),
  asin: (x: number): number => Math.asin(x),
  acos: (x: number): number => Math.acos(x),
  atan: (x: number): number => Math.atan(x),
  atan2: (y: number, x: number): number => Math.atan2(y, x),
  
  // stdlib.h functions
  malloc: (size: number): object => ({ size, allocated: true }),
  calloc: (num: number, size: number): object => ({ size: num * size, allocated: true, zeroed: true }),
  realloc: (ptr: object, size: number): object => ({ ...ptr, size }),
  free: (ptr: object): void => { /* Memory deallocation simulation */ },
  
  rand: (): number => Math.floor(Math.random() * 32768),
  srand: (seed: number): void => { /* Seed random number generator */ },
  
  atoi: (str: string): number => parseInt(str, 10) || 0,
  atof: (str: string): number => parseFloat(str) || 0.0,
  atol: (str: string): number => parseInt(str, 10) || 0,
} as const;
// Type definitions for standard types
export const STANDARD_TYPES = {
  size_t: 'unsigned long',
  ptrdiff_t: 'long',
  intptr_t: 'long',
  uintptr_t: 'unsigned long',
  wchar_t: 'int',
  
  // stdint.h types
  int8_t: 'signed char',
  int16_t: 'short',
  int32_t: 'int',
  int64_t: 'long long',
  uint8_t: 'unsigned char',
  uint16_t: 'unsigned short',
  uint32_t: 'unsigned int',
  uint64_t: 'unsigned long long',
  
  // Fastest minimum-width types
  int_fast8_t: 'int',
  int_fast16_t: 'int',
  int_fast32_t: 'int',
  int_fast64_t: 'long long',
  uint_fast8_t: 'unsigned int',
  uint_fast16_t: 'unsigned int',
  uint_fast32_t: 'unsigned int',
  uint_fast64_t: 'unsigned long long',
  
  // Least minimum-width types
  int_least8_t: 'signed char',
  int_least16_t: 'short',
  int_least32_t: 'int',
  int_least64_t: 'long long',
  uint_least8_t: 'unsigned char',
  uint_least16_t: 'unsigned short',
  uint_least32_t: 'unsigned int',
  uint_least64_t: 'unsigned long long',
  
  // Maximum-width types
  intmax_t: 'long long',
  uintmax_t: 'unsigned long long',
} as const;

// Format specifier validation
export function validateFormatSpecifier(specifier: string, type: string): boolean {
  const formatMap: Record<string, string[]> = {
    '%d': ['int', 'signed int'],
    '%i': ['int', 'signed int'],
    '%ld': ['long', 'long int'],
    '%lld': ['long long', 'long long int'],
    '%u': ['unsigned int'],
    '%lu': ['unsigned long'],
    '%llu': ['unsigned long long'],
    '%f': ['float', 'double'],
    '%lf': ['double'],
    '%Lf': ['long double'],
    '%c': ['char', 'signed char', 'unsigned char'],
    '%s': ['char*', 'const char*'],
    '%p': ['void*', 'pointer'],
    '%x': ['int', 'unsigned int'],
    '%X': ['int', 'unsigned int'],
    '%o': ['int', 'unsigned int'],
    '%zu': ['size_t'],
    '%zd': ['ssize_t'],
  };
  
  return formatMap[specifier]?.includes(type) || false;
}

// Sizeof operator implementation
export function getSizeof(type: string): number {
  const sizeMap: Record<string, number> = {
    'char': 1,
    'signed char': 1,
    'unsigned char': 1,
    'short': 2,
    'short int': 2,
    'signed short': 2,
    'unsigned short': 2,
    'int': 4,
    'signed int': 4,
    'unsigned int': 4,
    'long': 4,
    'long int': 4,
    'signed long': 4,
    'unsigned long': 4,
    'long long': 8,
    'long long int': 8,
    'signed long long': 8,
    'unsigned long long': 8,
    'float': 4,
    'double': 8,
    'long double': 16,
    'void*': 8,
    'char*': 8,
    'size_t': 8,
    'ptrdiff_t': 8,
    'intptr_t': 8,
    'uintptr_t': 8,
  };
  
  return sizeMap[type] || 8; // Default to pointer size
}