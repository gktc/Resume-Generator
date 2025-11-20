# ATS Resume Builder - API Overview

## 🎯 Available API Endpoints

### 🔐 Authentication (`/api/auth`)
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Login and get JWT tokens
- `POST /api/auth/logout` - Logout
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user info

### 👤 Profile Management (`/api/profile`)
- `GET /api/profile` - Get complete user profile
- **Work Experience:**
  - `POST /api/profile/experience` - Add work experience
  - `GET /api/profile/experience` - List all experiences
  - `PUT /api/profile/experience/:id` - Update experience
  - `DELETE /api/profile/experience/:id` - Delete experience
- **Education:**
  - `POST /api/profile/education` - Add education
  - `GET /api/profile/education` - List all education
  - `PUT /api/profile/education/:id` - Update education
  - `DELETE /api/profile/education/:id` - Delete education
- **Skills:**
  - `POST /api/profile/skills` - Add skill
  - `GET /api/profile/skills` - List all skills
  - `PUT /api/profile/skills/:id` - Update skill
  - `DELETE /api/profile/skills/:id` - Delete skill
- **Projects:**
  - `POST /api/profile/projects` - Add project
  - `GET /api/profile/projects` - List all projects
  - `PUT /api/profile/projects/:id` - Update project
  - `DELETE /api/profile/projects/:id` - Delete project

### 📄 Resume Upload (`/api/upload`)
- `POST /api/upload/resume` - Upload PDF/DOCX resume
- `GET /api/upload/parsed/:id` - Get parsed resume data
- `POST /api/upload/confirm/:id` - Confirm and save parsed data

### 💼 Job Analysis (`/api/jobs`)
- `POST /api/jobs/analyze` - Analyze job description with AI
- `GET /api/jobs` - List saved job descriptions
- `GET /api/jobs/:id` - Get job details with analysis
- `DELETE /api/jobs/:id` - Delete job description

### 📋 Templates (`/api/templates`)
- `GET /api/templates` - List all resume templates
- `GET /api/templates/:id` - Get template details
- `GET /api/templates/:id/preview` - Get template preview image

### 📝 Resume Generation (`/api/resume`)
- `POST /api/resume/generate` - Generate resume (queued job)
- `GET /api/resume/status/:jobId` - Check generation status
- `GET /api/resume/:id` - Get resume details
- `GET /api/resume/:id/download` - Download resume PDF
- `GET /api/resume` - List user's resumes
- `POST /api/resume/:id/regenerate` - Regenerate resume
- `DELETE /api/resume/:id` - Delete resume

## 🏗️ Current Implementation Status

### ✅ Fully Implemented
1. **Authentication System** - Complete with JWT, registration, login
2. **Profile Management** - All CRUD operations for experience, education, skills, projects
3. **Resume Upload & Parsing** - PDF/DOCX parsing with AI extraction
4. **Job Analysis** - AI-powered job description analysis and profile matching
5. **Template System** - 3 professional LaTeX templates with variable substitution
6. **Resume Generation** - Partially complete:
   - ✅ Queue infrastructure (Bull + Redis)
   - ✅ Service and controller setup
   - ✅ Content selection algorithm
   - ⏳ AI content optimization (in progress)
   - ⏳ ATS score calculation
   - ⏳ LaTeX compilation
   - ⏳ API endpoints

### ⏳ In Progress
- **Resume Generation Pipeline** - Core logic implemented, needs completion

### 📋 Not Yet Implemented
- Interview preparation module
- Community interview platform
- Frontend application

## 🚀 How to Run

### Prerequisites
1. **Docker Desktop** - Must be running
2. **Node.js** - v18 or higher
3. **Ollama** (optional) - For AI features

### Quick Start
```bash
# 1. Start Docker services
docker-compose up -d

# 2. Install dependencies
cd packages/backend
npm install

# 3. Set up database
npx prisma generate
npx prisma migrate deploy
npm run prisma:seed:templates

# 4. Start development server
npm run dev
```

Server runs on: http://localhost:3000

### Test the API
```bash
# Health check
curl http://localhost:3000/health

# Register a user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!","firstName":"John","lastName":"Doe"}'
```

## 📊 Database Schema

The application uses PostgreSQL with the following main tables:
- `User` - User accounts
- `WorkExperience` - Job history
- `Education` - Academic background
- `Skill` - Technical and soft skills
- `Project` - Portfolio projects
- `JobDescription` - Saved job postings with AI analysis
- `Template` - LaTeX resume templates
- `Resume` - Generated resumes with metadata
- `InterviewQuestion` - AI-generated interview questions
- `InterviewExperience` - Community-submitted interview data

## 🔧 Technology Stack

- **Runtime:** Node.js + TypeScript
- **Framework:** Express.js
- **Database:** PostgreSQL + Prisma ORM
- **Queue:** Bull + Redis
- **AI:** Ollama (Gemma 2B model)
- **File Processing:** pdf-parse, mammoth
- **LaTeX:** pdflatex in Docker container
- **Authentication:** JWT tokens
