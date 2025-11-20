# Community Interview Platform - Implementation Guide

## Overview

The Community Interview Platform allows users to share their interview experiences anonymously and access aggregated insights about companies and roles. This helps job seekers prepare for interviews by learning from others' experiences.

## Features Implemented

### 1. Interview Experience Submission
- Users can submit detailed interview experiences including:
  - Company name and role
  - Interview date and outcome
  - Overall difficulty rating
  - Multiple interview rounds with details
  - Preparation tips

### 2. Data Anonymization
- Automatic removal of personally identifiable information (PII):
  - Email addresses → `[email]`
  - Phone numbers → `[phone]`
  - URLs → `[url]`
  - Names with titles (Mr., Mrs., Dr.) → `[name]`
- All experiences are marked as anonymous
- User IDs are not exposed in public queries

### 3. Company Insights Aggregation
- Aggregates data from multiple submissions for the same company/role
- Provides insights on:
  - Interview process structure
  - Common questions asked
  - Topic frequency
  - Difficulty distribution
  - Success tips

### 4. Search and Discovery
- List all companies with available interview data
- Search by company and role
- View submission counts

## API Endpoints

### POST /api/interview/experience
Submit a new interview experience.

**Authentication:** Required

**Request Body:**
```json
{
  "company": "Google",
  "role": "Software Engineer",
  "interviewDate": "2024-01-15T00:00:00.000Z",
  "outcome": "offer",
  "overallDifficulty": "hard",
  "preparationTips": [
    "Practice system design daily",
    "Review algorithms"
  ],
  "rounds": [
    {
      "roundNumber": 1,
      "roundType": "phone-screen",
      "duration": 45,
      "difficulty": "easy",
      "topics": ["Background", "Motivation"],
      "questions": ["Tell me about yourself"],
      "notes": "Friendly recruiter"
    }
  ]
}
```

**Valid Enums:**
- `outcome`: "offer", "rejected", "pending", "withdrew"
- `overallDifficulty`: "easy", "medium", "hard"
- `roundType`: "phone-screen", "technical", "system-design", "behavioral", "cultural-fit", "take-home", "onsite"
- `difficulty`: "easy", "medium", "hard"

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "company": "Google",
    "role": "Software Engineer",
    "message": "Interview experience submitted successfully"
  }
}
```

### GET /api/interview/insights
Get list of companies with available interview data.

**Authentication:** Required

**Response:**
```json
{
  "success": true,
  "data": {
    "companies": [
      {
        "company": "Google",
        "role": "Software Engineer",
        "count": 5
      }
    ],
    "total": 1
  }
}
```

### GET /api/interview/insights/:company/:role
Get aggregated insights for a specific company and role.

**Authentication:** Required

**Parameters:**
- `company`: Company name (case-insensitive)
- `role`: Role/position (case-insensitive)

**Response:**
```json
{
  "success": true,
  "data": {
    "company": "Google",
    "role": "Software Engineer",
    "totalSubmissions": 5,
    "lastUpdated": "2024-01-15T00:00:00.000Z",
    "processStructure": {
      "averageRounds": 4,
      "commonRoundTypes": [
        {
          "type": "technical",
          "frequency": 1.0
        },
        {
          "type": "phone-screen",
          "frequency": 0.8
        }
      ],
      "averageDuration": 0
    },
    "commonQuestions": [
      {
        "question": "Tell me about yourself",
        "frequency": 0.8,
        "category": "screening"
      }
    ],
    "topicFrequency": [
      {
        "topic": "Algorithms",
        "frequency": 0.9
      }
    ],
    "difficultyDistribution": {
      "easy": 0.2,
      "medium": 0.3,
      "hard": 0.5
    },
    "successTips": [
      "Practice system design daily",
      "Review algorithms"
    ]
  }
}
```

## Data Models

### InterviewExperience
```typescript
{
  id: string;
  userId: string;
  company: string;
  role: string;
  interviewDate: Date;
  outcome: 'offer' | 'rejected' | 'pending' | 'withdrew';
  overallDifficulty: 'easy' | 'medium' | 'hard';
  preparationTips: string[];
  isAnonymous: boolean;
  createdAt: Date;
  updatedAt: Date;
  rounds: InterviewRound[];
}
```

### InterviewRound
```typescript
{
  id: string;
  experienceId: string;
  roundNumber: number;
  roundType: 'phone-screen' | 'technical' | 'system-design' | 'behavioral' | 'cultural-fit' | 'take-home' | 'onsite';
  duration: number; // minutes
  difficulty: 'easy' | 'medium' | 'hard';
  topics: string[];
  questions: string[];
  notes: string;
}
```

## Service Architecture

### CommunityService

**Key Methods:**

1. **submitExperience(userId, data)**
   - Validates and anonymizes experience data
   - Creates experience record with rounds
   - Returns created experience

2. **anonymizeExperience(data)**
   - Removes PII from tips, notes, and questions
   - Uses regex patterns to detect and replace PII
   - Returns sanitized data

3. **getCompanyInsights(company, role)**
   - Fetches all experiences for company/role
   - Aggregates data into insights
   - Returns null if no data available

4. **aggregateCompanyInsights(company, role, experiences)**
   - Calculates statistics from experiences
   - Aggregates questions, topics, tips
   - Computes difficulty distribution
   - Returns structured insights

5. **getAvailableCompanies()**
   - Returns list of company/role combinations
   - Includes submission counts
   - Ordered alphabetically

## Anonymization Strategy

The system automatically sanitizes user-submitted content to protect privacy:

### PII Patterns Detected:
1. **Email addresses**: `user@example.com` → `[email]`
2. **Phone numbers**: `555-123-4567` → `[phone]`
3. **URLs**: `https://example.com` → `[url]`
4. **Names with titles**: `Mr. John Smith` → `[name]`

### Where Anonymization Applies:
- Preparation tips
- Round notes
- Round questions

### What's NOT Anonymized:
- Company names (needed for search)
- Role titles (needed for search)
- Topics (generic technical terms)
- Dates (needed for recency)

## Testing

Run the test suite:
```bash
node packages/backend/test-community-platform.js
```

The test suite covers:
- ✓ Interview experience submission
- ✓ Data anonymization
- ✓ Company insights aggregation
- ✓ Available companies listing
- ✓ Input validation
- ✓ Error handling

## Usage Examples

### Submit an Interview Experience

```javascript
const experience = {
  company: 'Google',
  role: 'Software Engineer',
  interviewDate: new Date('2024-01-15'),
  outcome: 'offer',
  overallDifficulty: 'hard',
  preparationTips: [
    'Practice system design problems',
    'Review data structures'
  ],
  rounds: [
    {
      roundNumber: 1,
      roundType: 'phone-screen',
      duration: 45,
      difficulty: 'easy',
      topics: ['Background', 'Motivation'],
      questions: ['Tell me about yourself'],
      notes: 'Friendly recruiter'
    },
    {
      roundNumber: 2,
      roundType: 'technical',
      duration: 60,
      difficulty: 'hard',
      topics: ['Algorithms', 'Data Structures'],
      questions: ['Implement LRU Cache'],
      notes: 'Challenging but fair'
    }
  ]
};

const response = await fetch('/api/interview/experience', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(experience)
});
```

### Get Company Insights

```javascript
const response = await fetch('/api/interview/insights/Google/Software Engineer', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const insights = await response.json();
console.log(`Average rounds: ${insights.data.processStructure.averageRounds}`);
console.log(`Difficulty: ${insights.data.difficultyDistribution.hard * 100}% hard`);
```

### Search Companies

```javascript
const response = await fetch('/api/interview/insights', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const { companies } = await response.json();
companies.forEach(c => {
  console.log(`${c.company} - ${c.role}: ${c.count} submissions`);
});
```

## Error Handling

### Common Errors:

**400 Bad Request**
- Missing required fields
- Invalid enum values
- Empty rounds array
- Invalid round data

**401 Unauthorized**
- Missing or invalid authentication token

**404 Not Found**
- No data available for requested company/role

**500 Internal Server Error**
- Database errors
- Unexpected server errors

### Error Response Format:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "Missing required fields: company, role"
  }
}
```

## Security Considerations

1. **Authentication Required**: All endpoints require valid JWT token
2. **Data Anonymization**: Automatic PII removal from all submissions
3. **User Isolation**: Users can only submit their own experiences
4. **Input Validation**: Strict validation of all input data
5. **SQL Injection Prevention**: Using Prisma ORM with parameterized queries

## Performance Considerations

1. **Database Indexes**: 
   - Indexed on `company`, `role`, `company+role`
   - Indexed on `isAnonymous` for filtering
   - Indexed on `userId` for user queries

2. **Aggregation Optimization**:
   - Insights are calculated on-demand
   - Consider caching for frequently accessed companies
   - Limit top questions to 20 items

3. **Query Optimization**:
   - Use `include` to fetch rounds with experiences
   - Case-insensitive search using Prisma's `mode: 'insensitive'`

## Future Enhancements

1. **Caching**: Cache insights for popular companies (Redis)
2. **Real-time Updates**: WebSocket notifications for new submissions
3. **Advanced Search**: Filter by date range, outcome, difficulty
4. **Verification**: Verify submissions with LinkedIn/email
5. **Moderation**: Flag and review inappropriate content
6. **Analytics**: Track most viewed companies, trending roles
7. **Export**: Allow users to export insights as PDF
8. **Recommendations**: Suggest similar companies based on profile

## Requirements Mapping

This implementation satisfies the following requirements:

- **Requirement 9.1**: Submit interview experiences with company, role, date, outcome
- **Requirement 9.2**: Describe interview process with rounds and details
- **Requirement 9.3**: List specific questions asked during rounds
- **Requirement 9.4**: Add difficulty ratings, topics, and preparation tips
- **Requirement 9.5**: Anonymize all submitted experiences
- **Requirement 10.1**: Search and view company interview data
- **Requirement 10.2**: Show typical interview process structure
- **Requirement 10.3**: Display commonly asked questions by category
- **Requirement 10.4**: Show difficulty ratings and success tips
- **Requirement 10.5**: Indicate submission count and data recency

## Troubleshooting

### Issue: PII not being anonymized
- Check regex patterns in `sanitizeText()` method
- Verify anonymization is called before database insert
- Test with various PII formats

### Issue: No insights returned
- Verify experiences exist in database
- Check company/role spelling (case-insensitive)
- Ensure `isAnonymous` flag is set to true

### Issue: Validation errors
- Check enum values match exactly
- Ensure all required fields are present
- Verify rounds array is not empty
- Check data types (numbers, dates, strings)

## Support

For issues or questions:
1. Check the test suite for examples
2. Review error messages for validation issues
3. Check database for data integrity
4. Review logs for detailed error information
