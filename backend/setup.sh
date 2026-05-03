#!/bin/bash

# OmniCode Backend Setup Script
# This script sets up the backend execution engine

echo "🚀 OmniCode Backend Setup"
echo "=========================="
echo ""

# Check Node.js
echo "📦 Checking Node.js..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    echo "   Please install Node.js 16+ from https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v)
echo "✅ Node.js $NODE_VERSION found"
echo ""

# Check compilers
echo "🔧 Checking compilers..."

# Java
if command -v javac &> /dev/null && command -v java &> /dev/null; then
    JAVA_VERSION=$(java -version 2>&1 | head -n 1)
    echo "✅ Java: $JAVA_VERSION"
else
    echo "⚠️  Java not found"
    echo "   Install: sudo apt-get install default-jdk (Ubuntu/Debian)"
    echo "   Install: brew install openjdk (macOS)"
fi

# GCC
if command -v gcc &> /dev/null; then
    GCC_VERSION=$(gcc --version | head -n 1)
    echo "✅ GCC: $GCC_VERSION"
else
    echo "⚠️  GCC not found"
    echo "   Install: sudo apt-get install build-essential (Ubuntu/Debian)"
    echo "   Install: xcode-select --install (macOS)"
fi

# G++
if command -v g++ &> /dev/null; then
    GPP_VERSION=$(g++ --version | head -n 1)
    echo "✅ G++: $GPP_VERSION"
else
    echo "⚠️  G++ not found"
    echo "   Install: sudo apt-get install build-essential (Ubuntu/Debian)"
    echo "   Install: xcode-select --install (macOS)"
fi

echo ""

# Install dependencies
echo "📥 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed"
echo ""

# Create directories
echo "📁 Creating directories..."
mkdir -p temp logs

echo "✅ Directories created"
echo ""

# Copy environment file
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "✅ .env file created"
else
    echo "ℹ️  .env file already exists"
fi

echo ""

# Run tests
echo "🧪 Running tests..."
npm test

echo ""
echo "=========================="
echo "✅ Setup complete!"
echo ""
echo "To start the server:"
echo "  npm run dev    (development mode)"
echo "  npm start      (production mode)"
echo ""
echo "Server will run at: http://localhost:3001"
echo ""
echo "API Endpoints:"
echo "  POST /api/run     - Execute code"
echo "  GET  /api/status  - System status"
echo "  GET  /api/health  - Health check"
echo ""
echo "📖 Read BACKEND_INTEGRATION_GUIDE.md for frontend integration"
echo "=========================="
