# Setup Guide

This guide will help you set up the ATS Resume Builder development environment.

## Prerequisites Installation

### 1. Node.js and npm

**Windows:**
- Download from [nodejs.org](https://nodejs.org/)
- Install the LTS version (20.x or higher)
- Verify installation:
  ```bash
  node --version
  npm --version
  ```

**macOS:**
```bash
# Using Homebrew
brew install node@20
```

**Linux:**
```bash
# Using nvm (recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 20
nvm use 20
```

### 2. Docker and Docker Compose

**Windows:**
- Download [Docker Desktop for Windows](https://www.docker.com/products/docker-desktop)
- Install and start Docker Desktop
- Verify installation:
  ```bash
  docker --version
  docker-compose --version
  ```

**macOS:**
```bash
# Using Homebrew
brew install --cask docker
# Or download Docker Desktop from docker.com
```

**Linux:**
```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install docker.io docker-compose
sudo systemctl start docker
sudo systemctl enable docker
```

### 3. Ollama (AI Model)

1. Download Ollama from [ollama.com/download](https://ollama.com/download)
2. Install and start Ollama
3. Pull the Gemma 2B model:
   ```bash
   ollama pull gemma2:2b
   ```
4. Verify it's running:
   ```bash
   ollama list
   ```

See [OLLAMA_SETUP.md](./OLLAMA_SETUP.md) for detailed instructions.

## Project Setup

### Step 1: Install Dependencies

```bash
# From the project root
npm install
```

This will install dependencies for the root project and both workspaces (backend and frontend).

### Step 2: Configure Environment Variables

#### Backend Configuration

```bash
# Copy the example file
cp packages/backend/.env.example packages/backend/.env
```

Edit `packages/backend/.env` and update:

```env
# Required: Add your OpenAI API key
OPENAI_API_KEY=sk-your-actual-api-key-here

# Optional: Customize other settings
PORT=3000
JWT_SECRET=your-secure-random-string-here
JWT_REFRESH_SECRET=another-secure-random-string-here
```

**Generate secure JWT secrets:**
```bash
# On Linux/macOS
openssl rand -base64 32

# On Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

#### Frontend Configuration

```bash
# Copy the example file
cp packages/frontend/.env.example packages/frontend/.env
```

The default configuration should work, but you can customize if needed.

### Step 3: Start Docker Services

```bash
# Start PostgreSQL, Redis, and LaTeX containers
npm run docker:up

# Verify services are running
docker ps
```

You should see three containers running:
- `ats-postgres` (PostgreSQL)
- `ats-redis` (Redis)
- `ats-latex` (LaTeX compiler)

**Check service health:**
```bash
# View logs
npm run docker:logs

# Or check individual services
docker logs ats-postgres
docker logs ats-redis
docker logs ats-latex
```

### Step 4: Start Development Servers

```bash
# Start both backend and frontend
npm run dev
```

Or start them individually in separate terminals:

```bash
# Terminal 1: Backend
npm run dev:backend

# Terminal 2: Frontend
npm run dev:frontend
```

### Step 5: Verify Setup

1. **Backend API**: Open http://localhost:3000/health
   - Should return: `{"success":true,"message":"ATS Resume Builder API is running"}`

2. **Frontend**: Open http://localhost:5173
   - Should display the ATS Resume Builder landing page

3. **Database**: Connect to PostgreSQL
   ```bash
   # Using psql
   psql postgresql://postgres:postgres@localhost:5432/ats_resume_builder
   ```

4. **Redis**: Test connection
   ```bash
   # Using redis-cli
   docker exec -it ats-redis redis-cli ping
   # Should return: PONG
   ```

## Troubleshooting

### Port Already in Use

If you get "port already in use" errors:

**Backend (port 3000):**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/macOS
lsof -ti:3000 | xargs kill -9
```

**Frontend (port 5173):**
```bash
# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Linux/macOS
lsof -ti:5173 | xargs kill -9
```

### Docker Services Not Starting

```bash
# Stop all containers
npm run docker:down

# Remove volumes and restart
docker-compose down -v
npm run docker:up
```

### Database Connection Issues

1. Ensure PostgreSQL container is running:
   ```bash
   docker ps | grep ats-postgres
   ```

2. Check PostgreSQL logs:
   ```bash
   docker logs ats-postgres
   ```

3. Verify DATABASE_URL in `.env` matches Docker configuration

### Module Not Found Errors

```bash
# Clean install
rm -rf node_modules package-lock.json
rm -rf packages/*/node_modules packages/*/package-lock.json
npm install
```

### TypeScript Errors

```bash
# Rebuild TypeScript
npm run build
```

## Development Tips

### Code Formatting

```bash
# Format all code
npm run format

# Check formatting
npx prettier --check "packages/**/*.{ts,tsx,js,jsx,json,css,md}"
```

### Linting

```bash
# Lint all workspaces
npm run lint

# Lint specific workspace
npm run lint --workspace=packages/backend
npm run lint --workspace=packages/frontend
```

### Docker Management

```bash
# View running containers
docker ps

# View all containers (including stopped)
docker ps -a

# Stop services
npm run docker:down

# Restart services
npm run docker:down && npm run docker:up

# View logs
npm run docker:logs

# Clear all data (WARNING: deletes database)
docker-compose down -v
```

### Database Management

```bash
# Access PostgreSQL shell
docker exec -it ats-postgres psql -U postgres -d ats_resume_builder

# Backup database
docker exec ats-postgres pg_dump -U postgres ats_resume_builder > backup.sql

# Restore database
docker exec -i ats-postgres psql -U postgres ats_resume_builder < backup.sql
```

## Next Steps

Once your environment is set up:

1. Review the [README.md](./README.md) for project overview
2. Check the [design document](./.kiro/specs/ats-resume-builder/design.md) for architecture details
3. Start implementing features from the [tasks list](./.kiro/specs/ats-resume-builder/tasks.md)

## Getting Help

If you encounter issues:

1. Check the troubleshooting section above
2. Review Docker logs: `npm run docker:logs`
3. Check backend logs in the terminal
4. Verify all environment variables are set correctly
5. Ensure all prerequisites are installed and up to date
