# Enhanced C/C++ Compiler Configuration

This document describes the comprehensive enhancements made to the C/C++ execution environment to provide GCC/Clang-compatible behavior and full language standard support.

## Overview

The enhanced C/C++ compiler provides:
- Full support for C standards: C89, C99, C11, C17
- Full support for C++ standards: C++11, C++14, C++17, C++20
- GCC/Clang-compatible type system and behavior
- Comprehensive error detection and reporting
- Standard library function support
- Proper sizeof operator behavior
- Format specifier validation
- Preprocessor directive support

## Language Standards Support

### C Standards
- **C89/C90**: ANSI C standard with basic features
- **C99**: Adds inline functions, variable-length arrays, C++ style comments
- **C11**: Adds generic selections, static assertions, anonymous structs
- **C17**: Bug fixes and clarifications to C11

### C++ Standards  
- **C++11**: Adds auto keyword, lambda expressions, smart pointers
- **C++14**: Generic lambdas, variable templates, binary literals
- **C++17**: Structured bindings, if constexpr, std::optional
- **C++20**: Concepts, ranges, coroutines, modules

## Primitive Types and Sizes

The compiler implements standard type sizes matching GCC/Clang:

| Type | Size (bytes) | Range |
|------|--------------|-------|
| char | 1 | -128 to 127 |
| short | 2 | -32,768 to 32,767 |
| int | 4 | -2,147,483,648 to 2,147,483,647 |
| long | 4 | -2,147,483,648 to 2,147,483,647 |
| long long | 8 | -9,223,372,036,854,775,808 to 9,223,372,036,854,775,807 |
| float | 4 | ±3.4E±38 (7 digits) |
| double | 8 | ±1.7E±308 (15 digits) |
| long double | 16 | ±1.2E±4932 (19 digits) |
| pointer | 8 | 64-bit addresses |

## Literal Suffixes

Supports all standard numeric literal suffixes:

### Integer Suffixes
- `L` or `l` → long
- `LL` or `ll` → long long  
- `U` or `u` → unsigned
- `UL` or `ul` → unsigned long
- `ULL` or `ull` → unsigned long long

### Floating-Point Suffixes
- `F` or `f` → float
- `L` or `l` → long double
- (no suffix) → double

## Format Specifiers

Full printf/scanf format specifier support:

| Specifier | Type | Description |
|-----------|------|-------------|
| %d, %i | int | Signed decimal integer |
| %ld | long | Long signed decimal |
| %lld | long long | Long long signed decimal |
| %u | unsigned int | Unsigned decimal |
| %lu | unsigned long | Unsigned long decimal |
| %llu | unsigned long long | Unsigned long long decimal |
| %f | float/double | Floating point |
| %lf | double | Double precision floating point |
| %Lf | long double | Long double precision |
| %c | char | Single character |
| %s | char* | String |
| %p | void* | Pointer address |
| %x, %X | int | Hexadecimal |
| %o | int | Octal |
| %zu | size_t | Size type |

## Standard Library Support

### Included Headers

#### C Standard Library
- `stdio.h` - Input/output functions
- `stdlib.h` - General utilities  
- `string.h` - String manipulation
- `math.h` - Mathematical functions
- `stdint.h` - Integer types
- `stdbool.h` - Boolean type
- `limits.h` - Implementation limits
- `float.h` - Floating-point limits
- `time.h` - Time/date functions

#### C++ Standard Library  
- `iostream` - Input/output streams
- `string` - String class
- `vector` - Dynamic arrays
- `map` - Associative containers
- `algorithm` - Algorithms
- `memory` - Smart pointers
- `utility` - Utility components

### Supported Functions

#### String Functions (string.h)
- `strlen()` - String length
- `strcpy()` - String copy
- `strcat()` - String concatenation
- `strcmp()` - String comparison
- `strchr()` - Find character

#### Math Functions (math.h)
- `sqrt()`, `pow()`, `exp()`, `log()`
- `sin()`, `cos()`, `tan()`
- `ceil()`, `floor()`, `round()`
- `abs()`, `fabs()`

#### Memory Functions (stdlib.h)
- `malloc()`, `calloc()`, `realloc()`, `free()`
- `rand()`, `srand()`
- `atoi()`, `atof()`, `atol()`

## Preprocessor Support

Full preprocessor directive support:

### Directives
- `#include` - File inclusion
- `#define` - Macro definition
- `#undef` - Macro undefinition
- `#ifdef` / `#ifndef` - Conditional compilation
- `#if` / `#else` / `#elif` / `#endif` - Conditional blocks
- `#pragma` - Implementation-specific directives

### Predefined Macros
- `__STDC__` - Standard C compliance
- `__STDC_VERSION__` - C standard version
- `__cplusplus` - C++ standard version
- `__GNUC__` - GCC compatibility

## Error Detection and Reporting

### Syntax Errors
- Missing semicolons
- Unmatched braces/parentheses
- Invalid syntax constructs
- Malformed declarations

### Semantic Errors
- Undeclared variables
- Type mismatches
- Invalid function calls
- Scope violations

### Warnings
- Implicit type conversions
- Unused variables
- Potential memory leaks
- Format specifier mismatches

### Error Message Format
```
filename:line:column: error: message
   code context
   ^~~~
```

## Memory Management

### Pointer Arithmetic
- Full pointer arithmetic support
- Array decay to pointers
- Pointer-to-pointer operations
- Void pointer handling

### Dynamic Allocation
- `malloc()` / `free()` support
- Memory leak detection
- Double-free detection
- Use-after-free warnings

## Compilation Process

### Phases
1. **Preprocessing** - Macro expansion, file inclusion
2. **Compilation** - Syntax/semantic analysis
3. **Linking** - Symbol resolution
4. **Execution** - Runtime execution

### Optimization Levels
- `-O0` - No optimization (default)
- `-O1` - Basic optimization
- `-O2` - Standard optimization
- `-O3` - Aggressive optimization

## Usage Examples

### Basic C Program
```c
#include <stdio.h>

int main() {
    int x = 42;
    printf("Hello, World! x = %d\n", x);
    return 0;
}
```

### C++ Program with Modern Features
```cpp
#include <iostream>
#include <vector>
#include <memory>

int main() {
    auto ptr = std::make_unique<int>(42);
    std::vector<int> vec = {1, 2, 3, 4, 5};
    
    std::cout << "Value: " << *ptr << std::endl;
    
    for (const auto& item : vec) {
        std::cout << item << " ";
    }
    std::cout << std::endl;
    
    return 0;
}
```

### Type Demonstration
```c
#include <stdio.h>
#include <stdint.h>

int main() {
    // Standard types
    char c = 'A';
    short s = 32767;
    int i = 2147483647;
    long l = 2147483647L;
    long long ll = 9223372036854775807LL;
    
    // Floating point
    float f = 3.14F;
    double d = 3.141592653589793;
    long double ld = 3.141592653589793238L;
    
    // Fixed-width types
    int8_t i8 = 127;
    int16_t i16 = 32767;
    int32_t i32 = 2147483647;
    int64_t i64 = 9223372036854775807LL;
    
    printf("Sizes: char=%zu, int=%zu, long=%zu, long long=%zu\n",
           sizeof(c), sizeof(i), sizeof(l), sizeof(ll));
    
    return 0;
}
```

## Testing

The implementation includes comprehensive tests covering:
- All C/C++ standards
- Type size verification
- Literal suffix handling
- Format specifier validation
- Standard library functions
- Preprocessor directives
- Error detection accuracy

Run tests with:
```typescript
import { runAllTests } from './src/test/cppCompilerTest';
await runAllTests();
```

## Compatibility

This implementation provides high compatibility with:
- GCC (GNU Compiler Collection)
- Clang (LLVM Compiler)
- Microsoft Visual C++
- Intel C++ Compiler

Programs that compile successfully with these compilers should execute correctly in this environment without modification.