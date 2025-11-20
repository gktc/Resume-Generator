---
inclusion: always
---

# ATS Resume Builder Project Context

## Project Overview

This is an AI-powered resume builder that generates ATS-optimized resumes tailored to specific job descriptions. The application helps job seekers create targeted resumes and prepare for interviews using community-contributed interview experiences.

## Core Features

1. **User Authentication** - Secure account creation and login
2. **Profile Management** - Store career information (experience, education, skills, projects)
3. **Resume Upload & Parsing** - Extract data from existing PDF/DOCX resumes
4. **Job Description Analysis** - AI-powered extraction of requirements and skills
5. **LaTeX Template System** - Multiple professional resume templates
6. **Resume Generation** - Create ATS-optimized resumes with scoring
7. **Interview Preparation** - Generate potential interview questions
8. **Community Platform** - Share and access anonymous interview experiences

## Technology Stack

### Backend
- Runtime: Node.js
- Framework: Express.js
- Language: TypeScript
- Database: PostgreSQL
- ORM: Prisma or TypeORM
- Authentication: JWT tokens
- File Processing: pdf-parse, mammoth (for DOCX)
- LaTeX Compilation: pdflatex (in Docker containers)

### Frontend
- Framework: React
- Language: TypeScript
- State Management: React Context or Redux
- Styling: Tailwind CSS or Material-UI
- HTTP Client: Axios
- Routing: React Router

### AI/ML
- LLM: Ollama with Gemma 2B (local, free, private)
- Use Cases: Job description analysis, resume optimization, interview question generation
- Benefits: No API costs, data privacy, offline capability

### Infrastructure
- Containerization: Docker
- Queue System: Bull or BullMQ (for async resume generation)
- File Storage: Local filesystem or S3
- Caching: Redis (optional)

## Key Technical Considerations

### Resume Parsing
- Support PDF and DOCX formats
- Extract structured data: work experience, education, skills, projects
- Handle various resume formats and layouts
- Present extracted data for user review and correction

### LaTeX Compilation
- Run LaTeX compilation in isolated containers for security
- Handle compilation errors gracefully
- Support template variables: {{name}}, {{email}}, {{experience}}, etc.
- Generate high-quality PDF output

### ATS Score Calculation
- Keyword matching between resume and job description
- Format parseability check
- Experience relevance scoring
- Education and certification matching
- Provide detailed score breakdown

### Security
- Encrypt sensitive user data at rest
- Secure file upload handling (validate file types, scan for malware)
- Rate limiting on API endpoints
- Input validation and sanitization
- Secure LaTeX compilation (prevent code injection)

### Performance
- Resume generation should be asynchronous (use job queue)
- Cache compiled LaTeX templates
- Optimize database queries with proper indexing
- Implement pagination for resume history and community data

## Data Models (High-Level)

- **User**: Authentication and profile information
- **WorkExperience**: Job history entries
- **Education**: Academic background
- **Skill**: Technical and soft skills
- **Project**: Portfolio projects
- **JobDescription**: Saved job postings
- **Resume**: Generated resume metadata
- **InterviewExperience**: Community-submitted interview data

## API Structure

- `/api/auth/*` - Authentication endpoints
- `/api/profile/*` - User profile management
- `/api/resume/*` - Resume generation and history
- `/api/templates/*` - LaTeX template management
- `/api/interview/*` - Interview preparation and community data
- `/api/upload/*` - File upload handling

## Development Workflow

1. Start with database schema and migrations
2. Build API endpoints with proper validation
3. Implement core business logic (parsing, generation, scoring)
4. Create frontend components
5. Integrate AI services
6. Add testing for critical paths
7. Deploy with proper security measures
