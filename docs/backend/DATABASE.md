# Database Documentation

## Overview

The ATS Resume Builder uses PostgreSQL as its primary database with Prisma as the ORM. The schema is designed to support user profiles, resume generation, job analysis, and community interview insights.

## Entity Relationship Diagram

```
User
├── Sessions (1:N)
├── WorkExperiences (1:N)
├── Educations (1:N)
├── Skills (1:N)
├── Projects (1:N)
├── JobDescriptions (1:N)
│   └── Resumes (1:N)
│       ├── Template (N:1)
│       └── InterviewQuestions (1:N)
└── InterviewExperiences (1:N)
    └── InterviewRounds (1:N)
```

## Tables

### users
Stores user account information and authentication data.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| email | String | Unique email address |
| passwordHash | String | Bcrypt hashed password |
| firstName | String | User's first name |
| lastName | String | User's last name |
| createdAt | DateTime | Account creation timestamp |
| updatedAt | DateTime | Last update timestamp |

**Indexes:**
- `email` (unique)

### sessions
Manages JWT authentication sessions.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| userId | UUID | Foreign key to users |
| token | String | JWT token (unique) |
| expiresAt | DateTime | Token expiration time |
| createdAt | DateTime | Session creation timestamp |

**Indexes:**
- `userId`
- `token` (unique)
- `expiresAt`

### work_experiences
Stores user's work history.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| userId | UUID | Foreign key to users |
| company | String | Company name |
| position | String | Job title |
| startDate | DateTime | Employment start date |
| endDate | DateTime? | Employment end date (null if current) |
| description | Text | Job description |
| achievements | String[] | List of achievements |
| technologies | String[] | Technologies used |
| order | Int | Display order |
| createdAt | DateTime | Creation timestamp |
| updatedAt | DateTime | Last update timestamp |

**Indexes:**
- `userId`
- `(userId, order)` composite

### educations
Stores user's educational background.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| userId | UUID | Foreign key to users |
| institution | String | School/University name |
| degree | String | Degree type (BS, MS, PhD, etc.) |
| fieldOfStudy | String | Major/Field of study |
| startDate | DateTime | Start date |
| endDate | DateTime? | End date (null if current) |
| gpa | Float? | GPA (optional) |
| achievements | String[] | Academic achievements |
| order | Int | Display order |
| createdAt | DateTime | Creation timestamp |
| updatedAt | DateTime | Last update timestamp |

**Indexes:**
- `userId`
- `(userId, order)` composite

### skills
Stores user's skills and proficiency levels.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| userId | UUID | Foreign key to users |
| name | String | Skill name |
| category | String | Skill category (technical, soft, language, etc.) |
| proficiency | String | Proficiency level (beginner, intermediate, advanced, expert) |
| yearsOfExperience | Int? | Years of experience (optional) |
| order | Int | Display order |
| createdAt | DateTime | Creation timestamp |
| updatedAt | DateTime | Last update timestamp |

**Indexes:**
- `userId`
- `(userId, category)` composite
- `(userId, order)` composite

### projects
Stores user's portfolio projects.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| userId | UUID | Foreign key to users |
| title | String | Project title |
| description | Text | Project description |
| technologies | String[] | Technologies used |
| url | String? | Project URL (optional) |
| githubUrl | String? | GitHub repository URL (optional) |
| startDate | DateTime? | Project start date (optional) |
| endDate | DateTime? | Project end date (optional) |
| highlights | String[] | Key highlights |
| order | Int | Display order |
| createdAt | DateTime | Creation timestamp |
| updatedAt | DateTime | Last update timestamp |

**Indexes:**
- `userId`
- `(userId, order)` composite

### job_descriptions
Stores job postings with AI-analyzed data.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| userId | UUID | Foreign key to users |
| company | String | Company name |
| position | String | Job title |
| rawText | Text | Original job description text |
| analyzedData | JSON | AI-analyzed job requirements and keywords |
| createdAt | DateTime | Creation timestamp |
| updatedAt | DateTime | Last update timestamp |

**Indexes:**
- `userId`
- `(userId, company)` composite
- `(userId, position)` composite

**JSON Structure (analyzedData):**
```json
{
  "requirements": [
    {
      "text": "5+ years of experience",
      "category": "required",
      "type": "experience",
      "importance": 0.9
    }
  ],
  "skills": ["JavaScript", "React", "Node.js"],
  "experienceLevel": "Senior",
  "keywords": ["full-stack", "agile", "cloud"],
  "companyInfo": "Tech startup in San Francisco"
}
```

### resumes
Stores generated resumes with ATS scores.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| userId | UUID | Foreign key to users |
| jobDescriptionId | UUID | Foreign key to job_descriptions |
| templateId | UUID | Foreign key to templates |
| fileName | String | Generated file name |
| filePath | String | File storage path |
| atsScore | JSON | ATS score breakdown |
| generatedContent | JSON | Optimized resume content |
| status | String | Generation status (pending, processing, completed, failed) |
| createdAt | DateTime | Creation timestamp |
| updatedAt | DateTime | Last update timestamp |

**Indexes:**
- `userId`
- `(userId, status)` composite
- `jobDescriptionId`
- `templateId`

**JSON Structure (atsScore):**
```json
{
  "overall": 85,
  "breakdown": {
    "keywordMatch": 90,
    "experienceRelevance": 85,
    "formatParseability": 95,
    "educationMatch": 70
  },
  "missingKeywords": ["Docker", "Kubernetes"],
  "suggestions": ["Add more quantifiable achievements"]
}
```

### templates
Stores LaTeX resume templates.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| name | String | Template name |
| description | Text | Template description |
| category | String | Template category (modern, classic, creative, academic, technical) |
| previewImageUrl | String | Preview image URL |
| latexContent | Text | LaTeX template code |
| variables | String[] | List of template variables |
| isActive | Boolean | Whether template is available |
| createdAt | DateTime | Creation timestamp |
| updatedAt | DateTime | Last update timestamp |

**Indexes:**
- `category`
- `isActive`

### interview_questions
Stores AI-generated interview questions for resumes.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| userId | UUID | Foreign key to users |
| resumeId | UUID | Foreign key to resumes |
| question | Text | Interview question |
| category | String | Question category (technical, behavioral, experience, role-specific) |
| difficulty | String | Difficulty level (easy, medium, hard) |
| relatedContent | Text | Related resume content |
| answerFramework | Text? | Suggested answer structure (optional) |
| talkingPoints | String[] | Key talking points |
| createdAt | DateTime | Creation timestamp |

**Indexes:**
- `userId`
- `resumeId`
- `category`

### interview_experiences
Stores community-submitted interview experiences.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| userId | UUID | Foreign key to users |
| company | String | Company name |
| role | String | Job role |
| interviewDate | DateTime | Interview date |
| outcome | String | Interview outcome (offer, rejected, pending, withdrew) |
| overallDifficulty | String | Overall difficulty (easy, medium, hard) |
| preparationTips | String[] | Preparation tips |
| isAnonymous | Boolean | Whether experience is anonymous |
| createdAt | DateTime | Creation timestamp |
| updatedAt | DateTime | Last update timestamp |

**Indexes:**
- `userId`
- `company`
- `role`
- `(company, role)` composite
- `isAnonymous`

### interview_rounds
Stores individual interview rounds within an experience.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| experienceId | UUID | Foreign key to interview_experiences |
| roundNumber | Int | Round sequence number |
| roundType | String | Round type (phone-screen, technical, system-design, behavioral, cultural-fit, take-home, onsite) |
| duration | Int | Duration in minutes |
| difficulty | String | Difficulty level (easy, medium, hard) |
| topics | String[] | Topics covered |
| questions | String[] | Questions asked |
| notes | Text | Additional notes |

**Indexes:**
- `experienceId`
- `roundType`

## Data Relationships

### One-to-Many Relationships

1. **User → Sessions**: A user can have multiple active sessions
2. **User → WorkExperiences**: A user can have multiple work experiences
3. **User → Educations**: A user can have multiple education entries
4. **User → Skills**: A user can have multiple skills
5. **User → Projects**: A user can have multiple projects
6. **User → JobDescriptions**: A user can save multiple job descriptions
7. **User → Resumes**: A user can generate multiple resumes
8. **User → InterviewExperiences**: A user can submit multiple interview experiences
9. **JobDescription → Resumes**: A job description can have multiple resume versions
10. **Resume → InterviewQuestions**: A resume can have multiple interview questions
11. **InterviewExperience → InterviewRounds**: An experience can have multiple rounds

### Many-to-One Relationships

1. **Resume → Template**: Multiple resumes can use the same template
2. **Resume → JobDescription**: Multiple resumes can target the same job
3. **Resume → User**: Multiple resumes belong to one user

## Cascade Behavior

### ON DELETE CASCADE

- Deleting a **User** cascades to:
  - All sessions
  - All work experiences
  - All educations
  - All skills
  - All projects
  - All job descriptions
  - All resumes
  - All interview questions
  - All interview experiences

- Deleting a **JobDescription** cascades to:
  - All associated resumes

- Deleting a **Resume** cascades to:
  - All associated interview questions

- Deleting an **InterviewExperience** cascades to:
  - All associated interview rounds

## Query Patterns

### Common Queries

#### Get Complete User Profile
```typescript
const profile = await prisma.user.findUnique({
  where: { id: userId },
  include: {
    workExperiences: { orderBy: { order: 'asc' } },
    educations: { orderBy: { order: 'asc' } },
    skills: { orderBy: { order: 'asc' } },
    projects: { orderBy: { order: 'asc' } },
  },
});
```

#### Get User's Resumes with Pagination
```typescript
const resumes = await prisma.resume.findMany({
  where: { userId },
  include: {
    jobDescription: true,
    template: true,
  },
  orderBy: { createdAt: 'desc' },
  skip: (page - 1) * pageSize,
  take: pageSize,
});
```

#### Search Interview Experiences
```typescript
const experiences = await prisma.interviewExperience.findMany({
  where: {
    company: { contains: searchTerm, mode: 'insensitive' },
    role: { contains: roleFilter, mode: 'insensitive' },
    isAnonymous: true,
  },
  include: {
    rounds: { orderBy: { roundNumber: 'asc' } },
  },
  orderBy: { interviewDate: 'desc' },
});
```

## Performance Considerations

### Indexing Strategy

1. **Foreign Keys**: All foreign keys are indexed for join performance
2. **User Scoping**: Composite indexes on `(userId, *)` for user-scoped queries
3. **Search Fields**: Indexes on frequently searched fields (company, role, email)
4. **Status Fields**: Indexes on status fields for filtering

### Query Optimization

1. **Use `select`** to fetch only needed fields
2. **Use `include`** judiciously to avoid over-fetching
3. **Implement pagination** for large result sets
4. **Use `orderBy`** with indexed fields
5. **Batch operations** with `createMany`, `updateMany`, `deleteMany`

### Caching Strategy

1. **Template Data**: Cache templates (rarely change)
2. **Job Analysis**: Cache analysis results (24 hours)
3. **Company Insights**: Cache aggregated insights (1 hour)
4. **User Profile**: Cache profile data with invalidation on updates

## Backup and Recovery

### Backup Strategy

```bash
# Manual backup
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore from backup
psql $DATABASE_URL < backup_file.sql
```

### Migration Safety

1. Always test migrations on staging first
2. Backup database before production migrations
3. Use transactions for data migrations
4. Have rollback plan ready

## Security Considerations

1. **Password Hashing**: Use bcrypt with salt rounds >= 10
2. **SQL Injection**: Prisma uses parameterized queries (safe by default)
3. **Data Encryption**: Encrypt sensitive fields at application level
4. **Access Control**: Implement row-level security in application logic
5. **Audit Logging**: Log sensitive data access

## Monitoring

### Key Metrics

1. **Query Performance**: Monitor slow queries (> 100ms)
2. **Connection Pool**: Monitor active/idle connections
3. **Database Size**: Track table sizes and growth
4. **Index Usage**: Identify unused indexes
5. **Lock Contention**: Monitor for deadlocks

### Prisma Metrics

```typescript
// Enable query logging
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

// Monitor query performance
prisma.$on('query', (e) => {
  if (e.duration > 100) {
    console.warn(`Slow query (${e.duration}ms): ${e.query}`);
  }
});
```

## Future Enhancements

1. **Full-text Search**: Add PostgreSQL full-text search for job descriptions
2. **Partitioning**: Partition large tables by date for better performance
3. **Read Replicas**: Add read replicas for scaling reads
4. **Materialized Views**: Create views for complex aggregations
5. **Time-series Data**: Consider TimescaleDB for analytics
