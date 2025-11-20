#!/bin/bash

echo "🚀 Setting up ATS Resume Builder..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 20+ first."
    exit 1
fi

echo "✅ Node.js $(node --version) detected"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

echo "✅ Docker $(docker --version | cut -d ' ' -f3) detected"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Copy environment files if they don't exist
if [ ! -f packages/backend/.env ]; then
    echo "📝 Creating backend .env file..."
    cp packages/backend/.env.example packages/backend/.env
    echo "⚠️  Please edit packages/backend/.env and add your OPENAI_API_KEY"
fi

if [ ! -f packages/frontend/.env ]; then
    echo "📝 Creating frontend .env file..."
    cp packages/frontend/.env.example packages/frontend/.env
fi

# Start Docker services
echo "🐳 Starting Docker services..."
npm run docker:up

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 5

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit packages/backend/.env and add your OPENAI_API_KEY"
echo "2. Run 'npm run dev' to start development servers"
echo "3. Visit http://localhost:5173 for the frontend"
echo "4. Visit http://localhost:3000/health for the backend"
echo ""
