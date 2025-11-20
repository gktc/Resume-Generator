# Error Handling Guide

## Overview

This application implements a comprehensive error handling system with custom error classes, global error middleware, and structured logging.

## Backend Error Handling

### Custom Error Classes

Located in `src/utils/errors.ts`, we have custom error classes for different scenarios:

#### Base Error Class
```typescript
class AppError extends Error {
  statusCode: number;
  code: string;
  isOperational: boolean;
  details?: any;
}
```

#### Available Error Classes

**Validation Errors (400)**
- `ValidationError` - General validation failures
- `InvalidFileTypeError` - Invalid file type uploaded
- `FileTooLargeError` - File exceeds size limit
- `InvalidDateRangeError` - Invalid date range

**Authentication Errors (401)**
- `AuthenticationError` - General auth errors
- `InvalidCredentialsError` - Wrong email/password
- `TokenExpiredError` - JWT token expired
- `InvalidTokenError` - Invalid JWT token

**Authorization Errors (403)**
- `ForbiddenError` - Access forbidden

**Not Found Errors (404)**
- `NotFoundError` - Generic resource not found
- `UserNotFoundError` - User not found
- `ResumeNotFoundError` - Resume not found

**Conflict Errors (409)**
- `ConflictError` - General conflicts
- `UserExistsError` - User already exists

**Rate Limit Errors (429)**
- `RateLimitError` - Too many requests

**Server Errors (500)**
- `InternalError` - General server errors
- `DatabaseError` - Database operation failed
- `ResumeParseError` - Resume parsing failed
- `LaTeXCompilationError` - LaTeX compilation failed
- `AIServiceError` - AI service error
- `QueueError` - Queue operation failed

### Using Custom Errors

In services, throw appropriate errors:

```typescript
import { UserNotFoundError, ValidationError } from '../utils/errors';

// Throw specific errors
if (!user) {
  throw new UserNotFoundError();
}

if (!email) {
  throw new ValidationError('Email is required');
}
```

### Global Error Handler

The global error handler in `src/middleware/error.middleware.ts` catches all errors and formats them consistently:

```typescript
{
  success: false,
  error: {
    code: 'ERROR_CODE',
    message: 'User-friendly message',
    details?: { /* additional info */ },
    stack?: 'stack trace (dev only)'
  }
}
```

### Async Handler Wrapper

Use `asyncHandler` to automatically catch errors in async route handlers:

```typescript
import { asyncHandler } from '../middleware/error.middleware';

router.get('/users/:id', asyncHandler(async (req, res) => {
  const user = await userService.getUser(req.params.id);
  res.json({ success: true, data: user });
}));
```

### Controller Pattern

Controllers should use asyncHandler and throw errors:

```typescript
export class UserController {
  getUser = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    
    // Validation
    if (!id) {
      throw new ValidationError('User ID is required');
    }
    
    // Service call (will throw if not found)
    const user = await userService.getUser(id);
    
    res.json({ success: true, data: user });
  });
}
```

### Logging

Use the logger utility for consistent logging:

```typescript
import { logger } from '../utils/logger';

// Info logs
logger.info('User registered', { userId: user.id });

// Error logs
logger.error('Database query failed', error, { query: 'SELECT ...' });

// Debug logs (dev only)
logger.debug('Processing request', { data });

// Specialized logs
logger.database('SELECT', 'users', 150);
logger.aiService('completion', 'gpt-4', 2000);
logger.queue('process', jobId, 'resume-generation');
```

## Validation Utilities

Enhanced validation utilities in `src/utils/validation.ts`:

```typescript
import { requireFields, requireValidEmail, validateDateRange } from '../utils/validation';

// Require fields (throws ValidationError if missing)
requireFields(req.body, ['email', 'password']);

// Validate email (throws ValidationError if invalid)
requireValidEmail(email);

// Validate date range (throws InvalidDateRangeError if invalid)
validateDateRange(startDate, endDate);

// Validate enum
validateEnum(value, ['option1', 'option2'], 'fieldName');

// Validate positive number
validatePositiveNumber(value, 'age');
```

## Error Response Format

All API errors follow this format:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "Missing required fields",
    "details": {
      "missingFields": ["email", "password"]
    }
  }
}
```

## Database Error Handling

Prisma errors are automatically handled:

- `P2002` (Unique constraint) → 409 Conflict
- `P2025` (Record not found) → 404 Not Found
- `P2003` (Foreign key violation) → 400 Validation Failed

## Best Practices

1. **Always use custom error classes** instead of throwing generic Error objects
2. **Use asyncHandler** for all async route handlers
3. **Log errors with context** using the logger utility
4. **Validate input early** and throw ValidationError
5. **Don't expose sensitive information** in error messages
6. **Use appropriate HTTP status codes**
7. **Include helpful error codes** for client-side handling

## Example: Complete Controller

```typescript
import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/error.middleware';
import { requireFields, validateDateRange } from '../utils/validation';
import { NotFoundError } from '../utils/errors';
import { logger } from '../utils/logger';
import { experienceService } from '../services/experience.service';

export class ExperienceController {
  create = asyncHandler(async (req: Request, res: Response) => {
    const { company, position, startDate, endDate } = req.body;
    const userId = req.user!.userId;

    // Validate required fields
    requireFields(req.body, ['company', 'position', 'startDate']);

    // Validate date range
    validateDateRange(startDate, endDate);

    // Create experience
    const experience = await experienceService.create({
      userId,
      company,
      position,
      startDate,
      endDate,
    });

    logger.info('Experience created', { userId, experienceId: experience.id });

    res.status(201).json({
      success: true,
      data: experience,
    });
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user!.userId;

    const experience = await experienceService.getById(id, userId);

    if (!experience) {
      throw new NotFoundError('Experience', id);
    }

    res.json({
      success: true,
      data: experience,
    });
  });
}
```

## Testing Error Handling

Test that errors are properly thrown and handled:

```typescript
describe('ExperienceController', () => {
  it('should throw ValidationError for missing fields', async () => {
    const req = { body: {} };
    await expect(controller.create(req, res)).rejects.toThrow(ValidationError);
  });

  it('should throw NotFoundError for non-existent resource', async () => {
    const req = { params: { id: 'invalid' } };
    await expect(controller.getById(req, res)).rejects.toThrow(NotFoundError);
  });
});
```
