/**
 * Test Runner for OmniCode Execution Engine
 * Tests all language executors with various test cases
 */

import javaExecutor from '../services/executor/javaExecutor.js';
import cExecutor from '../services/executor/cExecutor.js';
import cppExecutor from '../services/executor/cppExecutor.js';
import logger from '../utils/logger.js';

// Test cases
const tests = {
  java: [
    {
      name: 'Hello World',
      code: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,
      input: '',
      expectedOutput: 'Hello, World!',
    },
    {
      name: 'Input/Output',
      code: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String name = sc.nextLine();
        System.out.println("Hello, " + name + "!");
        sc.close();
    }
}`,
      input: 'Alice',
      expectedOutput: 'Hello, Alice!',
    },
    {
      name: 'Loop',
      code: `public class Main {
    public static void main(String[] args) {
        for (int i = 1; i <= 5; i++) {
            System.out.println(i);
        }
    }
}`,
      input: '',
      expectedOutput: '1\n2\n3\n4\n5',
    },
    {
      name: 'Compilation Error',
      code: `public class Main {
    public static void main(String[] args) {
        System.out.println("Missing semicolon")
    }
}`,
      input: '',
      shouldFail: true,
    },
  ],
  
  c: [
    {
      name: 'Hello World',
      code: `#include <stdio.h>
int main() {
    printf("Hello, World!\\n");
    return 0;
}`,
      input: '',
      expectedOutput: 'Hello, World!',
    },
    {
      name: 'Input/Output',
      code: `#include <stdio.h>
int main() {
    char name[100];
    scanf("%s", name);
    printf("Hello, %s!\\n", name);
    return 0;
}`,
      input: 'Bob',
      expectedOutput: 'Hello, Bob!',
    },
    {
      name: 'Loop',
      code: `#include <stdio.h>
int main() {
    for (int i = 1; i <= 5; i++) {
        printf("%d\\n", i);
    }
    return 0;
}`,
      input: '',
      expectedOutput: '1\n2\n3\n4\n5',
    },
    {
      name: 'Compilation Error',
      code: `#include <stdio.h>
int main() {
    printf("Missing semicolon")
    return 0;
}`,
      input: '',
      shouldFail: true,
    },
  ],
  
  cpp: [
    {
      name: 'Hello World',
      code: `#include <iostream>
using namespace std;
int main() {
    cout << "Hello, World!" << endl;
    return 0;
}`,
      input: '',
      expectedOutput: 'Hello, World!',
    },
    {
      name: 'Input/Output',
      code: `#include <iostream>
#include <string>
using namespace std;
int main() {
    string name;
    cin >> name;
    cout << "Hello, " << name << "!" << endl;
    return 0;
}`,
      input: 'Charlie',
      expectedOutput: 'Hello, Charlie!',
    },
    {
      name: 'Loop',
      code: `#include <iostream>
using namespace std;
int main() {
    for (int i = 1; i <= 5; i++) {
        cout << i << endl;
    }
    return 0;
}`,
      input: '',
      expectedOutput: '1\n2\n3\n4\n5',
    },
    {
      name: 'Compilation Error',
      code: `#include <iostream>
using namespace std;
int main() {
    cout << "Missing semicolon"
    return 0;
}`,
      input: '',
      shouldFail: true,
    },
  ],
};

// Run tests
async function runTests() {
  console.log('🧪 Starting OmniCode Execution Engine Tests\n');
  
  const executors = {
    java: javaExecutor,
    c: cExecutor,
    cpp: cppExecutor,
  };
  
  let totalTests = 0;
  let passedTests = 0;
  let failedTests = 0;
  
  for (const [language, testCases] of Object.entries(tests)) {
    console.log(`\n📝 Testing ${language.toUpperCase()}`);
    console.log('='.repeat(50));
    
    const executor = executors[language];
    
    // Check if compiler is available
    const available = await executor.isAvailable();
    if (!available) {
      console.log(`⚠️  ${language} compiler not available, skipping tests`);
      continue;
    }
    
    const version = await executor.getVersion();
    console.log(`✓ Compiler available: ${version}\n`);
    
    for (const test of testCases) {
      totalTests++;
      console.log(`  Test: ${test.name}`);
      
      try {
        const result = await executor.execute(test.code, test.input);
        
        if (test.shouldFail) {
          // Test should fail (compilation error)
          if (!result.success) {
            console.log(`  ✓ PASS (expected failure)`);
            passedTests++;
          } else {
            console.log(`  ✗ FAIL (expected failure but succeeded)`);
            failedTests++;
          }
        } else {
          // Test should succeed
          if (result.success) {
            const output = result.stdout.trim();
            const expected = test.expectedOutput.trim();
            
            if (output === expected) {
              console.log(`  ✓ PASS`);
              passedTests++;
            } else {
              console.log(`  ✗ FAIL (output mismatch)`);
              console.log(`    Expected: ${expected}`);
              console.log(`    Got: ${output}`);
              failedTests++;
            }
          } else {
            console.log(`  ✗ FAIL (execution failed)`);
            console.log(`    Error: ${result.stderr}`);
            failedTests++;
          }
        }
        
        console.log(`    Time: ${result.time.toFixed(3)}s\n`);
        
      } catch (error) {
        console.log(`  ✗ FAIL (exception)`);
        console.log(`    Error: ${error.message}\n`);
        failedTests++;
      }
    }
  }
  
  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 Test Summary');
  console.log('='.repeat(50));
  console.log(`Total Tests: ${totalTests}`);
  console.log(`✓ Passed: ${passedTests}`);
  console.log(`✗ Failed: ${failedTests}`);
  console.log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
  
  if (failedTests === 0) {
    console.log('\n🎉 All tests passed!');
  } else {
    console.log(`\n⚠️  ${failedTests} test(s) failed`);
  }
}

// Run tests
runTests().catch(error => {
  console.error('Test runner error:', error);
  process.exit(1);
});
