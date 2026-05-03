# Enhanced C/C++ Compiler - Quick Start Guide

## Overview

The enhanced C/C++ execution environment now provides full GCC/Clang compatibility with support for all major C and C++ standards. This guide will help you get started with the new features.

## Key Features

✅ **Full Standard Support**: C89, C99, C11, C17, C++11, C++14, C++17, C++20  
✅ **GCC/Clang Compatible**: Same type system, sizes, and behavior  
✅ **Complete Standard Library**: stdio.h, stdlib.h, iostream, vector, etc.  
✅ **Advanced Error Detection**: Comprehensive syntax and semantic analysis  
✅ **Preprocessor Support**: Full macro and conditional compilation  
✅ **Memory Management**: malloc/free, smart pointers, leak detection  

## Quick Examples

### 1. Basic C Program with Type Demonstration
```c
#include <stdio.h>
#include <limits.h>

int main() {
    // All standard types supported
    char c = 'A';
    int i = INT_MAX;
    long long ll = 9223372036854775807LL;
    float f = 3.14F;
    double d = 3.141592653589793;
    
    printf("char: %c (size: %zu)\n", c, sizeof(c));
    printf("int: %d (size: %zu)\n", i, sizeof(i));
    printf("long long: %lld (size: %zu)\n", ll, sizeof(ll));
    printf("float: %.2f (size: %zu)\n", f, sizeof(f));
    printf("double: %.15f (size: %zu)\n", d, sizeof(d));
    
    return 0;
}
```

### 2. Modern C++ with Smart Pointers
```cpp
#include <iostream>
#include <memory>
#include <vector>

int main() {
    // C++11 smart pointers
    auto ptr = std::make_unique<int>(42);
    std::cout << "Smart pointer: " << *ptr << std::endl;
    
    // C++11 initializer lists
    std::vector<int> vec = {1, 2, 3, 4, 5};
    
    // C++11 range-based for loop
    for (const auto& item : vec) {
        std::cout << item << " ";
    }
    std::cout << std::endl;
    
    return 0;
}
```

### 3. Standard Library Functions
```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <math.h>

int main() {
    // String functions
    char str[50] = "Hello";
    strcat(str, " World");
    printf("String: %s (length: %zu)\n", str, strlen(str));
    
    // Math functions
    double x = 16.0;
    printf("sqrt(%.1f) = %.2f\n", x, sqrt(x));
    printf("sin(PI/2) = %.2f\n", sin(3.14159/2));
    
    // Memory allocation
    int* arr = (int*)malloc(5 * sizeof(int));
    for (int i = 0; i < 5; i++) {
        arr[i] = i * i;
        printf("arr[%d] = %d\n", i, arr[i]);
    }
    free(arr);
    
    return 0;
}
```

### 4. Preprocessor Macros
```c
#include <stdio.h>

#define MAX_SIZE 100
#define SQUARE(x) ((x) * (x))
#define DEBUG 1

#if DEBUG
#define LOG(msg) printf("DEBUG: %s\n", msg)
#else
#define LOG(msg)
#endif

int main() {
    LOG("Program started");
    
    int size = MAX_SIZE;
    int result = SQUARE(5);
    
    printf("Size: %d\n", size);
    printf("Square of 5: %d\n", result);
    
    #ifdef MAX_SIZE
    printf("MAX_SIZE is defined as %d\n", MAX_SIZE);
    #endif
    
    return 0;
}
```

### 5. Format Specifiers (printf/scanf)
```c
#include <stdio.h>
#include <stdint.h>

int main() {
    int i = 42;
    long l = 42L;
    long long ll = 42LL;
    unsigned u = 42U;
    float f = 3.14F;
    double d = 3.14159;
    char c = 'A';
    char* s = "Hello";
    void* p = &i;
    size_t sz = sizeof(int);
    
    printf("int: %d\n", i);
    printf("long: %ld\n", l);
    printf("long long: %lld\n", ll);
    printf("unsigned: %u\n", u);
    printf("float: %f\n", f);
    printf("double: %lf\n", d);
    printf("char: %c\n", c);
    printf("string: %s\n", s);
    printf("pointer: %p\n", p);
    printf("size_t: %zu\n", sz);
    
    return 0;
}
```

## Error Detection Examples

The enhanced compiler provides comprehensive error detection:

### Syntax Errors
```c
int main() {
    int x = 42  // Missing semicolon - ERROR
    return 0;
}
```

### Semantic Errors
```c
#include <stdio.h>
int main() {
    printf("%d\n", undeclaredVar);  // Undeclared variable - ERROR
    return 0;
}
```

### Type Warnings
```c
int main() {
    int x = 3.14;  // Implicit conversion warning
    return 0;
}
```

### Memory Warnings
```cpp
#include <iostream>
int main() {
    int* ptr = new int(42);  // Memory leak warning (no delete)
    return 0;
}
```

## Standard Compliance

### C Standards
- **C89**: Basic ANSI C features
- **C99**: Inline functions, VLAs, C++ comments
- **C11**: Generic selections, static assertions
- **C17**: Bug fixes and clarifications

### C++ Standards  
- **C++11**: Auto, lambdas, smart pointers, range-for
- **C++14**: Generic lambdas, variable templates
- **C++17**: Structured bindings, if constexpr
- **C++20**: Concepts, ranges, coroutines

## Tips for Best Results

1. **Include Headers**: Always include necessary headers for functions you use
2. **Use Standard Types**: Prefer standard types (int, long, etc.) over platform-specific ones
3. **Check Warnings**: Pay attention to compiler warnings - they often indicate real issues
4. **Memory Management**: Always pair malloc/free and new/delete
5. **Format Specifiers**: Use correct printf format specifiers for each type

## Testing Your Code

The compiler includes built-in tests. You can run them to verify functionality:

```typescript
// In browser console or test environment
import { runAllTests } from './src/test/cppCompilerTest';
await runAllTests();
```

## Getting Help

- Check the error panel for detailed error messages with line numbers
- Use the enhanced error detection for syntax and semantic issues
- Refer to the full documentation in `CPP_COMPILER_ENHANCEMENT.md`
- All standard C/C++ references apply - this compiler follows GCC/Clang behavior

## What's New

Compared to the previous version, you now get:
- ✅ Full standard library support (stdio.h, iostream, etc.)
- ✅ Proper type sizes matching GCC/Clang
- ✅ Comprehensive error detection with helpful messages
- ✅ Support for all C/C++ standards
- ✅ Preprocessor macro support
- ✅ Memory leak detection
- ✅ Format specifier validation
- ✅ Advanced syntax analysis

Start coding with confidence - your C/C++ programs will behave exactly like they would with GCC or Clang!