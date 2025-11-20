# Database Initialization Script for Windows
# This script initializes the database with schema and seed data

$ErrorActionPreference = "Stop"

Write-Host "🗄️  Initializing ATS Resume Builder Database..." -ForegroundColor Green

# Check if DATABASE_URL is set
if (-not $env:DATABASE_URL) {
    Write-Host "❌ ERROR: DATABASE_URL environment variable is not set" -ForegroundColor Red
    Write-Host "Please set DATABASE_URL in your .env file"
    exit 1
}

# Check if database is accessible
Write-Host "📡 Checking database connection..." -ForegroundColor Yellow
try {
    $null = npx prisma db execute --stdin <<< "SELECT 1" 2>&1
    Write-Host "✅ Database connection successful" -ForegroundColor Green
} catch {
    Write-Host "❌ ERROR: Cannot connect to database" -ForegroundColor Red
    Write-Host "Make sure PostgreSQL is running (try: npm run docker:up)"
    exit 1
}

# Generate Prisma Client
Write-Host "🔧 Generating Prisma Client..." -ForegroundColor Yellow
npm run prisma:generate

# Run migrations
Write-Host "🚀 Running database migrations..." -ForegroundColor Yellow
npm run prisma:migrate:deploy

# Seed database
Write-Host "🌱 Seeding database with initial data..." -ForegroundColor Yellow
npm run prisma:seed

Write-Host ""
Write-Host "✅ Database initialization complete!" -ForegroundColor Green
Write-Host ""
Write-Host "You can now:" -ForegroundColor Cyan
Write-Host "  - Start the backend: npm run dev:backend"
Write-Host "  - Open Prisma Studio: npm run prisma:studio"
Write-Host ""
