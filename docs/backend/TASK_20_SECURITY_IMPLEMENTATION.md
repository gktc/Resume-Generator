# Task 20: Security Measures Implementation

## Overview

Implemented comprehensive security measures for the ATS Resume Builder backend, including rate limiting, security headers, file upload validation, and LaTeX input sanitization.

## Completed Subtasks

### 20.1 Rate Limiting ✅

Implemented rate limiting using `express-rate-limit` to protect against abuse and DoS attacks.

**Rate Limiters Created:**

1. **General Rate Limiter** (Applied to all routes)
   - 100 requests per 15 minutes per IP
   - Protects overall API from abuse

2. **Auth Rate Limiter** (Applied to authentication endpoints)
   - 5 requests per 15 minutes per IP
   - Protects against brute force attacks on login/register
   - Applied to: `/api/auth/register`, `/api/auth/login`, `/api/auth/refresh`

3. **Expensive Operation Rate Limiter** (Applied to AI/generation endpoints)
   - 10 requests per hour per IP
   - Protects expensive operations like resume generation and interview questions
   - Applied to:
     - `/api/resume/generate`
     - `/api/resume/:id/regenerate`
     - `/api/interview/questions/:resumeId`

4. **Upload Rate Limiter** (Applied to file uploads)
   - 20 uploads per hour per IP
   - Prevents upload spam
   - Applied to: `/api/upload/resume`

5. **Analysis Rate Limiter** (Applied to job analysis)
   - 30 requests per hour per IP
   - Protects AI-powered job analysis
   - Applied to: `/api/jobs/analyze`

**Files Modified:**
- `packages/backend/src/middleware/rate-limit.middleware.ts` (created)
- `packages/backend/src/index.ts` (added general rate limiter)
- `packages/backend/src/routes/auth.routes.ts`
- `packages/backend/src/routes/upload.routes.ts`
- `packages/backend/src/routes/job.routes.ts`
- `packages/backend/src/routes/resume.routes.ts`
- `packages/backend/src/routes/interview.routes.ts`

### 20.2 Security Headers and Validation ✅

Implemented security headers using `helmet` and enhanced file upload validation with magic number checking.

**Security Headers (Helmet):**
- Content Security Policy (CSP) configured
- Cross-Origin Embedder Policy disabled for PDF embedding
- XSS Protection enabled
- HSTS enabled
- Frame options configured
- Other security headers automatically applied

**File Upload Security:**
1. **Magic Number Validation**
   - Installed `file-type` package for magic number detection
   - Validates actual file content, not just extension
   - Prevents users from bypassing extension checks by renaming files
   - Validates PDF and DOCX files based on file signatures
   - Automatically deletes invalid files

2. **Enhanced Upload Middleware**
   - Created `validateUploadedFile` middleware
   - Reads file buffer after upload
   - Validates using magic numbers
   - Cleans up invalid files immediately
   - Returns user-friendly error messages

**LaTeX Input Sanitization:**
1. **Character Escaping**
   - Escapes all special LaTeX characters: `\ & % $ # _ { } ~ ^`
   - Prevents LaTeX injection through user input
   - Applied to all user-provided content (name, email, descriptions, etc.)

2. **Dangerous Command Removal**
   - Removes potentially dangerous LaTeX commands:
     - File access: `\input`, `\include`, `\read`, `\write`
     - Command definition: `\def`, `\edef`, `\gdef`, `\xdef`, `\let`
     - Dynamic commands: `\csname`, `\expandafter`, `\catcode`
     - User commands: `\newcommand`, `\renewcommand`, `\providecommand`
   - Prevents code execution and file system access
   - Applied before LaTeX compilation

**Files Modified:**
- `packages/backend/src/index.ts` (added helmet)
- `packages/backend/src/middleware/upload.middleware.ts` (added magic number validation)
- `packages/backend/src/routes/upload.routes.ts` (added validation middleware)
- `packages/backend/src/services/latex-compiler.service.ts` (added sanitization methods)

## Security Benefits

### Protection Against Common Attacks

1. **Brute Force Attacks**
   - Strict rate limiting on authentication endpoints
   - Maximum 5 login attempts per 15 minutes

2. **Denial of Service (DoS)**
   - General rate limiting on all endpoints
   - Expensive operation limits prevent resource exhaustion
   - Request body size limits (10MB)

3. **File Upload Attacks**
   - Magic number validation prevents malicious file uploads
   - File type whitelist (PDF, DOCX only)
   - File size limits (10MB max)
   - Automatic cleanup of invalid files

4. **LaTeX Injection**
   - Special character escaping prevents command injection
   - Dangerous command removal prevents file access
   - Sandboxed Docker execution provides additional isolation

5. **XSS and Injection**
   - Helmet security headers prevent XSS
   - Content Security Policy restricts resource loading
   - Input validation and sanitization throughout

## Configuration

### Environment Variables

```env
# Rate Limiting (optional, uses defaults if not set)
RATE_LIMIT_WINDOW_MS=900000  # 15 minutes
RATE_LIMIT_MAX=100           # Max requests per window

# LaTeX Compilation
LATEX_TIMEOUT=30000          # 30 seconds
LATEX_CONTAINER_NAME=ats-latex

# CORS
CORS_ORIGIN=http://localhost:5173
```

### Rate Limit Headers

All rate-limited endpoints return standard rate limit headers:
- `RateLimit-Limit`: Maximum requests allowed
- `RateLimit-Remaining`: Requests remaining in current window
- `RateLimit-Reset`: Time when the rate limit resets

### Error Responses

Rate limit exceeded:
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Please try again later."
  }
}
```

Invalid file type:
```json
{
  "success": false,
  "error": {
    "code": "INVALID_FILE_TYPE",
    "message": "File type validation failed. The file may be corrupted or not a valid PDF/DOCX file."
  }
}
```

## Testing Recommendations

1. **Rate Limiting Tests**
   - Test each rate limiter by exceeding limits
   - Verify 429 status codes and error messages
   - Test rate limit reset after window expires

2. **File Upload Tests**
   - Upload valid PDF and DOCX files
   - Try uploading files with wrong extensions
   - Try uploading malicious files (e.g., .exe renamed to .pdf)
   - Verify magic number validation catches invalid files

3. **LaTeX Sanitization Tests**
   - Test with special characters in user input
   - Try injecting LaTeX commands in descriptions
   - Verify dangerous commands are removed
   - Test with edge cases (empty strings, very long strings)

4. **Security Headers Tests**
   - Verify helmet headers are present in responses
   - Test CSP with browser developer tools
   - Verify CORS configuration

## Dependencies Added

```json
{
  "dependencies": {
    "express-rate-limit": "^7.1.5",
    "helmet": "^7.1.0",
    "file-type": "^19.0.0"
  },
  "devDependencies": {
    "@types/express-rate-limit": "^6.0.0"
  }
}
```

## Requirements Satisfied

- ✅ **Requirement 1.1, 1.2**: Rate limiting on authentication endpoints
- ✅ **Requirement 2.5.1**: File upload security checks with magic number validation
- ✅ **Requirement 5.4**: LaTeX input sanitization and secure compilation

## Next Steps

1. Monitor rate limit metrics in production
2. Adjust rate limits based on actual usage patterns
3. Consider implementing user-specific rate limits (not just IP-based)
4. Add rate limit bypass for authenticated premium users
5. Implement logging for security events (rate limit hits, invalid uploads)
6. Consider adding CAPTCHA for repeated rate limit violations
7. Set up alerts for suspicious activity patterns

## Notes

- Rate limits are IP-based and reset after the time window
- File validation happens after upload but before processing
- LaTeX sanitization is applied automatically to all resume generations
- All security measures are transparent to legitimate users
- Error messages are user-friendly while hiding implementation details
