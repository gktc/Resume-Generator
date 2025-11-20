# Job Description Analysis System

## Overview

The Job Description Analysis System is a core feature of the ATS Resume Builder that uses AI to analyze job postings and match them against user profiles. It extracts structured data from job descriptions, calculates match scores, and provides actionable recommendations.

## Features

### 1. AI-Powered Job Analysis
- Extracts requirements (required vs preferred)
- Identifies technical and soft skills
- Determines experience level (entry, mid, senior, lead)
- Extracts ATS keywords
- Captures company information

### 2. Profile Matching
- **Skill Match**: Calculates percentage of required skills the user possesses
- **Experience Relevance**: Scores how well user's experience aligns with job requirements
- **Education Match**: Evaluates if user meets educational requirements
- **Overall Score**: Weighted combination of all factors (40% skills, 40% experience, 20% education)

### 3. Recommendations
- Identifies missing skills
- Suggests profile improvements
- Highlights strengths

## API Endpoints

### POST /api/jobs/analyze
Analyze a job description and store it.

**Request:**
```json
{
  "company": "Tech Corp",
  "position": "Senior Full Stack Developer",
  "jobDescription": "Full job description text..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "jobId": "uuid",
    "analysis": {
      "requirements": [
        {
          "text": "5+ years of experience",
          "category": "required",
          "type": "experience",
          "importance": 0.9
        }
      ],
      "skills": ["JavaScript", "React", "Node.js"],
      "experienceLevel": "senior",
      "keywords": ["JavaScript", "React", "API"],
      "companyInfo": "Tech company description"
    }
  }
}
```

### GET /api/jobs/:id
Get a job description with profile match results.

**Response:**
```json
{
  "success": true,
  "data": {
    "job": {
      "id": "uuid",
      "company": "Tech Corp",
      "position": "Senior Full Stack Developer",
      "rawText": "...",
      "analyzedData": { ... },
      "createdAt": "2024-01-01T00:00:00Z"
    },
    "matchResult": {
      "skillMatch": {
        "percentage": 85,
        "matchingSkills": ["JavaScript", "React"],
        "missingSkills": ["Kubernetes"]
      },
      "experienceRelevance": {
        "score": 78,
        "relevantExperiences": ["Software Engineer at ABC Corp"]
      },
      "educationMatch": {
        "score": 100,
        "meetsRequirements": true
      },
      "overallScore": 82,
      "recommendations": [
        "Your profile is a strong match!",
        "Consider adding Kubernetes to your skills"
      ]
    }
  }
}
```

### GET /api/jobs
List all job descriptions for the authenticated user.

**Query Parameters:**
- `page` (default: 1): Page number
- `limit` (default: 10): Items per page
- `sortBy` (default: createdAt): Sort field (createdAt, company, position)
- `sortOrder` (default: desc): Sort order (asc, desc)

**Response:**
```json
{
  "success": true,
  "data": {
    "jobs": [ ... ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "totalPages": 3
    }
  }
}
```

### DELETE /api/jobs/:id
Delete a job description.

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Job description deleted successfully"
  }
}
```

## Architecture

### Service Layer: JobAnalysisService

**Key Methods:**

1. `analyzeJobDescription(userId, company, position, rawText)`
   - Analyzes job description using AI
   - Stores in database
   - Returns job ID and analysis

2. `matchProfileToJob(userId, jobId)`
   - Fetches user profile and job description
   - Calculates match scores
   - Generates recommendations

3. `getJobDescription(jobId, userId)`
   - Retrieves job description with ownership check

4. `getUserJobDescriptions(userId, options)`
   - Lists user's job descriptions with pagination

5. `deleteJobDescription(jobId, userId)`
   - Deletes job description with ownership check

### Controller Layer: JobController

Handles HTTP requests and responses, validates input, and calls service methods.

### AI Integration

The system uses Ollama (local AI) to analyze job descriptions:

**Prompt Structure:**
```
System: You are an expert at analyzing job descriptions...

User: Analyze the following job description and extract:
1. Requirements (required vs preferred)
2. Skills (technical and soft)
3. Experience level
4. Keywords for ATS
5. Company information

[Job Description Text]

Return JSON with structure: { requirements, skills, experienceLevel, keywords, companyInfo }
```

**Fallback:** If AI fails, the system uses basic text analysis to extract common skills and determine experience level.

## Matching Algorithm

### Skill Match Calculation
```typescript
percentage = (matchingSkills.length / requiredSkills.length) * 100
```

Fuzzy matching is used to handle variations (e.g., "JavaScript" matches "JS").

### Experience Relevance Calculation
```typescript
For each experience:
  - Count keyword matches in description, achievements, technologies
  - Calculate relevance score: (matches / total_keywords) * 100
  
Average all experience scores
```

### Education Match Calculation
```typescript
If no education requirements: 100%
If user has required degree level: 100%
If user has any degree: 70%
Otherwise: 0%
```

### Overall Score
```typescript
overallScore = (
  skillMatch * 0.4 +
  experienceRelevance * 0.4 +
  educationMatch * 0.2
)
```

## Testing

Run the test script to verify all endpoints:

```bash
cd packages/backend
node test-job-endpoints.js
```

**Prerequisites:**
- Backend server running on port 3000
- User registered with credentials in test script
- User has profile data (experience, education, skills)

## Error Handling

### Common Errors

| Code | Status | Description |
|------|--------|-------------|
| AUTH_UNAUTHORIZED | 401 | User not authenticated |
| AUTH_FORBIDDEN | 403 | User doesn't own the resource |
| VALIDATION_FAILED | 400 | Missing or invalid input |
| RESOURCE_NOT_FOUND | 404 | Job description not found |
| ANALYSIS_FAILED | 500 | AI analysis error |
| FETCH_FAILED | 500 | Database query error |
| DELETE_FAILED | 500 | Deletion error |

### Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": { ... }
  }
}
```

## Database Schema

### JobDescription Table
```prisma
model JobDescription {
  id           String   @id @default(uuid())
  userId       String
  company      String
  position     String
  rawText      String   @db.Text
  analyzedData Json     // JobAnalysis structure
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  
  user    User     @relation(...)
  resumes Resume[]
}
```

**Indexes:**
- `userId` - Fast user queries
- `userId, company` - Search by company
- `userId, position` - Search by position

## Performance Considerations

1. **AI Analysis**: Takes 2-5 seconds depending on job description length
2. **Profile Matching**: Fast (<100ms) as it's pure computation
3. **Pagination**: Use for large job lists to avoid loading all data
4. **Caching**: Consider caching match results if profile hasn't changed

## Future Enhancements

1. **Semantic Matching**: Use embeddings for better skill matching
2. **Industry-Specific Analysis**: Tailor analysis for different industries
3. **Salary Insights**: Extract and analyze salary information
4. **Company Research**: Integrate with company databases
5. **Application Tracking**: Link to application status
6. **Batch Analysis**: Analyze multiple jobs at once
7. **Match History**: Track how match scores change over time

## Security

- All endpoints require authentication
- Ownership checks prevent unauthorized access
- Input validation prevents injection attacks
- Job descriptions are private to each user

## Usage Example

```javascript
// 1. Analyze a job
const analyzeResponse = await fetch('/api/jobs/analyze', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    company: 'Tech Corp',
    position: 'Senior Developer',
    jobDescription: 'Full job text...'
  })
});

const { jobId, analysis } = analyzeResponse.data;

// 2. Get match results
const matchResponse = await fetch(`/api/jobs/${jobId}`, {
  headers: { 'Authorization': `Bearer ${token}` }
});

const { job, matchResult } = matchResponse.data;

// 3. Display results
console.log(`Overall Match: ${matchResult.overallScore}%`);
console.log(`Skill Match: ${matchResult.skillMatch.percentage}%`);
console.log(`Missing Skills: ${matchResult.skillMatch.missingSkills.join(', ')}`);
```

## Troubleshooting

### AI Analysis Fails
- Check Ollama is running: `curl http://localhost:11434/api/tags`
- Verify model is installed: `ollama list`
- Check logs for AI service errors
- System falls back to basic analysis automatically

### Low Match Scores
- Ensure user profile is complete
- Add more skills to profile
- Update work experience descriptions with relevant keywords
- Check if job requirements are realistic

### Performance Issues
- Enable database query logging to identify slow queries
- Add indexes if querying by new fields
- Consider caching frequently accessed jobs
- Implement rate limiting for AI calls

## Related Documentation

- [Profile Service](./src/services/profile.service.ts)
- [AI Service](./src/services/ai.service.ts)
- [Database Types](./src/types/database.ts)
- [API Documentation](./README.md)
