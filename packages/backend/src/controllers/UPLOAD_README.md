# Resume Upload and Parsing API

This module handles resume file uploads, text extraction, and AI-powered data parsing.

## Features

- **File Upload**: Accepts PDF and DOCX resume files (max 10MB)
- **Text Extraction**: Extracts text from PDF and DOCX files
- **AI Parsing**: Uses Ollama (Gemma 2B) to extract structured data
- **Review & Edit**: Users can review and edit extracted data before saving
- **Bulk Import**: Saves all confirmed data to user profile in one transaction

## API Endpoints

### 1. Upload Resume

**POST** `/api/upload/resume`

Upload a resume file for parsing.

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

**Body:**
- `resume`: File (PDF or DOCX, max 10MB)

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "parsed_1234567890_abc123",
    "parsedData": {
      "workExperiences": [...],
      "educations": [...],
      "skills": [...],
      "projects": [...]
    },
    "message": "Resume parsed successfully. Please review and confirm the extracted data."
  }
}
```

**Error Codes:**
- `AUTH_UNAUTHORIZED`: User not authenticated
- `VALIDATION_FAILED`: No file uploaded
- `INVALID_FILE_TYPE`: File type not supported (only PDF/DOCX allowed)
- `FILE_TOO_LARGE`: File exceeds 10MB limit
- `RESUME_PARSE_FAILED`: Failed to parse resume

---

### 2. Get Parsed Data

**GET** `/api/upload/parsed/:id`

Retrieve parsed resume data for review.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "parsed_1234567890_abc123",
    "fileName": "resume.pdf",
    "parsedData": {
      "workExperiences": [
        {
          "company": "Tech Corp",
          "position": "Senior Software Engineer",
          "startDate": "2020-01",
          "endDate": null,
          "description": "Led development of microservices",
          "achievements": ["Improved API response time by 40%"],
          "technologies": ["Node.js", "Docker"]
        }
      ],
      "educations": [...],
      "skills": [...],
      "projects": [...]
    },
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Codes:**
- `AUTH_UNAUTHORIZED`: User not authenticated
- `RESOURCE_NOT_FOUND`: Parsed resume not found or access denied

---

### 3. Confirm Parsed Data

**POST** `/api/upload/confirm/:id`

Confirm and save parsed data to user profile. Users can edit the data before confirming.

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Body:**
```json
{
  "workExperiences": [...],
  "educations": [...],
  "skills": [...],
  "projects": [...]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Resume data saved to your profile successfully"
  }
}
```

**Error Codes:**
- `AUTH_UNAUTHORIZED`: User not authenticated
- `VALIDATION_FAILED`: Invalid data format
- `INTERNAL_ERROR`: Failed to save data

---

### 4. Reject Parsed Data

**DELETE** `/api/upload/parsed/:id`

Discard parsed data without saving.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Parsed data discarded successfully"
  }
}
```

---

## Data Structures

### Work Experience
```typescript
{
  company: string;
  position: string;
  startDate: string; // YYYY-MM-DD or YYYY-MM
  endDate: string | null; // null for current position
  description: string;
  achievements: string[];
  technologies: string[];
}
```

### Education
```typescript
{
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string | null;
  gpa: number | null;
  achievements: string[];
}
```

### Skill
```typescript
{
  name: string;
  category: "technical" | "soft" | "language";
  proficiency: "beginner" | "intermediate" | "advanced" | "expert";
  yearsOfExperience: number | null;
}
```

### Project
```typescript
{
  title: string;
  description: string;
  technologies: string[];
  url: string | null;
  githubUrl: string | null;
  startDate: string | null;
  endDate: string | null;
  highlights: string[];
}
```

---

## Implementation Details

### File Validation

The upload middleware validates:
1. **File Type**: Only PDF and DOCX files are accepted
2. **File Size**: Maximum 10MB
3. **MIME Type**: Checks both MIME type and file extension

### Text Extraction

- **PDF**: Uses `pdf-parse` library to extract text
- **DOCX**: Uses `mammoth` library to extract raw text
- **Cleaning**: Normalizes line endings, removes excessive whitespace

### AI Parsing

The system uses Ollama with Gemma 2B model to:
1. Analyze extracted text
2. Identify sections (work experience, education, skills, projects)
3. Extract structured data with proper formatting
4. Categorize skills and estimate proficiency levels

**Prompt Engineering:**
- Clear instructions for JSON structure
- Examples of expected output format
- Handling of missing or ambiguous data
- Fallback to empty arrays on AI failure

### Temporary Storage

Parsed data is stored temporarily in memory (global cache) until:
- User confirms and saves to profile
- User rejects and discards the data
- Session expires (implementation-dependent)

**Production Consideration:** In production, use Redis or a dedicated database table for temporary storage instead of in-memory cache.

### Transaction Safety

When confirming parsed data, all inserts are wrapped in a database transaction to ensure:
- All data is saved successfully, or none is saved
- Data consistency across tables
- Proper error handling and rollback

---

## Error Handling

### Graceful Degradation

If AI parsing fails:
1. Returns empty data structures
2. Logs error for debugging
3. Allows user to manually enter data

### File Cleanup

Uploaded files are automatically deleted:
- After successful parsing
- On parsing errors
- To prevent disk space issues

### User-Friendly Messages

All errors return clear, actionable messages:
- "File type not supported" instead of "Invalid MIME type"
- "File too large" with size limit information
- "Failed to parse PDF" with suggestions

---

## Testing

Use the test script to verify functionality:

```bash
# 1. Start the backend server
npm run dev

# 2. Register and login to get a token
# Use test-auth-endpoints.js or Postman

# 3. Run upload tests
node test-upload-endpoints.js <your_access_token>
```

---

## Security Considerations

1. **Authentication Required**: All endpoints require valid JWT token
2. **File Type Validation**: Strict validation of file types and extensions
3. **File Size Limits**: Prevents DoS attacks via large files
4. **User Isolation**: Users can only access their own parsed data
5. **Input Sanitization**: All extracted data is validated and cleaned

---

## Future Enhancements

1. **Image-based PDFs**: Add OCR support for scanned resumes
2. **Multiple File Formats**: Support for RTF, TXT, HTML resumes
3. **Batch Upload**: Upload multiple resumes at once
4. **Resume Templates**: Detect and handle specific resume templates
5. **Confidence Scores**: Show AI confidence for each extracted field
6. **Manual Corrections**: Learn from user corrections to improve parsing
7. **Resume Comparison**: Compare multiple versions of a resume
8. **Export Options**: Export parsed data in various formats

---

## Dependencies

- `multer`: File upload handling
- `pdf-parse`: PDF text extraction
- `mammoth`: DOCX text extraction
- `axios`: HTTP client for Ollama API
- `@prisma/client`: Database ORM

---

## Environment Variables

```env
# Ollama Configuration
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=gemma2:2b

# File Upload
MAX_FILE_SIZE=10485760  # 10MB in bytes
UPLOAD_DIR=./uploads/resumes
```
