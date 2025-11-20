#!/bin/bash

# Database Initialization Script
# This script initializes the database with schema and seed data

set -e

echo "🗄️  Initializing ATS Resume Builder Database..."

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ ERROR: DATABASE_URL environment variable is not set"
    echo "Please set DATABASE_URL in your .env file"
    exit 1
fi

# Check if database is accessible
echo "📡 Checking database connection..."
if ! npx prisma db execute --stdin <<< "SELECT 1" > /dev/null 2>&1; then
    echo "❌ ERROR: Cannot connect to database"
    echo "Make sure PostgreSQL is running (try: npm run docker:up)"
    exit 1
fi

echo "✅ Database connection successful"

# Generate Prisma Client
echo "🔧 Generating Prisma Client..."
npm run prisma:generate

# Run migrations
echo "🚀 Running database migrations..."
npm run prisma:migrate:deploy

# Seed database
echo "🌱 Seeding database with initial data..."
npm run prisma:seed

echo ""
echo "✅ Database initialization complete!"
echo ""
echo "You can now:"
echo "  - Start the backend: npm run dev:backend"
echo "  - Open Prisma Studio: npm run prisma:studio"
echo ""
