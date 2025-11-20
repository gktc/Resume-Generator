# Resume Generation - Quick Start Guide

## Prerequisites

Before using the resume generation system, ensure you have:

1. ✅ **Redis running** (required for job queue)
2. ✅ **Ollama running** with gemma2:2b model (required for AI features)
3. ✅ **pdflatex installed** (required for PDF generation)
4. ✅ **User account created** and authenticated
5. ✅ **Profile data added** (work experience, education, skills, projects)
6. ✅ **Job description analyzed** (using `/api/jobs/analyze`)
7. ✅ **Templates seeded** (run `npm run prisma:seed:templates`)

## Setup Steps

### 1. Install Redis

**Windows (using Chocolatey):**
```powershell
choco install redis-64
redis-server
```

**macOS:**
```bash
brew install redis
brew services start redis
```

**Linux:**
```bash
sudo apt-get install redis-server
sudo systemctl start redis
```

### 2. Install Ollama

Download from: https://ollama.ai

**Pull the model:**
```bash
ollama pull gemma2:2b
```

**Verify it's running:**
```bash
curl http://localhost:11434/api/tags
```

### 3. Install LaTeX

**Windows:**
- Download MiKTeX: https://miktex.org/download
- Or use TeX Live: https://www.tug.org/texlive/

**macOS:**
```bash
brew install --cask mactex
```

**Linux:**
```bash
sudo apt-get install texlive-full
```

**Verify installation:**
```bash
pdflatex --version
```

### 4. Configure Environment

Update your `.env` file:

```env
# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# AI Configuration (Ollama)
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=gemma2:2b

# LaTeX Configuration
LATEX_TIMEOUT=30000
```

### 5. Seed Templates

```bash
npm run prisma:seed:templates
```

This creates 3 default templates:
- Modern Professional
- Classic Traditional
- Technical Developer

## API Usage

### Step 1: Analyze Job Description

```bash
curl -X POST http://localhost:3000/api/jobs/analyze \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "company": "Tech Corp",
    "position": "Senior Software Engineer",
    "rawText": "We are looking for a Senior Software Engineer with 5+ years of experience in React, Node.js, and TypeScript..."
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "job-description-id",
    "analysis": {
      "requirements": [...],
      "skills": ["React", "Node.js", "TypeScript"],
      "experienceLevel": "senior",
      "keywords": [...]
    }
  }
}
```

### Step 2: List Available Templates

```bash
curl http://localhost:3000/api/templates \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "template-id-1",
      "name": "Modern Professional",
      "category": "modern",
      "previewImageUrl": "/templates/modern-preview.png"
    }
  ]
}
```

### Step 3: Generate Resume

```bash
curl -X POST http://localhost:3000/api/resume/generate \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "jobDescriptionId": "job-description-id",
    "templateId": "template-id-1"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "jobId": "resume-job-id",
    "resumeId": "resume-id",
    "status": "pending",
    "message": "Resume generation queued successfully"
  }
}
```

### Step 4: Check Generation Status

```bash
curl http://localhost:3000/api/resume/status/resume-job-id \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response (Processing):**
```json
{
  "success": true,
  "data": {
    "jobId": "resume-job-id",
    "resumeId": "resume-id",
    "status": "active",
    "progress": 50
  }
}
```

**Response (Completed):**
```json
{
  "success": true,
  "data": {
    "jobId": "resume-job-id",
    "resumeId": "resume-id",
    "status": "completed",
    "progress": 100,
    "result": {
      "resumeId": "resume-id",
      "fileName": "TechCorp_SeniorSoftwareEngineer_1234567890.pdf",
      "atsScore": {
        "overall": 85,
        "breakdown": {
          "keywordMatch": 90,
          "experienceRelevance": 85,
          "formatParseability": 95,
          "educationMatch": 80
        }
      }
    }
  }
}
```

### Step 5: Get Resume Details

```bash
curl http://localhost:3000/api/resume/resume-id \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "resume-id",
    "fileName": "TechCorp_SeniorSoftwareEngineer_1234567890.pdf",
    "status": "completed",
    "atsScore": {
      "overall": 85,
      "breakdown": {...},
      "missingKeywords": ["Docker", "Kubernetes"],
      "suggestions": [
        "Consider adding these skills if you have them: Docker, Kubernetes"
      ]
    },
    "jobDescription": {
      "company": "Tech Corp",
      "position": "Senior Software Engineer"
    },
    "template": {
      "name": "Modern Professional",
      "category": "modern"
    },
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

### Step 6: Download Resume PDF

```bash
curl http://localhost:3000/api/resume/resume-id/download \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -o resume.pdf
```

Or in browser:
```
http://localhost:3000/api/resume/resume-id/download
```

## Common Issues

### Issue: "Redis connection failed"

**Solution:**
```bash
# Check if Redis is running
redis-cli ping
# Should return: PONG

# If not running, start it
redis-server
```

### Issue: "Ollama API error"

**Solution:**
```bash
# Check if Ollama is running
curl http://localhost:11434/api/tags

# If not running, start it
ollama serve

# Verify model is available
ollama list
# Should show gemma2:2b
```

### Issue: "LaTeX compilation failed"

**Solution:**
```bash
# Check if pdflatex is installed
pdflatex --version

# If not installed, install LaTeX distribution
# Windows: Install MiKTeX
# macOS: brew install --cask mactex
# Linux: sudo apt-get install texlive-full
```

### Issue: "Template not found"

**Solution:**
```bash
# Seed templates
npm run prisma:seed:templates

# Verify templates exist
curl http://localhost:3000/api/templates \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Issue: "Job description not found"

**Solution:**
Make sure you've analyzed a job description first:
```bash
curl -X POST http://localhost:3000/api/jobs/analyze \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"company": "...", "position": "...", "rawText": "..."}'
```

## Testing

Use the provided test script:

```bash
# 1. Update the script with your credentials
# Edit test-resume-endpoints.js and set:
# - AUTH_TOKEN
# - JOB_DESCRIPTION_ID
# - TEMPLATE_ID

# 2. Run the tests
node test-resume-endpoints.js
```

## Production Deployment

### 1. Run Worker Process Separately

In production, run the worker as a separate process:

```bash
# Start the API server
npm start

# Start the worker (in another terminal/process)
node dist/workers/resume-generation.worker.js
```

### 2. Use Process Manager

Use PM2 or similar to manage processes:

```bash
# Install PM2
npm install -g pm2

# Start API server
pm2 start dist/index.js --name api

# Start worker
pm2 start dist/workers/resume-generation.worker.js --name worker

# Monitor
pm2 monit
```

### 3. Scale Workers

Run multiple workers for better throughput:

```bash
pm2 start dist/workers/resume-generation.worker.js -i 3 --name worker
```

### 4. Configure Redis for Production

Use a managed Redis service or configure Redis properly:

```env
REDIS_HOST=your-redis-host.com
REDIS_PORT=6379
REDIS_PASSWORD=your-secure-password
```

## Performance Tips

1. **Cache AI Responses**: Consider caching AI-generated summaries for similar profiles
2. **Pre-compile Templates**: Keep compiled LaTeX templates in memory
3. **Batch Processing**: Process multiple resumes in parallel with multiple workers
4. **Monitor Queue**: Use Bull Board for queue monitoring
5. **Optimize AI Calls**: Reduce temperature for more consistent results

## Next Steps

After generating resumes, you can:

1. **View Resume History**: `GET /api/resume`
2. **Regenerate with Updated Profile**: `POST /api/resume/:id/regenerate`
3. **Generate Interview Questions**: Use the resume for interview prep (Task 10)
4. **Track Applications**: Link resumes to job applications

## Support

For issues or questions:
- Check the logs: `tail -f logs/app.log`
- Monitor queue: Install Bull Board
- Check Redis: `redis-cli monitor`
- Test Ollama: `curl http://localhost:11434/api/tags`
