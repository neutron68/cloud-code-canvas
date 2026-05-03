# OmniCode Backend Architecture

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React)                         │
│                                                                   │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐      │
│  │   Monaco     │    │  Workspace   │    │   Terminal   │      │
│  │   Editor     │───▶│  Component   │───▶│   Output     │      │
│  └──────────────┘    └──────────────┘    └──────────────┘      │
│                             │                                     │
│                             ▼                                     │
│                    ┌─────────────────┐                           │
│                    │ codeExecution.ts│                           │
│                    └─────────────────┘                           │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              │ HTTP POST /api/run
                              │ { language, code, input }
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND (Node.js + Express)                   │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                      API Layer                              │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │ │
│  │  │ POST /api/run│  │GET /api/status│  │GET /api/health│   │ │
│  │  └──────────────┘  └──────────────┘  └──────────────┘    │ │
│  └────────────────────────────────────────────────────────────┘ │
│                              │                                    │
│                              ▼                                    │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                  Execution Service                          │ │
│  │  • Route to appropriate executor                           │ │
│  │  • Manage concurrent executions (max 5)                    │ │
│  │  • Validate requests                                       │ │
│  └────────────────────────────────────────────────────────────┘ │
│                              │                                    │
│              ┌───────────────┼───────────────┐                   │
│              ▼               ▼               ▼                   │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐            │
│  │    Java      │ │      C       │ │     C++      │            │
│  │  Executor    │ │  Executor    │ │  Executor    │            │
│  └──────────────┘ └──────────────┘ └──────────────┘            │
│         │                │                │                      │
│         └────────────────┴────────────────┘                      │
│                          │                                        │
│                          ▼                                        │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                    Utilities                                │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │ │
│  │  │File Manager  │  │Process Runner│  │   Logger     │    │ │
│  │  │• Create temp │  │• Spawn child │  │• Winston     │    │ │
│  │  │• Write files │  │• Timeout     │  │• File logs   │    │ │
│  │  │• Cleanup     │  │• Capture I/O │  │• Levels      │    │ │
│  │  └──────────────┘  └──────────────┘  └──────────────┘    │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      SYSTEM COMPILERS                            │
│                                                                   │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐      │
│  │    javac     │    │     gcc      │    │     g++      │      │
│  │    java      │    │   ./main     │    │   ./main     │      │
│  └──────────────┘    └──────────────┘    └──────────────┘      │
└─────────────────────────────────────────────────────────────────┘
```

## 📊 Execution Flow

### Successful Execution:

```
1. User writes code in Monaco Editor
   ↓
2. User clicks "Run" button
   ↓
3. Frontend calls executeCode()
   ↓
4. executeInCloud() sends HTTP POST to backend
   ↓
5. Backend receives request at /api/run
   ↓
6. Execution Service validates request
   ↓
7. Routes to appropriate executor (Java/C/C++)
   ↓
8. Executor creates unique temp directory
   ↓
9. Executor writes source file
   ↓
10. Executor compiles code (javac/gcc/g++)
    ↓
11. If compilation fails → Return error
    ↓
12. If compilation succeeds → Execute program
    ↓
13. Process Runner spawns child process
    ↓
14. Captures stdout and stderr
    ↓
15. Monitors for timeout (5 seconds)
    ↓
16. Process completes or times out
    ↓
17. Executor cleans up temp directory
    ↓
18. Returns result to Execution Service
    ↓
19. Service formats response
    ↓
20. Backend sends JSON response
    ↓
21. Frontend receives result
    ↓
22. Terminal displays output
```

### With Fallback:

```
Frontend tries backend
   ↓
Backend fails (offline/error)
   ↓
Frontend tries Supabase/Judge0
   ↓
Cloud fails (no API key)
   ↓
Frontend uses browser simulation
   ↓
Display result
```

## 🔄 Component Interactions

### Java Execution:

```
┌─────────────────────────────────────────────────────────────┐
│                      Java Executor                           │
│                                                               │
│  1. Extract class name from code                            │
│     ↓                                                         │
│  2. Create temp directory: /temp/exec_uuid/                 │
│     ↓                                                         │
│  3. Write file: Main.java                                   │
│     ↓                                                         │
│  4. Compile: javac -encoding UTF-8 Main.java               │
│     ↓                                                         │
│  5. Check compilation result                                │
│     ├─ Success → Continue                                   │
│     └─ Failure → Return compilation error                   │
│     ↓                                                         │
│  6. Execute: java -Dfile.encoding=UTF-8 Main                │
│     ↓                                                         │
│  7. Monitor execution (timeout: 5s)                         │
│     ↓                                                         │
│  8. Capture stdout and stderr                               │
│     ↓                                                         │
│  9. Process completes                                       │
│     ├─ Success → Return output                              │
│     ├─ Error → Return runtime error                         │
│     └─ Timeout → Kill process, return timeout error         │
│     ↓                                                         │
│  10. Cleanup: Delete temp directory                         │
│     ↓                                                         │
│  11. Return result                                          │
└─────────────────────────────────────────────────────────────┘
```

### C/C++ Execution:

```
┌─────────────────────────────────────────────────────────────┐
│                    C/C++ Executor                            │
│                                                               │
│  1. Create temp directory: /temp/exec_uuid/                 │
│     ↓                                                         │
│  2. Write file: main.c or main.cpp                          │
│     ↓                                                         │
│  3. Compile: gcc/g++ -Wall -std=c11/c++17 main.c/cpp -o main│
│     ↓                                                         │
│  4. Check compilation result                                │
│     ├─ Success → Continue                                   │
│     └─ Failure → Return compilation error                   │
│     ↓                                                         │
│  5. Execute: ./main (or main.exe on Windows)                │
│     ↓                                                         │
│  6. Monitor execution (timeout: 5s)                         │
│     ↓                                                         │
│  7. Capture stdout and stderr                               │
│     ↓                                                         │
│  8. Process completes                                       │
│     ├─ Success → Return output                              │
│     ├─ Error → Return runtime error                         │
│     └─ Timeout → Kill process, return timeout error         │
│     ↓                                                         │
│  9. Cleanup: Delete temp directory and executable           │
│     ↓                                                         │
│  10. Return result                                          │
└─────────────────────────────────────────────────────────────┘
```

## 🔒 Security Layers

```
┌─────────────────────────────────────────────────────────────┐
│                      Security Layers                         │
│                                                               │
│  Layer 1: Request Validation                                │
│  ├─ Validate language                                       │
│  ├─ Validate code exists                                    │
│  └─ Check concurrent execution limit                        │
│                                                               │
│  Layer 2: Isolation                                         │
│  ├─ Unique temp directory per execution                     │
│  ├─ No access to parent directories                         │
│  └─ Process runs in isolated environment                    │
│                                                               │
│  Layer 3: Resource Limits                                   │
│  ├─ Timeout: 5 seconds maximum                              │
│  ├─ Output size: 1MB maximum                                │
│  └─ Concurrent executions: 5 maximum                        │
│                                                               │
│  Layer 4: Process Management                                │
│  ├─ Child process spawned with spawn()                      │
│  ├─ Process killed on timeout                               │
│  └─ Cleanup guaranteed (even on failure)                    │
│                                                               │
│  Layer 5: Cleanup                                           │
│  ├─ Temp files deleted after execution                      │
│  ├─ Automatic cleanup of old directories                    │
│  └─ Cleanup runs even if execution fails                    │
└─────────────────────────────────────────────────────────────┘
```

## 📁 File System Structure

```
backend/
├── src/
│   ├── config/
│   │   └── config.js              # Centralized configuration
│   │
│   ├── services/
│   │   ├── executionService.js    # Main orchestrator
│   │   └── executor/
│   │       ├── javaExecutor.js    # Java-specific logic
│   │       ├── cExecutor.js       # C-specific logic
│   │       └── cppExecutor.js     # C++-specific logic
│   │
│   ├── utils/
│   │   ├── fileManager.js         # File operations
│   │   ├── processRunner.js       # Process management
│   │   └── logger.js              # Logging utility
│   │
│   ├── routes/
│   │   └── runRoute.js            # API endpoints
│   │
│   ├── test/
│   │   └── testRunner.js          # Test suite
│   │
│   └── server.js                  # Main entry point
│
├── temp/                          # Temporary execution directories
│   ├── exec_uuid1/                # Isolated execution 1
│   │   ├── Main.java
│   │   ├── Main.class
│   │   └── input.txt
│   ├── exec_uuid2/                # Isolated execution 2
│   │   ├── main.c
│   │   └── main
│   └── ...
│
├── logs/                          # Log files
│   ├── execution.log              # All logs
│   └── error.log                  # Error logs only
│
├── package.json                   # Dependencies
├── .env                           # Environment variables
└── README.md                      # Documentation
```

## 🔄 Data Flow

### Request Format:

```json
POST /api/run
{
  "language": "java",
  "code": "public class Main { ... }",
  "input": "optional stdin"
}
```

### Response Format:

```json
{
  "success": true,
  "stdout": "Program output",
  "stderr": "",
  "compile_output": "",
  "status": {
    "id": 3,
    "description": "Accepted"
  },
  "time": 0.123,
  "memory": 0
}
```

### Status Codes:

```
3  - Accepted (Success)
5  - Time Limit Exceeded
6  - Compilation Error
11 - Runtime Error
13 - Internal Error
```

## 🎯 Design Principles

### 1. Modularity
```
Each language has its own executor
Each utility has a single responsibility
Clean separation of concerns
```

### 2. Isolation
```
Unique directory per execution
No shared state between executions
Process-level isolation
```

### 3. Reliability
```
Guaranteed cleanup (finally blocks)
Timeout protection
Error handling at every level
```

### 4. Scalability
```
Concurrent execution support
Non-blocking operations
Resource limits
```

### 5. Maintainability
```
Clear code structure
Comprehensive logging
Extensive documentation
Test coverage
```

## 📊 Performance Characteristics

### Latency:
```
Request → Backend:        ~10ms
Compilation (Java):       ~1-2s
Compilation (C/C++):      ~0.5-1s
Execution:                ~0.1-5s
Cleanup:                  ~50ms
Total:                    ~1-8s
```

### Resource Usage:
```
Base memory:              ~50MB
Per execution:            ~10-20MB
Disk (temp files):        ~1-5KB
CPU:                      Depends on code
```

### Throughput:
```
Concurrent executions:    5 maximum
Requests per second:      ~1-5 (depends on code)
```

## 🔍 Monitoring Points

### Health Metrics:
```
GET /api/health
- Server status
- Active executions
- Timestamp
```

### System Status:
```
GET /api/status
- Compiler availability
- Compiler versions
- Active executions
- Max concurrent limit
```

### Logs:
```
logs/execution.log
- All operations
- Execution times
- Errors
- Cleanup events
```

## 🚀 Deployment Architecture

### Development:
```
Frontend (Vite):     http://localhost:8081
Backend (Node.js):   http://localhost:3001
```

### Production:
```
Frontend (Static):   https://omnicode.com
Backend (Node.js):   https://api.omnicode.com
Load Balancer:       Nginx/HAProxy
Process Manager:     PM2
```

---

**This architecture provides a robust, secure, and scalable code execution engine for OmniCode IDE.**
