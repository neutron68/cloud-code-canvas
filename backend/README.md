# OmniCode Execution Engine

A robust, secure, and efficient backend execution engine for the OmniCode web-based IDE. Supports real compilation and execution of Java, C, and C++ code.

## 🎯 Features

- **Real Compilation**: Uses actual system compilers (javac, gcc, g++)
- **Secure Execution**: Isolated temporary directories, timeout protection, output limits
- **Multiple Languages**: Java, C, C++
- **Input Support**: Handle stdin input for all languages
- **Error Handling**: Separate compilation and runtime errors
- **Timeout Protection**: Prevents infinite loops (5-second default)
- **Concurrent Execution**: Handles multiple requests (5 concurrent max)
- **Automatic Cleanup**: Temporary files cleaned up after execution
- **Comprehensive Logging**: Winston-based logging system
- **Health Monitoring**: Status and health check endpoints

## 📋 Prerequisites

### Required Compilers

#### Java
```bash
# Check if installed
javac -version
java -version

# Install on Ubuntu/Debian
sudo apt-get install default-jdk

# Install on macOS
brew install openjdk

# Install on Windows
# Download from https://www.oracle.com/java/technologies/downloads/
```

#### C/C++
```bash
# Check if installed
gcc --version
g++ --version

# Install on Ubuntu/Debian
sudo apt-get install build-essential

# Install on macOS
xcode-select --install

# Install on Windows
# Download MinGW from https://www.mingw-w64.org/
```

### Node.js
- Node.js 16+ required
- npm or yarn

## 🚀 Installation

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configuration (Optional)

Create a `.env` file in the `backend` directory:

```env
# Server Configuration
PORT=3001
HOST=localhost

# Execution Configuration
MAX_EXECUTION_TIME=5000
MAX_OUTPUT_SIZE=1048576
TEMP_DIR=./temp

# Security
MAX_CONCURRENT=5

# Logging
LOG_LEVEL=info
LOG_FILE=./logs/execution.log
```

### 3. Start the Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

The server will start at `http://localhost:3001`

## 📡 API Endpoints

### POST /api/run
Execute code

**Request:**
```json
{
  "language": "java",
  "code": "public class Main { public static void main(String[] args) { System.out.println(\"Hello\"); } }",
  "input": ""
}
```

**Response:**
```json
{
  "success": true,
  "stdout": "Hello\n",
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

**Status Codes:**
- `3` - Accepted (Success)
- `5` - Time Limit Exceeded
- `6` - Compilation Error
- `11` - Runtime Error
- `13` - Internal Error

### GET /api/status
Get system status and compiler availability

**Response:**
```json
{
  "success": true,
  "activeExecutions": 0,
  "maxConcurrentExecutions": 5,
  "compilers": {
    "java": {
      "available": true,
      "version": "openjdk 17.0.1"
    },
    "c": {
      "available": true,
      "version": "gcc (Ubuntu 11.3.0-1ubuntu1~22.04) 11.3.0"
    },
    "cpp": {
      "available": true,
      "version": "g++ (Ubuntu 11.3.0-1ubuntu1~22.04) 11.3.0"
    }
  }
}
```

### GET /api/health
Health check endpoint

**Response:**
```json
{
  "success": true,
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "activeExecutions": 0
}
```

## 🧪 Testing

Run the test suite:

```bash
npm test
```

This will test:
- ✅ Hello World programs
- ✅ Input/Output handling
- ✅ Loops and control flow
- ✅ Compilation error detection
- ✅ Runtime error handling
- ✅ Timeout protection

## 🏗️ Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── config.js           # Configuration management
│   ├── services/
│   │   ├── executionService.js # Main execution service
│   │   └── executor/
│   │       ├── javaExecutor.js # Java execution logic
│   │       ├── cExecutor.js    # C execution logic
│   │       └── cppExecutor.js  # C++ execution logic
│   ├── utils/
│   │   ├── fileManager.js      # File operations
│   │   ├── processRunner.js    # Process management
│   │   └── logger.js           # Logging utility
│   ├── routes/
│   │   └── runRoute.js         # API routes
│   ├── test/
│   │   └── testRunner.js       # Test suite
│   └── server.js               # Main server file
├── temp/                       # Temporary execution directories
├── logs/                       # Log files
├── package.json
└── README.md
```

## 🔧 Integration with Frontend

### Update Frontend Configuration

In your frontend code, update the execution endpoint:

```typescript
// src/lib/codeExecution.ts

private async executeInCloud(options: ExecutionOptions): Promise<ExecutionResult | null> {
  try {
    // Use local backend instead of Supabase
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
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return {
      output: data.stdout || '',
      error: data.stderr || '',
      executionTime: (data.time || 0) * 1000, // Convert to ms
      memoryUsage: data.memory || 0,
      status: data.success ? 'success' : 'error',
    };
  } catch (error) {
    console.error('Backend execution failed:', error);
    return null;
  }
}
```

### CORS Configuration

The backend is configured to allow all origins in development. For production, update the CORS settings in `src/server.js`:

```javascript
app.use(cors({
  origin: 'https://your-frontend-domain.com',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
```

## 🔒 Security Features

1. **Isolated Execution**: Each execution runs in a unique temporary directory
2. **Timeout Protection**: 5-second maximum execution time
3. **Output Limits**: 1MB maximum output size
4. **Concurrent Limits**: Maximum 5 concurrent executions
5. **Automatic Cleanup**: Temporary files deleted after execution
6. **Input Sanitization**: Code and input validated before execution
7. **Process Isolation**: Child processes killed on timeout

## 📊 Performance

- **Compilation Time**: ~1-2 seconds (Java), ~0.5-1 second (C/C++)
- **Execution Time**: Depends on code, max 5 seconds
- **Memory Usage**: Minimal overhead, actual usage depends on code
- **Concurrent Requests**: Up to 5 simultaneous executions

## 🐛 Troubleshooting

### Compiler Not Found

**Error**: `Command not found: javac/gcc/g++`

**Solution**: Install the required compiler (see Prerequisites)

### Permission Denied

**Error**: `EACCES: permission denied`

**Solution**: Ensure the `temp` directory has write permissions:
```bash
chmod 755 backend/temp
```

### Port Already in Use

**Error**: `EADDRINUSE: address already in use`

**Solution**: Change the port in `.env` or kill the process using port 3001:
```bash
# Find process
lsof -i :3001

# Kill process
kill -9 <PID>
```

### Timeout Issues

**Error**: `Time Limit Exceeded`

**Solution**: Increase timeout in `.env`:
```env
MAX_EXECUTION_TIME=10000
```

## 📝 Logging

Logs are stored in `backend/logs/`:
- `execution.log` - All logs
- `error.log` - Error logs only

Log levels: `error`, `warn`, `info`, `debug`

Change log level in `.env`:
```env
LOG_LEVEL=debug
```

## 🚀 Deployment

### Production Checklist

1. ✅ Set `NODE_ENV=production`
2. ✅ Configure CORS for your domain
3. ✅ Set appropriate timeout limits
4. ✅ Configure log rotation
5. ✅ Set up process manager (PM2)
6. ✅ Configure firewall rules
7. ✅ Set up monitoring

### Using PM2

```bash
# Install PM2
npm install -g pm2

# Start server
pm2 start src/server.js --name omnicode-backend

# Monitor
pm2 monit

# Logs
pm2 logs omnicode-backend

# Restart
pm2 restart omnicode-backend
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `npm test`
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For issues and questions:
- GitHub Issues: [Create an issue]
- Documentation: [Read the docs]
- Email: support@omnicode.dev

## 🎉 Acknowledgments

- Express.js for the web framework
- Winston for logging
- Node.js child_process for execution
- All contributors and testers

---

**Built with ❤️ for the OmniCode IDE**
