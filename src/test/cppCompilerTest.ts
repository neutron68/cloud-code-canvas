// Test suite for enhanced C/C++ compiler functionality
import { enhancedCppExecutor } from '../lib/enhancedCppExecutor';
import { getCompilerConfig, validateCodeFeatures, TYPE_SIZES } from '../lib/cppCompilerConfig';
import { getSizeof, STANDARD_CONSTANTS } from '../lib/standardLibrary';

// Test C standards compliance
export const testCStandards = async () => {
  const testCodes = {
    c89: `
#include <stdio.h>
int main() {
    int x = 42;
    printf("C89 test: %d\\n", x);
    return 0;
}`,
    c99: `
#include <stdio.h>
#include <stdbool.h>
int main() {
    bool flag = true;
    for (int i = 0; i < 5; i++) {
        printf("C99 test: %d\\n", i);
    }
    return 0;
}`,
    c11: `
#include <stdio.h>
#include <stdint.h>
int main() {
    int32_t value = INT32_MAX;
    printf("C11 test: %d\\n", value);
    return 0;
}`,
  };

  const results = [];
  for (const [standard, code] of Object.entries(testCodes)) {
    try {
      const result = await enhancedCppExecutor.execute({
        code,
        language: 'c',
        standard,
      });
      results.push({ standard, success: result.status === 'success', output: result.output });
    } catch (error) {
      results.push({ standard, success: false, error: error.message });
    }
  }
  return results;
};

// Test C++ standards compliance
export const testCppStandards = async () => {
  const testCodes = {
    'c++11': `
#include <iostream>
#include <vector>
#include <memory>
int main() {
    auto ptr = std::make_shared<int>(42);
    std::vector<int> vec = {1, 2, 3, 4, 5};
    std::cout << "C++11 test: " << *ptr << std::endl;
    return 0;
}`,
    'c++17': `
#include <iostream>
#include <optional>
int main() {
    std::optional<int> opt = 42;
    if (opt.has_value()) {
        std::cout << "C++17 test: " << opt.value() << std::endl;
    }
    return 0;
}`,
  };

  const results = [];
  for (const [standard, code] of Object.entries(testCodes)) {
    try {
      const result = await enhancedCppExecutor.execute({
        code,
        language: 'cpp',
        standard,
      });
      results.push({ standard, success: result.status === 'success', output: result.output });
    } catch (error) {
      results.push({ standard, success: false, error: error.message });
    }
  }
  return results;
};
// Test primitive types and sizeof behavior
export const testPrimitiveTypes = () => {
  const typeTests = [
    { type: 'char', expectedSize: 1 },
    { type: 'short', expectedSize: 2 },
    { type: 'int', expectedSize: 4 },
    { type: 'long', expectedSize: 4 },
    { type: 'long long', expectedSize: 8 },
    { type: 'float', expectedSize: 4 },
    { type: 'double', expectedSize: 8 },
    { type: 'long double', expectedSize: 16 },
    { type: 'void*', expectedSize: 8 },
    { type: 'size_t', expectedSize: 8 },
  ];

  const results = typeTests.map(({ type, expectedSize }) => {
    const actualSize = getSizeof(type);
    return {
      type,
      expectedSize,
      actualSize,
      matches: actualSize === expectedSize,
    };
  });

  return results;
};

// Test literal suffixes
export const testLiteralSuffixes = async () => {
  const code = `
#include <stdio.h>
int main() {
    long longVal = 42L;
    long long llVal = 42LL;
    unsigned int uVal = 42U;
    unsigned long ulVal = 42UL;
    float floatVal = 3.14F;
    long double ldVal = 3.14L;
    
    printf("long: %ld\\n", longVal);
    printf("long long: %lld\\n", llVal);
    printf("unsigned: %u\\n", uVal);
    printf("unsigned long: %lu\\n", ulVal);
    printf("float: %f\\n", floatVal);
    printf("long double: %Lf\\n", ldVal);
    
    return 0;
}`;

  try {
    const result = await enhancedCppExecutor.execute({
      code,
      language: 'c',
    });
    return { success: result.status === 'success', output: result.output };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Test format specifiers
export const testFormatSpecifiers = async () => {
  const code = `
#include <stdio.h>
int main() {
    int i = 42;
    long l = 42L;
    long long ll = 42LL;
    unsigned u = 42U;
    float f = 3.14f;
    double d = 3.14;
    char c = 'A';
    char* s = "Hello";
    void* p = &i;
    
    printf("int: %d\\n", i);
    printf("long: %ld\\n", l);
    printf("long long: %lld\\n", ll);
    printf("unsigned: %u\\n", u);
    printf("float: %f\\n", f);
    printf("double: %lf\\n", d);
    printf("char: %c\\n", c);
    printf("string: %s\\n", s);
    printf("pointer: %p\\n", p);
    
    return 0;
}`;

  try {
    const result = await enhancedCppExecutor.execute({
      code,
      language: 'c',
    });
    return { success: result.status === 'success', output: result.output };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
// Test standard library support
export const testStandardLibrary = async () => {
  const code = `
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <math.h>
#include <limits.h>

int main() {
    // stdio.h functions
    printf("Hello, World!\\n");
    
    // stdlib.h functions
    int* ptr = (int*)malloc(sizeof(int));
    *ptr = 42;
    printf("Allocated value: %d\\n", *ptr);
    free(ptr);
    
    // string.h functions
    char str1[20] = "Hello";
    char str2[] = " World";
    strcat(str1, str2);
    printf("Concatenated: %s\\n", str1);
    printf("Length: %zu\\n", strlen(str1));
    
    // math.h functions
    double x = 16.0;
    printf("sqrt(%.1f) = %.2f\\n", x, sqrt(x));
    printf("sin(PI/2) = %.2f\\n", sin(3.14159/2));
    
    // limits.h constants
    printf("INT_MAX: %d\\n", INT_MAX);
    printf("CHAR_BIT: %d\\n", CHAR_BIT);
    
    return 0;
}`;

  try {
    const result = await enhancedCppExecutor.execute({
      code,
      language: 'c',
    });
    return { success: result.status === 'success', output: result.output };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Test preprocessor support
export const testPreprocessor = async () => {
  const code = `
#include <stdio.h>

#define MAX_SIZE 100
#define SQUARE(x) ((x) * (x))

#ifdef MAX_SIZE
#define BUFFER_SIZE MAX_SIZE
#else
#define BUFFER_SIZE 50
#endif

int main() {
    printf("MAX_SIZE: %d\\n", MAX_SIZE);
    printf("BUFFER_SIZE: %d\\n", BUFFER_SIZE);
    printf("SQUARE(5): %d\\n", SQUARE(5));
    
    #if MAX_SIZE > 50
    printf("Large buffer mode\\n");
    #else
    printf("Small buffer mode\\n");
    #endif
    
    return 0;
}`;

  try {
    const result = await enhancedCppExecutor.execute({
      code,
      language: 'c',
    });
    return { success: result.status === 'success', output: result.output };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Test error handling and validation
export const testErrorHandling = () => {
  const invalidCodes = [
    {
      name: 'Missing semicolon',
      code: `
int main() {
    int x = 42
    return 0;
}`,
    },
    {
      name: 'Undeclared variable',
      code: `
#include <stdio.h>
int main() {
    printf("%d\\n", undeclaredVar);
    return 0;
}`,
    },
    {
      name: 'Type mismatch',
      code: `
int main() {
    int x = 3.14;
    return 0;
}`,
    },
  ];

  const results = [];
  for (const { name, code } of invalidCodes) {
    const validation = validateCodeFeatures(code, 'c');
    results.push({
      name,
      hasErrors: !validation.valid,
      errors: validation.errors,
      warnings: validation.warnings,
    });
  }

  return results;
};

// Run all tests
export const runAllTests = async () => {
  console.log('Running C/C++ Compiler Tests...\n');

  console.log('1. Testing C Standards:');
  const cResults = await testCStandards();
  cResults.forEach(result => {
    console.log(`  ${result.standard}: ${result.success ? 'PASS' : 'FAIL'}`);
  });

  console.log('\n2. Testing C++ Standards:');
  const cppResults = await testCppStandards();
  cppResults.forEach(result => {
    console.log(`  ${result.standard}: ${result.success ? 'PASS' : 'FAIL'}`);
  });

  console.log('\n3. Testing Primitive Types:');
  const typeResults = testPrimitiveTypes();
  typeResults.forEach(result => {
    console.log(`  ${result.type}: ${result.matches ? 'PASS' : 'FAIL'} (expected: ${result.expectedSize}, got: ${result.actualSize})`);
  });

  console.log('\n4. Testing Literal Suffixes:');
  const literalResult = await testLiteralSuffixes();
  console.log(`  Literal suffixes: ${literalResult.success ? 'PASS' : 'FAIL'}`);

  console.log('\n5. Testing Format Specifiers:');
  const formatResult = await testFormatSpecifiers();
  console.log(`  Format specifiers: ${formatResult.success ? 'PASS' : 'FAIL'}`);

  console.log('\n6. Testing Standard Library:');
  const stdlibResult = await testStandardLibrary();
  console.log(`  Standard library: ${stdlibResult.success ? 'PASS' : 'FAIL'}`);

  console.log('\n7. Testing Preprocessor:');
  const preprocessorResult = await testPreprocessor();
  console.log(`  Preprocessor: ${preprocessorResult.success ? 'PASS' : 'FAIL'}`);

  console.log('\n8. Testing Error Handling:');
  const errorResults = testErrorHandling();
  errorResults.forEach(result => {
    console.log(`  ${result.name}: ${result.hasErrors ? 'PASS' : 'FAIL'} (detected errors as expected)`);
  });

  console.log('\nAll tests completed!');
};