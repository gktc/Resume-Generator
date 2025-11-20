# Resume Generation System

## Overview

The Resume Generation System is a comprehensive pipeline that creates ATS-optimized resumes tailored to specific job descriptions. It combines AI-powered content optimization, intelligent content selection, and professional LaTeX typesetting to produce high-quality PDF resumes.

## Architecture

```
┌─────────────┐
│   Client    │
└──────┬──────┘
       │ POST /api/resume/generate
       ▼
┌─────────────────┐
│  API Server     │
│  (Express)      │
└────────┬────────┘
         │ Queue Job
         ▼
┌─────────────────┐      ┌──────────────┐
│   Bull Queue    │◄────►│    Redis     │
│   (Job Queue)   │      │   (Storage)  │
└────────┬────────┘      └──────────────┘
         │ Process Job
         ▼
┌─────────────────────────────────────────┐
│     Resume Generation Worker            │
│  ┌────────────────────────────────────┐ │
│  │ 1. Fetch Profile & Job Analysis   │ │
│  └────────────┬───────────────────────┘ │
│               ▼                          │
│  ┌────────────────────────────────────┐ │
│  │ 2. Select Relevant Content        │ │
│  │    - Score experiences             │ │
│  │    - Score skills                  │ │
│  │    - Score projects                │ │
│  └────────────┬───────────────────────┘ │
│               ▼                          │
│  ┌────────────────────────────────────┐ │
│  │ 3. Optimize with AI (Ollama)      │ │
│  │    - Generate summary              │ │
│  │    - Optimize bullet points        │ │
│  └────────────┬───────────────────────┘ │
│               ▼                          │
│  ┌────────────────────────────────────┐ │
│  │ 4. Calculate ATS Score            │ │
│  │    - Keyword matching              │ │
│  │    - Experience relevance          │ │
│  │    - Format parseability           │ │
│  │    - Education match               │ │
│  └────────────┬───────────────────────┘ │
│               ▼                          │
│  ┌────────────────────────────────────┐ │
│  │ 5. Compile LaTeX to PDF           │ │
│  │    - Render template               │ │
│  │    - Sanitize content              │ │
│  │    - Run pdflatex                  │ │
│  └────────────┬───────────────────────┘ │
│               ▼                          │
│  ┌────────────────────────────────────┐ │
│  │ 6. Store Resume & Update Status   │ │
│  └────────────────────────────────────┘ │
└─────────────────────────────────────────┘
         │
         ▼
┌─────────────────┐
│   PostgreSQL    │
│   (Database)    │
└─────────────────┘
```

## Key Features

### 1. Async Job Processing
- Non-blocking resume generation
- Automatic retry on failure (3 attempts)
- Progress tracking
- Timeout protection

### 2. Intelligent Content Selection
- Keyword-based relevance scoring
- Prioritizes recent and relevant experience
- Selects top skills matching job requirements
- Includes most impactful projects

### 3. AI-Powered Optimization
- Generates tailored professional summaries
- Optimizes bullet points for ATS
- Incorporates job keywords naturally
- Maintains content authenticity

### 4. ATS Score Calculation
- Multi-factor scoring (0-100)
- Weighted breakdown by category
- Missing keyword identification
- Actionable improvement suggestions

### 5. Professional PDF Generation
- LaTeX-based typesetting
- Multiple template options
- Security-hardened compilation
- High-quality output

## API Endpoints

### Generate Resume
```http
POST /api/resume/generate
Authorization: Bearer {token}
Content-Type: application/json

{
  "jobDescriptionId": "uuid",
  "templateId": "uuid"
}
```

**Response (202 Accepted):**
```json
{
  "success": true,
  "data": {
    "jobId": "uuid",
    "resumeId": "uuid",
    "status": "pending"
  }
}
```

### Check Status
```http
GET /api/resume/status/:jobId
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "jobId": "uuid",
    "resumeId": "uuid",
    "status": "completed",
    "progress": 100,
    "result": {
      "fileName": "Company_Position_timestamp.pdf",
      "atsScore": {
        "overall": 85,
        "breakdown": {
          "keywordMatch": 90,
          "experienceRelevance": 85,
          "formatParseability": 95,
          "educationMatch": 80
        },
        "missingKeywords": ["Docker", "Kubernetes"],
        "suggestions": [...]
      }
    }
  }
}
```

### Get Resume
```http
GET /api/resume/:id
Authorization: Bearer {token}
```

### List Resumes
```http
GET /api/resume?page=1&limit=10&sortBy=createdAt&order=desc
Authorization: Bearer {token}
```

### Download PDF
```http
GET /api/resume/:id/download
Authorization: Bearer {token}
```

### Regenerate Resume
```http
POST /api/resume/:id/regenerate
Authorization: Bearer {token}
```

### Delete Resume
```http
DELETE /api/resume/:id
Authorization: Bearer {token}
```

## Content Selection Algorithm

### Work Experience Scoring
- **Keyword matches** (+2 points per match)
- **Recency bonus**:
  - < 1 year ago: +5 points
  - < 3 years ago: +3 points
- **Duration bonus**:
  - > 2 years: +3 points
  - > 1 year: +2 points

### Skill Scoring
- **Direct keyword match**: +10 points
- **Partial match**: +5 points
- **Proficiency bonus**:
  - Expert: +4 points
  - Advanced: +3 points
  - Intermediate: +2 points
  - Beginner: +1 point
- **Experience bonus**: +1 point per year (max 5)

### Project Scoring
- **Keyword matches** (+2 points per match)
- **Recency bonus**:
  - < 1 year ago: +3 points
  - < 2 years ago: +2 points
- **URL/GitHub bonus**: +2 points

## ATS Score Breakdown

### Keyword Match (40% weight)
- Compares resume keywords with job requirements
- Identifies missing keywords
- Calculates match percentage

### Experience Relevance (30% weight)
- Evaluates total years of experience
- Matches experience level to job requirements
- Considers recency of experience
- Bonus for multiple relevant positions

### Format Parseability (20% weight)
- Checks for required sections
- Validates structure and completeness
- Ensures proper formatting
- Bonus for additional sections

### Education Match (10% weight)
- Verifies degree requirements
- Checks for relevant education
- Bonus for GPA and achievements

## AI Optimization

### Professional Summary
Generated based on:
- Top 3 work experiences
- Top 10 skills
- Job requirements and keywords
- Target position and company

**Prompt Strategy:**
- Concise (2-3 sentences)
- Incorporates job keywords
- Highlights relevant experience
- Maintains authenticity

### Bullet Point Optimization
Optimized for:
- Strong action verbs
- Quantifiable metrics
- Keyword incorporation
- ATS compatibility
- Conciseness (1-2 lines)

**Fallback:**
- Returns original content on AI errors
- Ensures no data loss

## LaTeX Compilation

### Template Variables
- `{{name}}`, `{{email}}`, `{{phone}}`, `{{location}}`
- `{{linkedin}}`, `{{github}}`, `{{website}}`
- `{{summary}}`
- `{{experience}}` - Iterates work experiences
- `{{education}}` - Iterates education entries
- `{{skills}}` - Groups skills by category
- `{{projects}}` - Iterates projects

### Security Measures
- Escapes special LaTeX characters
- Removes dangerous commands
- Runs in isolated environment
- Timeout protection (30 seconds)
- Input sanitization

### Error Handling
- Compilation errors logged
- User-friendly error messages
- Automatic cleanup of temp files
- Retry logic for transient failures

## Configuration

### Environment Variables
```env
# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# AI (Ollama)
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=gemma2:2b

# LaTeX
LATEX_TIMEOUT=30000
```

### Queue Settings
```typescript
{
  attempts: 3,
  backoff: {
    type: 'exponential',
    delay: 2000
  },
  timeout: 120000,
  removeOnComplete: 100,
  removeOnFail: 200
}
```

## Performance

### Typical Processing Time
- Content selection: ~1 second
- AI optimization: ~10-20 seconds
- ATS calculation: ~1 second
- LaTeX compilation: ~5-10 seconds
- **Total: ~20-35 seconds**

### Optimization Tips
1. Run multiple workers for parallel processing
2. Cache AI responses for similar profiles
3. Pre-compile common template sections
4. Use Redis clustering for high load
5. Monitor queue metrics

## Error Handling

### Common Errors
- `VALIDATION_FAILED` - Invalid input
- `RESOURCE_NOT_FOUND` - Job/resume not found
- `INVALID_STATE` - Resume not ready
- `FILE_NOT_FOUND` - PDF missing
- `INTERNAL_ERROR` - Processing failure

### Recovery Strategies
- Automatic retry (3 attempts)
- Exponential backoff
- Fallback to original content
- Graceful degradation
- Detailed error logging

## Monitoring

### Key Metrics
- Queue length
- Processing time
- Success rate
- AI response time
- LaTeX compilation time
- Error rate

### Logging
- Job start/complete events
- AI generation attempts
- LaTeX compilation logs
- Error stack traces
- Performance metrics

## Testing

### Unit Tests
- Content selection algorithm
- ATS score calculation
- LaTeX rendering
- Template variable substitution

### Integration Tests
- End-to-end resume generation
- Queue processing
- API endpoints
- Error scenarios

### Test Script
```bash
node test-resume-endpoints.js
```

## Deployment

### Development
```bash
# Start Redis
redis-server

# Start Ollama
ollama serve

# Start API server
npm run dev

# Worker runs automatically in dev mode
```

### Production
```bash
# Start API server
pm2 start dist/index.js --name api

# Start workers (multiple instances)
pm2 start dist/workers/resume-generation.worker.js -i 3 --name worker

# Monitor
pm2 monit
```

## Dependencies

### Runtime
- `bull` - Job queue
- `redis` - Queue backend
- `axios` - HTTP client
- `@prisma/client` - Database ORM

### System
- Redis server
- pdflatex (LaTeX distribution)
- Ollama (AI service)
- PostgreSQL

## Files

### Core Services
- `src/services/resume-generation.service.ts` - Main generation logic
- `src/services/latex-compiler.service.ts` - PDF compilation
- `src/services/ai.service.ts` - AI integration

### Infrastructure
- `src/lib/queue.ts` - Bull queue setup
- `src/workers/resume-generation.worker.ts` - Job processor

### API
- `src/controllers/resume.controller.ts` - Request handlers
- `src/routes/resume.routes.ts` - Route definitions

### Types
- `src/types/resume.types.ts` - TypeScript interfaces

## Documentation

- `TASK_8_IMPLEMENTATION_SUMMARY.md` - Detailed implementation notes
- `RESUME_GENERATION_QUICK_START.md` - Quick start guide
- `test-resume-endpoints.js` - API testing script

## Future Enhancements

1. **Caching**: Cache AI responses and compiled templates
2. **Versioning**: Track resume versions
3. **A/B Testing**: Compare different resume versions
4. **Custom Templates**: User-created templates
5. **Real-time Preview**: Live resume preview
6. **Batch Processing**: Generate multiple resumes at once
7. **Analytics**: Track resume performance
8. **Export Formats**: Support DOCX, HTML exports

## Support

For issues:
1. Check logs: `tail -f logs/app.log`
2. Monitor queue: Install Bull Board
3. Check Redis: `redis-cli monitor`
4. Test Ollama: `curl http://localhost:11434/api/tags`
5. Verify LaTeX: `pdflatex --version`
