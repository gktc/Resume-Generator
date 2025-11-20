# PowerShell setup script for Windows

Write-Host "🚀 Setting up ATS Resume Builder..." -ForegroundColor Green

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js $nodeVersion detected" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed. Please install Node.js 20+ first." -ForegroundColor Red
    exit 1
}

# Check if Docker is installed
try {
    $dockerVersion = docker --version
    Write-Host "✅ Docker detected" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker is not installed. Please install Docker Desktop first." -ForegroundColor Red
    exit 1
}

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
npm install

# Copy environment files if they don't exist
if (-not (Test-Path "packages/backend/.env")) {
    Write-Host "📝 Creating backend .env file..." -ForegroundColor Yellow
    Copy-Item "packages/backend/.env.example" "packages/backend/.env"
    Write-Host "⚠️  Please edit packages/backend/.env and add your OPENAI_API_KEY" -ForegroundColor Yellow
}

if (-not (Test-Path "packages/frontend/.env")) {
    Write-Host "📝 Creating frontend .env file..." -ForegroundColor Yellow
    Copy-Item "packages/frontend/.env.example" "packages/frontend/.env"
}

# Start Docker services
Write-Host "🐳 Starting Docker services..." -ForegroundColor Yellow
npm run docker:up

# Wait for services to be ready
Write-Host "⏳ Waiting for services to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

Write-Host ""
Write-Host "✅ Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Edit packages/backend/.env and add your OPENAI_API_KEY"
Write-Host "2. Run 'npm run dev' to start development servers"
Write-Host "3. Visit http://localhost:5173 for the frontend"
Write-Host "4. Visit http://localhost:3000/health for the backend"
Write-Host ""
