# Implementation Plan

## Current Status

**Backend Progress:** Tasks 1-9 are complete (100% of core backend functionality)
- ✅ Authentication, profile management, resume parsing, job analysis
- ✅ LaTeX templates, resume generation pipeline with ATS scoring
- ✅ All API endpoints for resume management

**Frontend Progress:** Not started (0%)
- ⏳ All UI components and pages need to be built
- ⏳ Authentication, profile, resume generation, and community features

**Interview & Community Features:** Not started (0%)
- ⏳ Backend services and API endpoints for interview preparation
- ⏳ Community platform for sharing interview experiences
- ⏳ Frontend UI for interview questions and company insights

---

- [x] 1. Set up project structure and development environment
  - Initialize monorepo with backend and frontend workspaces
  - Configure TypeScript for both projects
  - Set up Docker Compose with PostgreSQL, Redis, and LaTeX containers
  - Create environment configuration files
  - Set up ESLint and Prettier
  - Configure Ollama with Gemma 2B model for local AI processing
  - _Requirements: All requirements depend on proper project setup_

- [x] 2. Implement database schema and migrations
  - Design and create Prisma schema for all data models
  - Create migrations for User, WorkExperience, Education, Skill, Project tables
  - Create migrations for JobDescription, Resume, Template tables
  - Create migrations for InterviewQuestion, InterviewExperience, InterviewRound tables
  - Set up database indexes for performance optimization
  - _Requirements: 1.3, 2.1, 2.2, 2.3, 2.4, 3.5, 4.1, 5.5, 6.5, 7.1, 8.5, 9.5, 10.5_

- [x] 3. Build authentication system
  - [x] 3.1 Implement user registration endpoint with password hashing
    - Create POST /api/auth/register endpoint
    - Implement bcrypt password hashing
    - Validate email format and password strength
    - Create user profile storage on registration
    - _Requirements: 1.1, 1.3_

  - [x] 3.2 Implement user login with JWT tokens
    - Create POST /api/auth/login endpoint
    - Implement JWT token generation (access and refresh tokens)
    - Validate credentials against database
    - Return tokens in response
    - _Requirements: 1.2_

  - [x] 3.3 Create authentication middleware
    - Implement JWT token verification middleware
    - Add user context to authenticated requests
    - Handle token expiration and refresh
    - _Requirements: 1.2, 1.4_

  - [x] 3.4 Implement logout and session management
    - Create POST /api/auth/logout endpoint
    - Implement token invalidation
    - Create GET /api/auth/me endpoint for current user
    - Create POST /api/auth/refresh endpoint for token refresh
    - _Requirements: 1.5_

- [x] 4. Create profile management API





  - [x] 4.1 Create profile service and controller


    - Create ProfileService class with methods for profile data management
    - Create ProfileController class with request handlers
    - Set up profile routes file
    - Register profile routes in main index.ts
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

  - [x] 4.2 Implement work experience CRUD operations

    - Implement POST /api/profile/experience endpoint with validation
    - Implement GET /api/profile/experience endpoint (list all for user)
    - Implement PUT /api/profile/experience/:id endpoint with ownership check
    - Implement DELETE /api/profile/experience/:id endpoint with ownership check
    - Add date validation (startDate before endDate)
    - _Requirements: 2.1, 2.5_

  - [x] 4.3 Implement education CRUD operations

    - Implement POST /api/profile/education endpoint with validation
    - Implement GET /api/profile/education endpoint (list all for user)
    - Implement PUT /api/profile/education/:id endpoint with ownership check
    - Implement DELETE /api/profile/education/:id endpoint with ownership check
    - _Requirements: 2.2, 2.5_

  - [x] 4.4 Implement skills CRUD operations

    - Implement POST /api/profile/skills endpoint with validation
    - Implement GET /api/profile/skills endpoint (list all for user)
    - Implement PUT /api/profile/skills/:id endpoint with ownership check
    - Implement DELETE /api/profile/skills/:id endpoint with ownership check
    - Support skill categorization (technical, soft, language) and proficiency levels
    - _Requirements: 2.3, 2.5_

  - [x] 4.5 Implement projects CRUD operations

    - Implement POST /api/profile/projects endpoint with validation
    - Implement GET /api/profile/projects endpoint (list all for user)
    - Implement PUT /api/profile/projects/:id endpoint with ownership check
    - Implement DELETE /api/profile/projects/:id endpoint with ownership check
    - _Requirements: 2.4, 2.5_

  - [x] 4.6 Create profile overview endpoint

    - Implement GET /api/profile endpoint
    - Return complete user profile with all related data (experience, education, skills, projects)
    - Use Prisma's include to efficiently load related data and avoid N+1 queries
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [x] 5. Implement resume upload and parsing




  - [x] 5.1 Create resume parser service and upload infrastructure


    - Create ResumeParserService class
    - Create UploadController class
    - Configure Multer middleware for file uploads
    - Set up upload routes file
    - Register upload routes in main index.ts
    - _Requirements: 2.5.1, 2.5.2_

  - [x] 5.2 Implement file upload endpoint with validation

    - Implement POST /api/upload/resume endpoint with Multer
    - Validate file type (PDF, DOCX only) using mimetype and extension checks
    - Validate file size (max 10MB)
    - Store uploaded file temporarily with unique filename
    - Return upload ID for tracking
    - _Requirements: 2.5.1_

  - [x] 5.3 Implement PDF and DOCX text extraction

    - Create extractTextFromPDF method using pdf-parse library
    - Create extractTextFromDOCX method using mammoth library
    - Handle parsing errors gracefully with user-friendly messages
    - Clean and normalize extracted text
    - _Requirements: 2.5.2, 2.5.4_

  - [x] 5.4 Create AI-powered resume data extraction

    - Design prompts for Ollama to extract structured data from resume text
    - Implement extractWorkExperience method to parse job history
    - Implement extractEducation method to parse academic background
    - Implement extractSkills method to identify skills and proficiency
    - Implement extractProjects method to parse project information
    - Parse AI JSON responses and validate structure
    - Handle AI errors and fallback to partial extraction
    - _Requirements: 2.5.2_

  - [x] 5.5 Implement parsed data storage and review endpoints

    - Store parsed data temporarily in database with status 'pending_review'
    - Implement GET /api/upload/parsed/:id endpoint to retrieve extracted data
    - Return extracted data in editable JSON format
    - Implement POST /api/upload/confirm/:id endpoint to save to profile
    - Bulk insert confirmed data into user's profile tables
    - Clean up temporary files and parsed data after confirmation
    - _Requirements: 2.5.3, 2.5.5_

- [x] 6. Build job description analysis system





  - [x] 6.1 Create job analysis service and controller


    - Create JobAnalysisService class
    - Create JobController class
    - Set up job routes file
    - Register job routes in main index.ts
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

  - [x] 6.2 Implement job description submission and AI analysis


    - Implement POST /api/jobs/analyze endpoint
    - Accept job description text, company name, and position
    - Design AI prompts to extract requirements, skills, qualifications, and keywords
    - Use Ollama to analyze job description and extract structured data
    - Identify experience level (entry, mid, senior) from description
    - Store raw text and analyzed data in JobDescription table
    - Return analysis results with job ID
    - _Requirements: 3.1, 3.2, 3.5_


  - [x] 6.3 Implement profile matching algorithm

    - Create matchProfileToJob method in JobAnalysisService
    - Fetch user's complete profile (experience, education, skills, projects)
    - Calculate skill match percentage (matching skills vs required skills)
    - Calculate experience relevance score based on job history alignment
    - Identify matching skills and missing skills
    - Calculate education match score
    - Return comprehensive match result with scores and recommendations
    - _Requirements: 3.3, 3.4_

  - [x] 6.4 Create job description management endpoints


    - Implement GET /api/jobs/:id endpoint with ownership check
    - Return job description with analysis and match results
    - Implement GET /api/jobs endpoint (list user's saved jobs)
    - Add pagination and sorting options
    - Implement DELETE /api/jobs/:id endpoint with ownership check
    - _Requirements: 3.5_

- [x] 7. Implement LaTeX template system




  - [x] 7.1 Create template service and seed data


    - Create TemplateService class
    - Create TemplateController class
    - Set up template routes file
    - Register template routes in main index.ts
    - Design 3+ professional LaTeX templates (modern, classic, technical)
    - Create seed script to populate Template table with templates
    - Store template preview images in public/templates directory
    - _Requirements: 4.1_

  - [x] 7.2 Implement template listing endpoint


    - Implement GET /api/templates endpoint
    - Return all active templates with metadata (name, description, category)
    - Include preview image URLs
    - Add filtering by category
    - _Requirements: 4.2_

  - [x] 7.3 Create template retrieval endpoints


    - Implement GET /api/templates/:id endpoint
    - Return complete template details including LaTeX content
    - Implement GET /api/templates/:id/preview endpoint
    - Serve preview image file
    - _Requirements: 4.3_

  - [x] 7.4 Implement template variable substitution engine


    - Create renderTemplate method in TemplateService
    - Support variable placeholders: {{name}}, {{email}}, {{phone}}, etc.
    - Handle array iteration for experience, education, skills, projects
    - Support conditional sections (show/hide based on data presence)
    - Escape special LaTeX characters in user data
    - Return rendered LaTeX content ready for compilation
    - _Requirements: 4.4, 4.5_

- [x] 8. Build resume generation pipeline




  - [x] 8.1 Set up Bull queue infrastructure for async processing


    - Configure Bull with Redis connection
    - Create resume generation queue with appropriate settings
    - Implement queue processor for resume generation jobs
    - Add error handling, retry logic (max 3 attempts), and timeout handling
    - Create queue monitoring utilities
    - _Requirements: 5.3, 5.4_



  - [x] 8.2 Create resume generation service and controller





    - Create ResumeGenerationService class
    - Create ResumeController class
    - Set up resume routes file
    - Register resume routes in main index.ts


    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

  - [x] 8.3 Implement content selection algorithm





    - Create selectRelevantContent method
    - Fetch user profile and job analysis data
    - Score each work experience based on relevance to job requirements
    - Select top N experiences that fit resume length constraints
    - Prioritize skills that match job requirements


    - Select most relevant projects
    - Include all education entries
    - _Requirements: 5.1, 5.2_

  - [x] 8.4 Implement AI-powered content optimization





    - Design prompts for optimizing resume content for ATS
    - Create optimizeBulletPoints method using Ollama


    - Incorporate job description keywords naturally into descriptions
    - Generate tailored professional summary based on job and profile
    - Optimize skill descriptions and project highlights
    - Ensure optimized content maintains authenticity
    - _Requirements: 5.2, 5.3_

  - [x] 8.5 Create ATS score calculation engine





    - Create calculateATSScore method


    - Implement keyword matching algorithm (job keywords vs resume content)
    - Calculate experience relevance score (years, role alignment)
    - Assess format parseability (structure, sections, clarity)
    - Calculate education match score (degree requirements)
    - Generate overall ATS score (0-100) with weighted breakdown
    - Identify missing keywords and provide suggestions
    - _Requirements: 5.5_


  - [x] 8.6 Implement LaTeX compilation service





    - Create LaTeXCompilerService class
    - Set up Docker container configuration for pdflatex
    - Implement compileLatex method with Docker execution
    - Sanitize LaTeX content to prevent injection attacks
    - Handle compilation errors and provide user-friendly messages
    - Set compilation timeout (30 seconds max)
    - Store generated PDF in file storage
    - _Requirements: 5.4_

  - [x] 8.7 Create resume generation API endpoints
    - Implement POST /api/resume/generate endpoint
    - Accept jobDescriptionId and templateId
    - Queue resume generation job and return job ID
    - Implement GET /api/resume/status/:jobId endpoint for polling
    - Return job status (pending, processing, completed, failed)
    - Store generated resume metadata in Resume table
    - Link resume to user, job description, and template
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [x] 9. Implement resume management features
  - [x] 9.1 Create resume download endpoint
    - Implement GET /api/resume/:id/download endpoint with ownership check
    - Stream PDF file from storage to client
    - Set Content-Type and Content-Disposition headers
    - Generate descriptive filename: {company}_{position}_{date}.pdf
    - Handle file not found errors
    - _Requirements: 6.1, 6.4_

  - [x] 9.2 Create resume history endpoints
    - Implement GET /api/resume endpoint (list user's resumes)
    - Include pagination and sorting (by date, ATS score)
    - Return resume metadata with job info and ATS score
    - Implement GET /api/resume/:id endpoint with ownership check
    - Return complete resume details including generated content
    - Include associated job description and template info
    - _Requirements: 7.1, 7.2, 7.4, 6.5_

  - [x] 9.3 Implement resume regeneration
    - Implement POST /api/resume/:id/regenerate endpoint with ownership check
    - Fetch original job description and template
    - Fetch updated user profile data
    - Queue new resume generation job with same parameters
    - Return new job ID for status polling
    - _Requirements: 7.5_

  - [x] 9.4 Add resume deletion
    - Implement DELETE /api/resume/:id endpoint with ownership check
    - Delete PDF file from file storage
    - Delete resume record from database (cascade deletes interview questions)
    - Handle file deletion errors gracefully
    - _Requirements: 7.3_

- [x] 10. Build interview preparation module





  - [x] 10.1 Create interview preparation service and controller


    - Create InterviewPrepService class
    - Create InterviewController class
    - Set up interview routes file
    - Register interview routes in main index.ts
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

  - [x] 10.2 Implement AI-powered interview question generation

    - Design prompts for generating interview questions based on resume and job
    - Create generateQuestions method using Ollama
    - Analyze resume content and job description to identify question topics
    - Generate questions across categories: technical, behavioral, experience-based, role-specific
    - Reference specific resume claims in questions (e.g., "Tell me about your experience with X")
    - Assign difficulty levels to questions
    - Store generated questions in InterviewQuestion table
    - _Requirements: 8.1, 8.2, 8.3_

  - [x] 10.3 Implement answer framework generation

    - Create generateAnswerFramework method using Ollama
    - Generate STAR method structure for behavioral questions
    - Create talking points based on user's actual profile data
    - Provide context-specific guidance for technical questions
    - Include relevant examples from user's experience
    - _Requirements: 8.4_

  - [x] 10.4 Implement interview questions API endpoint

    - Implement GET /api/interview/questions/:resumeId endpoint with ownership check
    - Check if questions already exist for resume, generate if not
    - Return questions categorized by type
    - Include answer frameworks and talking points
    - Support filtering by category and difficulty
    - _Requirements: 8.5_

- [x] 11. Implement community interview platform





  - [x] 11.1 Create community service for interview experiences


    - Create CommunityService class
    - Add community endpoints to InterviewController
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 10.1, 10.2, 10.3, 10.4, 10.5_

  - [x] 11.2 Implement interview experience submission

    - Implement POST /api/interview/experience endpoint
    - Accept interview experience data: company, role, date, outcome, difficulty
    - Accept array of interview rounds with details
    - Validate input data (required fields, valid enums)
    - Store experience in InterviewExperience table
    - Store rounds in InterviewRound table
    - _Requirements: 9.1, 9.2, 9.3, 9.4_

  - [x] 11.3 Implement data anonymization

    - Create anonymizeExperience method
    - Remove or hash personally identifiable information
    - Set isAnonymous flag to true
    - Ensure user IDs are not exposed in public queries
    - Sanitize free-text fields (notes, tips) to remove PII
    - _Requirements: 9.5_

  - [x] 11.4 Create company insights aggregation logic

    - Create aggregateCompanyInsights method
    - Query all experiences for company and role
    - Calculate average number of rounds
    - Identify most common round types and their frequency
    - Calculate average process duration
    - Aggregate common questions by category
    - Calculate topic frequency across experiences
    - Compute difficulty distribution (easy/medium/hard percentages)
    - Collect and deduplicate success tips
    - _Requirements: 10.2, 10.3, 10.4_

  - [x] 11.5 Implement company insights API endpoints

    - Implement GET /api/interview/insights endpoint (search/list companies)
    - Return list of companies with available data
    - Implement GET /api/interview/insights/:company/:role endpoint
    - Return aggregated insights for specific company and role
    - Include submission count and last updated date
    - Handle cases with no data gracefully
    - _Requirements: 10.1, 10.5_

- [x] 12. Build frontend authentication pages





  - [x] 12.1 Set up frontend routing and API client


    - Install and configure React Router
    - Create API client utility with axios
    - Configure base URL and interceptors
    - Set up token management in localStorage
    - _Requirements: 1.1, 1.2, 1.4, 1.5_

  - [x] 12.2 Create authentication context and hooks


    - Create AuthContext with user state and auth methods
    - Create AuthProvider component
    - Implement useAuth hook for accessing auth state
    - Store user data and tokens in context
    - Implement login, logout, and register functions
    - Implement token refresh logic with interceptors
    - _Requirements: 1.2, 1.4, 1.5_

  - [x] 12.3 Create login page


    - Build LoginPage component with form
    - Add email and password input fields
    - Implement client-side validation
    - Handle login API call using auth context
    - Store tokens in localStorage
    - Display error messages for invalid credentials
    - Redirect to dashboard on success
    - _Requirements: 1.2_

  - [x] 12.4 Create registration page


    - Build RegisterPage component with form
    - Add fields: email, password, firstName, lastName
    - Implement client-side validation (email format, password strength)
    - Handle registration API call using auth context
    - Display validation errors
    - Redirect to dashboard or login after success
    - _Requirements: 1.1_

  - [x] 12.5 Create protected route wrapper


    - Create ProtectedRoute component
    - Check authentication status before rendering
    - Redirect unauthenticated users to login page
    - Handle token expiration with refresh
    - Show loading state during auth check
    - _Requirements: 1.2, 1.4_

- [x] 13. Build profile management UI




  - [x] 13.1 Create profile dashboard page


    - Build ProfileDashboard component
    - Display user profile overview with summary cards
    - Show count of work experiences, education, skills, projects
    - Add navigation buttons to manage each section
    - Fetch profile data from GET /api/profile endpoint
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

  - [x] 13.2 Build work experience management


    - Create WorkExperienceList component to display all experiences
    - Create WorkExperienceForm component for add/edit
    - Add fields: company, position, startDate, endDate, description, achievements, technologies
    - Implement date pickers with validation (startDate before endDate)
    - Support dynamic array fields for achievements and technologies
    - Handle create, update, and delete API calls
    - Show success/error notifications
    - _Requirements: 2.1, 2.5_

  - [x] 13.3 Build education management


    - Create EducationList component to display all education entries
    - Create EducationForm component for add/edit
    - Add fields: institution, degree, fieldOfStudy, startDate, endDate, gpa, achievements
    - Implement date validation
    - Support dynamic array field for achievements
    - Handle create, update, and delete API calls
    - _Requirements: 2.2, 2.5_

  - [x] 13.4 Build skills manager


    - Create SkillsManager component
    - Display skills grouped by category
    - Create SkillForm for adding/editing skills
    - Add fields: name, category, proficiency, yearsOfExperience
    - Implement category selection (technical, soft, language)
    - Implement proficiency level selection (beginner, intermediate, advanced, expert)
    - Add drag-and-drop for reordering skills
    - Handle create, update, and delete API calls
    - _Requirements: 2.3, 2.5_

  - [x] 13.5 Build projects management


    - Create ProjectsList component to display all projects
    - Create ProjectForm component for add/edit
    - Add fields: title, description, technologies, url, githubUrl, startDate, endDate, highlights
    - Support dynamic array fields for technologies and highlights
    - Implement date pickers
    - Handle create, update, and delete API calls
    - _Requirements: 2.4, 2.5_

  - [x] 13.6 Create resume uploader component


    - Build ResumeUploader component with drag-and-drop zone
    - Accept PDF and DOCX files only
    - Show file size and type validation errors
    - Display upload progress bar
    - Call POST /api/upload/resume endpoint
    - Navigate to parsed data review on success
    - _Requirements: 2.5.1_

  - [x] 13.7 Build parsed data review interface


    - Create ParsedDataReview component
    - Fetch parsed data from GET /api/upload/parsed/:id endpoint
    - Display extracted data in editable form sections
    - Allow users to edit, add, or remove extracted items
    - Provide "Confirm and Save" button to call POST /api/upload/confirm/:id
    - Provide "Cancel" button to discard parsed data
    - Redirect to profile dashboard after confirmation
    - _Requirements: 2.5.3, 2.5.4, 2.5.5_

- [x] 14. Build resume generation UI





  - [x] 14.1 Create resume generation wizard page


    - Build ResumeGeneratorPage component with multi-step wizard
    - Implement step navigation (job input → analysis → template → generate → result)
    - Track current step and completed steps
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 4.2, 4.3, 5.1, 5.2, 5.3, 5.4, 5.5_

  - [x] 14.2 Build job description input step


    - Create JobDescriptionInput component
    - Add large text area for job description
    - Add input fields for company name and position
    - Add paste and clear buttons
    - Show character count
    - Validate required fields before proceeding
    - Call POST /api/jobs/analyze endpoint
    - _Requirements: 3.1_

  - [x] 14.3 Build job analysis view step


    - Create JobAnalysisView component
    - Display extracted requirements and skills from analysis
    - Show profile matching score with visual indicator
    - Highlight matching skills in green
    - Highlight missing skills in red
    - Display experience relevance score
    - Show recommendations for improvement
    - _Requirements: 3.2, 3.3, 3.4_

  - [x] 14.4 Create template selector step


    - Create TemplateSelector component
    - Fetch templates from GET /api/templates endpoint
    - Display template gallery with preview images
    - Implement template card selection
    - Show template details (name, description, category)
    - Highlight selected template
    - _Requirements: 4.2, 4.3_

  - [x] 14.5 Build resume generation step


    - Create ResumeGenerator component
    - Display summary of selections (job, template)
    - Add "Generate Resume" button
    - Call POST /api/resume/generate endpoint
    - Show loading spinner during generation
    - Poll GET /api/resume/status/:jobId endpoint for status
    - Handle generation errors with retry option
    - Navigate to result step on completion
    - _Requirements: 5.1, 5.2, 5.3, 5.4_

  - [x] 14.6 Create ATS score display component


    - Create ATSScoreDisplay component
    - Show overall ATS score with circular progress indicator
    - Display color-coded score (red < 60, yellow 60-80, green > 80)
    - Show score breakdown by category (keywords, experience, format, education)
    - List missing keywords with suggestions
    - Display improvement recommendations
    - _Requirements: 5.5_

  - [x] 14.7 Build resume result and download step


    - Create ResumeResult component
    - Display ATS score using ATSScoreDisplay component
    - Show resume metadata (job, template, date)
    - Embed PDF preview using iframe or PDF viewer library
    - Add "Download Resume" button calling GET /api/resume/:id/download
    - Add "Generate Another" button to restart wizard
    - Add "View Interview Questions" button
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 5.5_

- [x] 15. Build resume history UI





  - [x] 15.1 Create resume history page


    - Build ResumeHistoryPage component
    - Fetch resumes from GET /api/resume endpoint
    - Display list of resume cards with metadata
    - Show job title, company, generation date, ATS score on each card
    - Implement sorting options (by date, by ATS score)
    - Implement pagination for large lists
    - Add "Generate New Resume" button
    - _Requirements: 7.1, 7.2_

  - [x] 15.2 Build resume detail modal or page


    - Create ResumeDetailView component
    - Fetch resume details from GET /api/resume/:id endpoint
    - Display complete resume information and metadata
    - Show associated job description
    - Display ATS score with breakdown
    - Embed PDF preview
    - Add "Download" button
    - Add "Regenerate" button calling POST /api/resume/:id/regenerate
    - Add "Delete" button with confirmation dialog
    - Add "View Interview Questions" button
    - _Requirements: 7.3, 7.4, 7.5_

- [x] 16. Build interview preparation UI





  - [x] 16.1 Create interview questions page


    - Build InterviewQuestionsPage component
    - Accept resumeId as route parameter
    - Fetch questions from GET /api/interview/questions/:resumeId endpoint
    - Display loading state while generating questions
    - Show resume and job information at top
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

  - [x] 16.2 Build categorized questions display


    - Create QuestionCategory component
    - Group questions by category (technical, behavioral, experience, role-specific)
    - Display category headers with question count
    - Show difficulty badge for each question (easy, medium, hard)
    - Implement expand/collapse for each question
    - _Requirements: 8.1, 8.2, 8.3_

  - [x] 16.3 Build answer framework display


    - Create AnswerFramework component
    - Display suggested answer structure (STAR method for behavioral)
    - Show talking points as bullet list
    - Display related content from resume
    - Add "Copy to Clipboard" button for answer framework
    - Add "Copy Question" button
    - _Requirements: 8.4, 8.5_

- [x] 17. Build community platform UI





  - [x] 17.1 Create interview experience submission page


    - Build InterviewExperienceForm component
    - Create multi-step form wizard (basic info → rounds → tips)
    - Add fields: company, role, interviewDate, outcome, overallDifficulty
    - Support adding multiple interview rounds dynamically
    - For each round: roundType, duration, difficulty, topics, questions, notes
    - Add field for preparation tips (array)
    - Implement form validation
    - Call POST /api/interview/experience endpoint
    - Show success message and redirect to insights
    - _Requirements: 9.1, 9.2, 9.3, 9.4_

  - [x] 17.2 Build company search interface


    - Create CompanySearchPage component
    - Add search inputs for company name and role
    - Implement search button
    - Fetch available companies from GET /api/interview/insights endpoint
    - Display search results as clickable cards
    - Navigate to insights view on selection
    - _Requirements: 10.1_

  - [x] 17.3 Create interview insights view page


    - Build InterviewInsightsPage component
    - Accept company and role as route parameters
    - Fetch insights from GET /api/interview/insights/:company/:role endpoint
    - Display company and role header
    - Show submission count and last updated date
    - _Requirements: 10.1, 10.5_

  - [x] 17.4 Build process structure visualization


    - Create ProcessTimeline component
    - Display average number of rounds
    - Show common round types with frequency bars
    - Display average process duration
    - Use visual timeline or flowchart
    - _Requirements: 10.2_

  - [x] 17.5 Build common questions display


    - Create CommonQuestions component
    - Group questions by category
    - Show question frequency (how many times mentioned)
    - Display questions in order of frequency
    - _Requirements: 10.3_

  - [x] 17.6 Build difficulty and tips display


    - Create DifficultyDistribution component
    - Show difficulty distribution as pie chart or bar chart
    - Display aggregated success tips as bullet list
    - Show topic frequency as tag cloud or list
    - _Requirements: 10.4_

- [x] 18. Add navigation and layout




  - [x] 18.1 Create main layout component


    - Build MainLayout component with header, sidebar, and content area
    - Create navigation menu with links to all pages
    - Add user profile dropdown in header
    - Implement responsive design for mobile
    - _Requirements: All UI requirements benefit from consistent layout_

  - [x] 18.2 Set up routing structure


    - Configure React Router with all application routes
    - Set up route paths for all pages (dashboard, profile, resume generator, history, interview prep, community)
    - Apply ProtectedRoute wrapper to authenticated routes
    - Create 404 Not Found page
    - _Requirements: All UI requirements depend on routing_

- [x] 19. Implement error handling and validation





  - [x] 19.1 Add backend error handling


    - Create global error handler middleware
    - Implement consistent error response format
    - Add error logging with context
    - Handle database errors gracefully
    - _Requirements: All requirements benefit from proper error handling_

  - [x] 19.2 Add frontend error handling


    - Create error boundary component for React
    - Implement toast notifications for errors
    - Add form validation error displays
    - Handle API errors with user-friendly messages
    - _Requirements: All requirements benefit from proper error handling_

- [x] 20. Add security measures





  - [x] 20.1 Implement rate limiting


    - Install and configure express-rate-limit
    - Add rate limiting to authentication endpoints (stricter)
    - Add rate limiting to expensive operations (resume generation, AI calls)
    - Add general rate limiting to all API endpoints
    - _Requirements: 1.1, 1.2, 5.4_

  - [x] 20.2 Add security headers and validation


    - Install and configure helmet for security headers
    - Configure CORS with specific origin
    - Implement request body size limits
    - Add file upload security checks (magic number validation)
    - Implement LaTeX input sanitization
    - _Requirements: 2.5.1, 5.4_
