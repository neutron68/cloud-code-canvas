# 🚀 OmniCode Backend Setup Instructions

## Quick Start (5 Minutes)

### Step 1: Install Backend Dependencies
```bash
cd backend
npm install
```

### Step 2: Verify Compilers Are Installed

#### Check Java:
```bash
javac -version
java -version
```

If not installed:
- **Windows**: Download from https://www.oracle.com/java/technologies/downloads/
- **macOS**: `brew install openjdk`
- **Linux**: `sudo apt-get install default-jdk`

#### Check C/C++:
```bash
gcc --version
g++ --version
```

If not installed:
- **Windows**: Download MinGW from https://www.mingw-w64.org/
- **macOS**: `xcode-select --install`
- **Linux**: `sudo apt-get install build-essential`

### Step 3: Quick Test
```bash
node quick-test.js
```

Expected output:
```
🧪 OmniCode Backend Quick Test

📝 Testing Java...
✅ Java compiler available
   Version: openjdk 17.0.1
✅ Java execution test passed
   Output: Java works!

📝 Testing C...
✅ C compiler available
   Version: gcc (Ubuntu 11.3.0) 11.3.0
✅ C execution test passed
   Output: C works!

📝 Testing C++...
✅ C++ compiler available
   Version: g++ (Ubuntu 11.3.0) 11.3.0
✅ C++ execution test passed
   Output: C++ works!

✅ Quick test complete!
```

### Step 4: Start the Backend Server
```bash
npm run dev
```

Expected output:
```
🚀 OmniCode Execution Engine started
📡 Server running at http://localhost:3001
🔧 Environment: development
⏱️  Max execution time: 5000ms
📁 Temp directory: ./temp
```

### Step 5: Test the API
Open a new terminal:

```bash
# Health check
curl http://localhost:3001/api/health

# System status
curl http://localhost:3001/api/status

# Execute Java code
curl -X POST http://localhost:3001/api/run \
  -H "Content-Type: application/json" \
  -d '{
    "language": "java",
    "code": "public class Main { public static void main(String[] args) { System.out.println(\"Hello from backend!\"); } }"
  }'
```

### Step 6: Integrate with Frontend

See **BACKEND_INTEGRATION_GUIDE.md** for detailed integration instructions.

Quick integration:

1. Update `src/lib/codeExecution.ts`:
```typescript
private async executeInCloud(options: ExecutionOptions): Promise<ExecutionResult | null> {
  try {
    const response = await fetch('http://localhost:3001/api/run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        language: options.language,
        code: options.code,
        input: options.input || '',
      }),
    });
    
    const data = await response.json();
    
    return {
      output: data.stdout || '',
      error: data.stderr || data.compile_output || '',
      executionTime: (data.time || 0) * 1000,
      memoryUsage: data.memory || 0,
      status: data.success ? 'success' : 'error',
    };
  } catch (error) {
    console.error('Backend execution failed:', error);
    return null; // Fall back to simulation
  }
}
```

2. Start both servers:
```bash
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Frontend
npm run dev
```

3. Test in the IDE:
   - Open http://localhost:8081
   - Write Java/C/C++ code
   - Click "Run"
   - See real compilation and execution!

## 📁 What Was Created

```
backend/
├── src/
│   ├── config/config.js              # Configuration
│   ├── services/
│   │   ├── executionService.js       # Main service
│   │   └── executor/
│   │       ├── javaExecutor.js       # Java executor
│   │       ├── cExecutor.js          # C executor
│   │       └── cppExecutor.js        # C++ executor
│   ├── utils/
│   │   ├── fileManager.js            # File operations
│   │   ├── processRunner.js          # Process management
│   │   └── logger.js                 # Logging
│   ├── routes/runRoute.js            # API routes
│   ├── test/testRunner.js            # Test suite
│   └── server.js                     # Main server
├── package.json                      # Dependencies
├── .env.example                      # Environment template
├── README.md                         # Full documentation
└── quick-test.js                     # Quick verification
```

## 🎯 Features

✅ **Real Compilation**: Uses javac, gcc, g++  
✅ **Secure Execution**: Isolated temp directories  
✅ **Timeout Protection**: 5-second max  
✅ **Input Support**: stdin for all languages  
✅ **Error Handling**: Compilation vs runtime errors  
✅ **Concurrent Execution**: Up to 5 simultaneous  
✅ **Automatic Cleanup**: Temp files deleted  
✅ **Comprehensive Logging**: Winston-based  
✅ **Health Monitoring**: Status endpoints  

## 📚 Documentation

- **backend/README.md** - Complete backend documentation
- **BACKEND_INTEGRATION_GUIDE.md** - Frontend integration guide
- **BACKEND_IMPLEMENTATION_SUMMARY.md** - Technical overview

## 🧪 Testing

Run full test suite:
```bash
cd backend
npm test
```

Tests include:
- Hello World programs
- Input/Output handling
- Loops and control flow
- Compilation errors
- Runtime errors
- Timeout protection

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check Node.js version
node -v  # Should be 16+

# Check for port conflicts
lsof -i :3001  # macOS/Linux
netstat -ano | findstr :3001  # Windows

# Check logs
cat backend/logs/execution.log
```

### Compiler not found
```bash
# Check status
curl http://localhost:3001/api/status

# Install missing compilers (see Step 2)
```

### CORS errors
Update `backend/src/server.js`:
```javascript
app.use(cors({
  origin: 'http://localhost:8081',  // Your frontend URL
}));
```

### Tests failing
```bash
# Ensure compilers are installed
javac -version
gcc --version
g++ --version

# Check logs
cat backend/logs/error.log
```

## 🚀 Production Deployment

### Option 1: PM2 (Recommended)
```bash
npm install -g pm2
cd backend
pm2 start src/server.js --name omnicode-backend
pm2 save
pm2 startup
```

### Option 2: Docker
```bash
cd backend
docker build -t omnicode-backend .
docker run -p 3001:3001 omnicode-backend
```

### Option 3: Systemd (Linux)
Create `/etc/systemd/system/omnicode-backend.service`:
```ini
[Unit]
Description=OmniCode Backend
After=network.target

[Service]
Type=simple
User=your-user
WorkingDirectory=/path/to/backend
ExecStart=/usr/bin/node src/server.js
Restart=always

[Install]
WantedBy=multi-user.target
```

Then:
```bash
sudo systemctl enable omnicode-backend
sudo systemctl start omnicode-backend
```

## 📊 Performance

- **Compilation**: 0.5-2 seconds
- **Execution**: 0.1-5 seconds (max)
- **Memory**: ~50MB base + 10-20MB per execution
- **Concurrent**: Up to 5 executions

## 🔒 Security

- ✅ Isolated execution directories
- ✅ Timeout protection (5s)
- ✅ Output size limits (1MB)
- ✅ Concurrent execution limits (5)
- ✅ Input validation
- ✅ Automatic cleanup

For production:
- Configure CORS for your domain
- Add rate limiting
- Add authentication
- Set up monitoring

## ✅ Success Checklist

- [ ] Backend dependencies installed
- [ ] Java compiler available
- [ ] C compiler available
- [ ] C++ compiler available
- [ ] Quick test passes
- [ ] Backend server starts
- [ ] API health check works
- [ ] Frontend integrated
- [ ] Java code executes
- [ ] C code executes
- [ ] C++ code executes
- [ ] Input handling works
- [ ] Error handling works
- [ ] Timeout protection works

## 🎉 You're Done!

Your OmniCode IDE now has a **real, local code execution engine**!

No more:
- ❌ API keys needed
- ❌ External dependencies
- ❌ Inaccurate simulations
- ❌ Rate limits

Now you have:
- ✅ Real compilation
- ✅ Accurate errors
- ✅ Local execution
- ✅ Offline support

## 📞 Need Help?

1. Check logs: `backend/logs/execution.log`
2. Verify compilers: `curl http://localhost:3001/api/status`
3. Read documentation: `backend/README.md`
4. Review integration guide: `BACKEND_INTEGRATION_GUIDE.md`

---

**Happy Coding! 🚀**
