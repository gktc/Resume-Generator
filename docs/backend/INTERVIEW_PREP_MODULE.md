# Interview Preparation Module

## Overview

The Interview Preparation Module generates AI-powered interview questions based on a user's resume and the job description they're applying for. It provides categorized questions with answer frameworks and talking points to help candidates prepare effectively.

## Features

### 1. AI-Powered Question Generation
- Analyzes resume content and job description
- Generates 12-15 relevant interview questions
- References specific resume content in questions
- Categorizes questions by type
- Assigns difficulty levels

### 2. Question Categories
- **Technical**: Questions about specific skills and technologies
- **Behavioral**: STAR method scenario-based questions
- **Experience-based**: Questions about work history and achievements
- **Role-specific**: Questions tailored to the target position

### 3. Answer Frameworks
- STAR method structure for behavioral questions
- Structured approach for technical questions
- Context-specific guidance based on user's profile
- Relevant examples from user's experience

### 4. Talking Points
- 3-5 specific points to mention in answers
- Based on actual user experience
- Helps candidates prepare concrete examples

## API Endpoints

### Get Interview Questions

**Endpoint**: `GET /api/interview/questions/:resumeId`

**Authentication**: Required (Bearer token)

**Parameters**:
- `resumeId` (path parameter): ID of the resume to generate questions for

**Query Parameters** (optional):
- `category`: Filter by category (`technical`, `behavioral`, `experience`, `role-specific`)
- `difficulty`: Filter by difficulty (`easy`, `medium`, `hard`)

**Response**:
```json
{
  "success": true,
  "data": {
    "questions": {
      "technical": [
        {
          "id": "uuid",
          "question": "Can you explain your experience with React and how you've used it in production?",
          "category": "technical",
          "difficulty": "medium",
          "relatedContent": "Frontend Developer at TechCorp: Built responsive web applications using React",
          "answerFramework": "Structure your answer:\n1. Define React and its benefits\n2. Explain your experience level\n3. Provide specific project examples\n4. Discuss best practices you follow",
          "talkingPoints": [
            "Mention the e-commerce platform project",
            "Discuss component architecture decisions",
            "Highlight performance optimizations",
            "Reference state management with Redux"
          ]
        }
      ],
      "behavioral": [...],
      "experience": [...],
      "roleSpecific": [...]
    },
    "total": 14
  }
}
```

**Error Responses**:

401 Unauthorized:
```json
{
  "success": false,
  "error": {
    "code": "AUTH_UNAUTHORIZED",
    "message": "User not authenticated"
  }
}
```

403 Forbidden:
```json
{
  "success": false,
  "error": {
    "code": "AUTH_FORBIDDEN",
    "message": "You do not have access to this resume"
  }
}
```

404 Not Found:
```json
{
  "success": false,
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "Resume not found"
  }
}
```

## Service Architecture

### InterviewPrepService

**Main Methods**:

1. `generateQuestionsForResume(userId, resumeId)`
   - Checks if questions already exist
   - Fetches resume and job description
   - Generates questions using AI
   - Generates answer frameworks
   - Stores questions in database
   - Returns categorized questions

2. `generateQuestions(resume)` (private)
   - Uses AI to analyze resume and job description
   - Generates 12-15 questions across categories
   - References specific resume content
   - Assigns difficulty levels
   - Falls back to generic questions if AI fails

3. `generateAnswerFrameworks(questions, resume)` (private)
   - Creates answer frameworks for each question
   - Uses STAR method for behavioral questions
   - Provides structured approach for other categories
   - Generates talking points based on user's background
   - Falls back to default frameworks if AI fails

4. `getCategorizedQuestions(userId, resumeId, category?, difficulty?)`
   - Fetches questions from database
   - Filters by category and/or difficulty if specified
   - Returns questions organized by category

## AI Prompts

### Question Generation Prompt

The service uses a detailed prompt that includes:
- Job information (company, position, required skills, experience level)
- Resume summary
- Work experience details
- Skills list
- Projects

The AI is instructed to:
- Generate 12-15 questions across 4 categories
- Reference specific resume content
- Assign appropriate difficulty levels
- Create realistic interview scenarios

### Answer Framework Prompt

For each question, the service generates:
- Structured answer framework (STAR method for behavioral)
- 3-5 specific talking points
- Context-specific guidance
- Examples from user's actual experience

## Database Schema

### InterviewQuestion Model

```prisma
model InterviewQuestion {
  id              String   @id @default(uuid())
  userId          String
  resumeId        String
  question        String   @db.Text
  category        String   // 'technical', 'behavioral', 'experience', 'role-specific'
  difficulty      String   // 'easy', 'medium', 'hard'
  relatedContent  String   @db.Text
  answerFramework String?  @db.Text
  talkingPoints   String[]
  createdAt       DateTime @default(now())

  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  resume Resume @relation(fields: [resumeId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([resumeId])
  @@index([category])
}
```

## Usage Examples

### 1. Generate Questions for a Resume

```typescript
// Frontend code
const response = await axios.get(
  `/api/interview/questions/${resumeId}`,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  }
);

const { questions, total } = response.data.data;
console.log(`Generated ${total} questions`);
```

### 2. Filter by Category

```typescript
const response = await axios.get(
  `/api/interview/questions/${resumeId}?category=behavioral`,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  }
);

const behavioralQuestions = response.data.data.questions.behavioral;
```

### 3. Filter by Difficulty

```typescript
const response = await axios.get(
  `/api/interview/questions/${resumeId}?difficulty=hard`,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  }
);
```

## Error Handling

The service includes comprehensive error handling:

1. **AI Service Failures**: Falls back to generic questions
2. **Framework Generation Failures**: Uses default frameworks
3. **Database Errors**: Proper error messages and logging
4. **Authorization**: Verifies user owns the resume
5. **Validation**: Validates category and difficulty filters

## Performance Considerations

1. **Caching**: Questions are stored in database after first generation
2. **Batch Processing**: Answer frameworks generated in parallel
3. **Fallback Mechanisms**: Generic questions if AI fails
4. **Efficient Queries**: Indexed database queries for filtering

## Testing

Run the test script:

```bash
cd packages/backend
node test-interview-prep.js
```

The test script will:
1. Login with test credentials
2. Fetch available resumes
3. Generate interview questions
4. Test category filtering
5. Test difficulty filtering

## Future Enhancements

1. **Question Regeneration**: Allow users to regenerate specific questions
2. **Custom Questions**: Let users add their own questions
3. **Practice Mode**: Track which questions have been practiced
4. **Answer Recording**: Allow users to record practice answers
5. **Feedback System**: AI feedback on practice answers
6. **Question Difficulty Adjustment**: Learn from user feedback
7. **Company-Specific Questions**: Integrate with community interview data
8. **Mock Interview Mode**: Timed interview simulation

## Requirements Mapping

This module satisfies the following requirements:

- **Requirement 8.1**: Analyzes resume and job description to generate questions
- **Requirement 8.2**: Categorizes questions into technical, behavioral, experience, and role-specific
- **Requirement 8.3**: References specific resume claims in questions
- **Requirement 8.4**: Provides answer frameworks and talking points
- **Requirement 8.5**: Allows access to questions for any generated resume

## Related Modules

- **Resume Generation**: Questions are based on generated resumes
- **Job Analysis**: Uses job description analysis for context
- **AI Service**: Leverages Ollama for question generation
- **Profile Service**: Uses user profile data for talking points
