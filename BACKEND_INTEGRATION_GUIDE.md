# Backend Integration Guide for OmniCode

## 📋 Overview

This guide explains how to integrate the new Node.js backend execution engine with your existing OmniCode frontend.

## 🏗️ Architecture

### Before (Current):
```
Frontend → Supabase Edge Function → Judge0 API (Cloud)
                ↓ (fallback)
         Browser Simulation (JSCPP, custom interpreters)
```

### After (New):
```
Frontend → Node.js Backend → Real Compilers (javac, gcc, g++)
                ↓ (fallback)
         Browser Simulation (existing)
```

## 🚀 Setup Steps

### Step 1: Install Backend Dependencies

```bash
cd backend
npm install
```

### Step 2: Verify Compilers

```bash
# Check Java
javac -version
java -version

# Check C/C++
gcc --version
g++ --version
```

If any compiler is missing, install it (see backend/README.md).

### Step 3: Start Backend Server

```bash
# Terminal 1: Start backend
cd backend
npm run dev

# Terminal 2: Start frontend (existing)
npm run dev
```

Backend runs on: `http://localhost:3001`
Frontend runs on: `http://localhost:8081`

### Step 4: Update Frontend Code

#### Option A: Modify Existing Code (Recommended)

Update `src/lib/codeExecution.ts`:

```typescript
private async executeInCloud(options: ExecutionOptions): Promise<ExecutionResult | null> {
  // Try local backend first
  try {
    const response = await fetch('http://localhost:3001/api/run', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        language: options.language,
        code: options.code,
        input: options.input || '',
      }),
    });

    if (!response.ok) {
      throw new Error(`Backend error: ${response.status}`);
    }

    const data = await response.json();

    // Convert backend response to ExecutionResult format
    return {
      output: data.stdout || '',
      error: data.stderr || data.compile_output || '',
      executionTime: (data.time || 0) * 1000, // Convert seconds to ms
      memoryUsage: data.memory || 0,
      status: data.success ? 'success' : 'error',
    };
  } catch (error) {
    console.error('Local backend execution failed:', error);
    
    // Fallback to Supabase/Judge0 if available
    try {
      const { data, error: supabaseError } = await supabase.functions.invoke("execute-code", {
        body: {
          source_code: options.code,
          language_id: judge0LanguageMap[options.language],
          stdin: options.input || '',
        },
      });

      if (supabaseError) throw supabaseError;

      return {
        output: data.stdout || '',
        error: data.stderr || '',
        executionTime: (data.time || 0) * 1000,
        memoryUsage: data.memory || 0,
        status: data.status?.id === 3 ? 'success' : 'error',
      };
    } catch (cloudError) {
      console.error('Cloud execution also failed:', cloudError);
      return null; // Fall back to browser simulation
    }
  }
}
```

#### Option B: Create New Backend Client

Create `src/lib/backendClient.ts`:

```typescript
/**
 * Backend Execution Client
 * Communicates with local Node.js backend
 */

export interface BackendExecutionOptions {
  language: string;
  code: string;
  input?: string;
}

export interface BackendExecutionResult {
  success: boolean;
  stdout: string;
  stderr: string;
  compile_output: string;
  status: {
    id: number;
    description: string;
  };
  time: number;
  memory: number;
}

class BackendClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
  }

  async execute(options: BackendExecutionOptions): Promise<BackendExecutionResult> {
    const response = await fetch(`${this.baseUrl}/api/run`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        language: options.language,
        code: options.code,
        input: options.input || '',
      }),
    });

    if (!response.ok) {
      throw new Error(`Backend error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  }

  async getStatus() {
    const response = await fetch(`${this.baseUrl}/api/status`);
    if (!response.ok) {
      throw new Error(`Status check failed: ${response.status}`);
    }
    return await response.json();
  }

  async healthCheck() {
    const response = await fetch(`${this.baseUrl}/api/health`);
    if (!response.ok) {
      throw new Error(`Health check failed: ${response.status}`);
    }
    return await response.json();
  }
}

export const backendClient = new BackendClient();
```

Then use it in `codeExecution.ts`:

```typescript
import { backendClient } from './backendClient';

private async executeInCloud(options: ExecutionOptions): Promise<ExecutionResult | null> {
  try {
    const result = await backendClient.execute({
      language: options.language,
      code: options.code,
      input: options.input,
    });

    return {
      output: result.stdout || '',
      error: result.stderr || result.compile_output || '',
      executionTime: result.time * 1000,
      memoryUsage: result.memory,
      status: result.success ? 'success' : 'error',
    };
  } catch (error) {
    console.error('Backend execution failed:', error);
    return null; // Fall back to simulation
  }
}
```

### Step 5: Add Environment Variable

Create/update `.env` in the frontend root:

```env
VITE_BACKEND_URL=http://localhost:3001
```

For production:
```env
VITE_BACKEND_URL=https://your-backend-domain.com
```

### Step 6: Update Package Scripts

Add to `package.json`:

```json
{
  "scripts": {
    "dev": "vite",
    "dev:backend": "cd backend && npm run dev",
    "dev:all": "concurrently \"npm run dev\" \"npm run dev:backend\"",
    "build": "vite build",
    "build:backend": "cd backend && npm start"
  }
}
```

Install concurrently for running both servers:
```bash
npm install --save-dev concurrently
```

Then run both with:
```bash
npm run dev:all
```

## 🧪 Testing the Integration

### Test 1: Java Hello World

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello from real Java compiler!");
    }
}
```

Expected output:
```
Hello from real Java compiler!
```

### Test 2: C with Input

```c
#include <stdio.h>
int main() {
    char name[100];
    scanf("%s", name);
    printf("Hello, %s!\n", name);
    return 0;
}
```

Input: `Alice`

Expected output:
```
Hello, Alice!
```

### Test 3: C++ Loop

```cpp
#include <iostream>
using namespace std;
int main() {
    for (int i = 1; i <= 5; i++) {
        cout << i << endl;
    }
    return 0;
}
```

Expected output:
```
1
2
3
4
5
```

### Test 4: Compilation Error

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Missing semicolon")
    }
}
```

Expected: Compilation error message

### Test 5: Infinite Loop (Timeout)

```java
public class Main {
    public static void main(String[] args) {
        while (true) {
            System.out.println("Loop");
        }
    }
}
```

Expected: "Time Limit Exceeded" after 5 seconds

## 🔄 Execution Flow

### Successful Execution:

1. User clicks "Run" in frontend
2. Frontend sends code to `http://localhost:3001/api/run`
3. Backend creates temp directory
4. Backend writes source file
5. Backend compiles code
6. Backend executes compiled program
7. Backend captures output
8. Backend cleans up temp files
9. Backend returns result to frontend
10. Frontend displays output

### With Fallback:

1. Frontend tries local backend
2. If backend fails → Try Supabase/Judge0
3. If cloud fails → Use browser simulation
4. Display result or error

## 📊 Response Format Comparison

### Backend Response:
```json
{
  "success": true,
  "stdout": "Hello, World!\n",
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

### Judge0 Response:
```json
{
  "stdout": "Hello, World!\n",
  "stderr": null,
  "compile_output": null,
  "status": {
    "id": 3,
    "description": "Accepted"
  },
  "time": "0.123",
  "memory": 15360
}
```

Both formats are compatible!

## 🔒 Security Considerations

### Development:
- Backend accepts requests from any origin (CORS: *)
- No authentication required
- Suitable for local development only

### Production:
1. **Update CORS** in `backend/src/server.js`:
```javascript
app.use(cors({
  origin: 'https://your-frontend-domain.com',
  credentials: true,
}));
```

2. **Add Authentication**:
```javascript
// Add API key middleware
app.use('/api', (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (apiKey !== process.env.API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
});
```

3. **Rate Limiting**:
```bash
npm install express-rate-limit
```

```javascript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

app.use('/api', limiter);
```

## 🚀 Deployment

### Option 1: Same Server

Deploy both frontend and backend on the same server:

```bash
# Build frontend
npm run build

# Start backend
cd backend
npm start

# Serve frontend with nginx
# Configure nginx to proxy /api to backend
```

### Option 2: Separate Servers

Deploy frontend and backend separately:

**Frontend** (Vercel/Netlify):
- Set `VITE_BACKEND_URL=https://api.omnicode.com`

**Backend** (VPS/Cloud):
- Deploy to DigitalOcean, AWS, etc.
- Use PM2 for process management
- Configure firewall and CORS

### Option 3: Docker

Create `backend/Dockerfile`:

```dockerfile
FROM node:18-alpine

# Install compilers
RUN apk add --no-cache openjdk11 gcc g++ make

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 3001

CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t omnicode-backend ./backend
docker run -p 3001:3001 omnicode-backend
```

## 📈 Monitoring

### Health Check

Add to your monitoring system:

```bash
# Check if backend is healthy
curl http://localhost:3001/api/health

# Check compiler status
curl http://localhost:3001/api/status
```

### Logs

Monitor logs in real-time:

```bash
tail -f backend/logs/execution.log
```

### Metrics

Track:
- Request count
- Average execution time
- Error rate
- Active executions
- Compiler availability

## 🐛 Troubleshooting

### Backend Not Responding

```bash
# Check if backend is running
curl http://localhost:3001/api/health

# Check logs
cat backend/logs/error.log

# Restart backend
cd backend
npm run dev
```

### CORS Errors

Update `backend/src/server.js`:
```javascript
app.use(cors({
  origin: 'http://localhost:8081', // Your frontend URL
  methods: ['GET', 'POST', 'OPTIONS'],
}));
```

### Compiler Not Found

```bash
# Check compiler availability
curl http://localhost:3001/api/status

# Install missing compilers (see backend/README.md)
```

## ✅ Verification Checklist

- [ ] Backend server starts without errors
- [ ] All compilers are available (`/api/status`)
- [ ] Java code executes correctly
- [ ] C code executes correctly
- [ ] C++ code executes correctly
- [ ] Input handling works
- [ ] Compilation errors are caught
- [ ] Runtime errors are caught
- [ ] Timeout protection works
- [ ] Frontend receives correct responses
- [ ] Fallback to simulation works
- [ ] Logs are being written
- [ ] Temp files are cleaned up

## 🎉 Success!

Once integrated, your OmniCode IDE will:
- ✅ Execute real Java, C, and C++ code
- ✅ Provide accurate compilation errors
- ✅ Handle user input correctly
- ✅ Protect against infinite loops
- ✅ Work offline (no API keys needed)
- ✅ Fall back gracefully if backend is unavailable

## 📞 Support

If you encounter issues:
1. Check backend logs: `backend/logs/execution.log`
2. Verify compilers: `curl http://localhost:3001/api/status`
3. Test backend directly: `curl -X POST http://localhost:3001/api/run -H "Content-Type: application/json" -d '{"language":"java","code":"..."}'`
4. Check frontend console for errors
5. Review this guide for missed steps

---

**Happy Coding! 🚀**
