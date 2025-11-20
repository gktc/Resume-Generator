# Quick Start Guide - ATS Resume Builder

## Prerequisites

- Node.js (v18+)
- Docker Desktop
- Ollama (for AI features)

## Step 1: Start Docker Services

1. **Start Docker Desktop** (if not running)
   - Open Docker Desktop application
   - Wait for it to fully start

2. **Start the services:**
   ```bash
   docker-compose up -d
   ```

3. **Verify services are running:**
   ```bash
   docker ps
   ```
   You should see: `ats-postgres`, `ats-redis`, `ats-latex`

## Step 2: Set Up Database

```bash
cd packages/backend
npm install
npx prisma generate
npx prisma migrate deploy
npm run prisma:seed:templates
```

## Step 3: Start Ollama (Optional - for AI features)

1. Install Ollama from [https://ollama.ai](https://ollama.ai)
2. Pull the model:
   ```bash
   ollama pull gemma2:2b
   ```
3. Ollama runs automatically on [http://localhost:11434](http://localhost:11434)

## Step 4: Start Backend Server

```bash
cd packages/backend
npm run dev
```

Server will start on [http://localhost:3000](http://localhost:3000)

## Testing the API

Check if server is running:
```bash
curl http://localhost:3000/health
```
