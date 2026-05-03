/**
 * Quick Test - Verify Backend Setup
 * Run this to check if everything is working
 */

import javaExecutor from './src/services/executor/javaExecutor.js';
import cExecutor from './src/services/executor/cExecutor.js';
import cppExecutor from './src/services/executor/cppExecutor.js';

console.log('🧪 OmniCode Backend Quick Test\n');

// Test Java
console.log('📝 Testing Java...');
const javaAvailable = await javaExecutor.isAvailable();
if (javaAvailable) {
  console.log('✅ Java compiler available');
  const javaVersion = await javaExecutor.getVersion();
  console.log(`   Version: ${javaVersion}`);
  
  // Quick execution test
  const javaCode = `public class Main {
    public static void main(String[] args) {
        System.out.println("Java works!");
    }
}`;
  
  const javaResult = await javaExecutor.execute(javaCode);
  if (javaResult.success) {
    console.log('✅ Java execution test passed');
    console.log(`   Output: ${javaResult.stdout.trim()}`);
  } else {
    console.log('❌ Java execution test failed');
    console.log(`   Error: ${javaResult.stderr}`);
  }
} else {
  console.log('⚠️  Java compiler not available');
}

console.log('');

// Test C
console.log('📝 Testing C...');
const cAvailable = await cExecutor.isAvailable();
if (cAvailable) {
  console.log('✅ C compiler available');
  const cVersion = await cExecutor.getVersion();
  console.log(`   Version: ${cVersion}`);
  
  // Quick execution test
  const cCode = `#include <stdio.h>
int main() {
    printf("C works!\\n");
    return 0;
}`;
  
  const cResult = await cExecutor.execute(cCode);
  if (cResult.success) {
    console.log('✅ C execution test passed');
    console.log(`   Output: ${cResult.stdout.trim()}`);
  } else {
    console.log('❌ C execution test failed');
    console.log(`   Error: ${cResult.stderr}`);
  }
} else {
  console.log('⚠️  C compiler not available');
}

console.log('');

// Test C++
console.log('📝 Testing C++...');
const cppAvailable = await cppExecutor.isAvailable();
if (cppAvailable) {
  console.log('✅ C++ compiler available');
  const cppVersion = await cppExecutor.getVersion();
  console.log(`   Version: ${cppVersion}`);
  
  // Quick execution test
  const cppCode = `#include <iostream>
using namespace std;
int main() {
    cout << "C++ works!" << endl;
    return 0;
}`;
  
  const cppResult = await cppExecutor.execute(cppCode);
  if (cppResult.success) {
    console.log('✅ C++ execution test passed');
    console.log(`   Output: ${cppResult.stdout.trim()}`);
  } else {
    console.log('❌ C++ execution test failed');
    console.log(`   Error: ${cppResult.stderr}`);
  }
} else {
  console.log('⚠️  C++ compiler not available');
}

console.log('');
console.log('✅ Quick test complete!');
console.log('');
console.log('Next steps:');
console.log('1. Start the server: npm run dev');
console.log('2. Test the API: curl http://localhost:3001/api/health');
console.log('3. Integrate with frontend (see BACKEND_INTEGRATION_GUIDE.md)');
