# Resume Upload - Quick Start Guide

## Prerequisites

1. **Backend server running**
   ```bash
   cd packages/backend
   npm run dev
   ```

2. **Ollama running with Gemma 2B**
   ```bash
   ollama run gemma2:2b
   ```

3. **Database migrated**
   ```bash
   npm run prisma:migrate
   ```

## API Endpoints

### 1. Upload Resume
```bash
POST http://localhost:3000/api/upload/resume
Authorization: Bearer <token>
Content-Type: multipart/form-data

Body:
- resume: <file.pdf or file.docx>
```

### 2. Get Parsed Data
```bash
GET http://localhost:3000/api/upload/parsed/:id
Authorization: Bearer <token>
```

### 3. Confirm Data
```bash
POST http://localhost:3000/api/upload/confirm/:id
Authorization: Bearer <token>
Content-Type: application/json

Body: {
  "workExperiences": [...],
  "educations": [...],
  "skills": [...],
  "projects": [...]
}
```

### 4. Reject Data
```bash
DELETE http://localhost:3000/api/upload/parsed/:id
Authorization: Bearer <token>
```

## Testing

### Get Access Token
```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!@#",
    "firstName": "Test",
    "lastName": "User"
  }'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!@#"
  }'
```

### Run Test Script
```bash
node test-upload-endpoints.js <your_access_token>
```

## File Requirements

- **Formats**: PDF or DOCX only
- **Size**: Maximum 10MB
- **Content**: Must contain readable text (not image-based)

## Expected Response Flow

1. **Upload** → Returns `parseId` and extracted data
2. **Review** → User reviews/edits the data
3. **Confirm** → Data saved to profile
4. **Verify** → Check profile endpoint for saved data

## Common Issues

### "Invalid file type"
- Ensure file is PDF or DOCX
- Check file extension matches content

### "Failed to parse resume"
- File may be corrupted
- PDF may be image-based (no text layer)
- File may be password-protected

### "AI returned invalid JSON"
- Ollama may not be running
- Model may not be available
- Try again or check Ollama logs

### "Parsed resume not found"
- Parse ID may be incorrect
- Data may have been confirmed/rejected already
- Session may have expired

## Data Structure

The parsed data follows this structure:

```typescript
{
  workExperiences: [{
    company: string,
    position: string,
    startDate: string,
    endDate: string | null,
    description: string,
    achievements: string[],
    technologies: string[]
  }],
  educations: [{
    institution: string,
    degree: string,
    fieldOfStudy: string,
    startDate: string,
    endDate: string | null,
    gpa: number | null,
    achievements: string[]
  }],
  skills: [{
    name: string,
    category: "technical" | "soft" | "language",
    proficiency: "beginner" | "intermediate" | "advanced" | "expert",
    yearsOfExperience: number | null
  }],
  projects: [{
    title: string,
    description: string,
    technologies: string[],
    url: string | null,
    githubUrl: string | null,
    startDate: string | null,
    endDate: string | null,
    highlights: string[]
  }]
}
```

## Next Steps

After implementing resume upload:
1. Build frontend upload component
2. Create parsed data review UI
3. Integrate with profile management
4. Add progress indicators
5. Implement error handling UI

## Support

For detailed documentation, see:
- `src/controllers/UPLOAD_README.md` - Complete API documentation
- `TASK_5_IMPLEMENTATION_SUMMARY.md` - Implementation details
- `test-upload-endpoints.js` - Test examples
