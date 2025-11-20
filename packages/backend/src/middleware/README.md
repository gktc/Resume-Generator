# Authentication Middleware

This directory contains middleware functions for handling authentication and authorization in the ATS Resume Builder API.

## Available Middleware

### `authenticate`

The primary authentication middleware that verifies JWT tokens and attaches user context to requests.

**Usage:**
```typescript
import { authenticate } from '../middleware/auth.middleware';

router.get('/protected', authenticate, (req, res) => {
  // req.user is now available with userId and email
  const userId = req.user.userId;
});
```

**Behavior:**
- Extracts JWT token from `Authorization: Bearer <token>` header
- Verifies token signature and expiration
- Attaches decoded user payload to `req.user`
- Returns 401 error if token is missing, invalid, or expired

**Error Codes:**
- `AUTH_TOKEN_MISSING`: No token provided in Authorization header
- `AUTH_TOKEN_EXPIRED`: Token has expired (includes expiration timestamp)
- `AUTH_TOKEN_INVALID`: Token signature is invalid or malformed
- `INTERNAL_ERROR`: Unexpected error during authentication

### `optionalAuthenticate`

Middleware that attaches user context if a valid token is present, but doesn't require authentication.

**Usage:**
```typescript
import { optionalAuthenticate } from '../middleware/auth.middleware';

router.get('/public-or-private', optionalAuthenticate, (req, res) => {
  if (req.user) {
    // User is authenticated
  } else {
    // User is not authenticated, but request continues
  }
});
```

**Behavior:**
- Attempts to verify token if present
- Sets `req.user` if token is valid
- Continues request even if token is missing or invalid
- Never returns an error response

### `requireAuth`

Middleware that checks if a user is authenticated (used after `authenticate` or `optionalAuthenticate`).

**Usage:**
```typescript
import { authenticate, requireAuth } from '../middleware/auth.middleware';

// Chain with authenticate
router.get('/profile', authenticate, requireAuth, (req, res) => {
  // Guaranteed req.user exists
});
```

**Behavior:**
- Checks if `req.user` is set
- Returns 401 error if user is not authenticated
- Useful for chaining after `optionalAuthenticate`

**Error Codes:**
- `AUTH_UNAUTHORIZED`: User is not authenticated

### `requireOwnership`

Middleware factory that validates a user owns a specific resource.

**Usage:**
```typescript
import { authenticate, requireOwnership } from '../middleware/auth.middleware';

// Default: checks 'userId' parameter
router.get('/profile/:userId', authenticate, requireOwnership(), (req, res) => {
  // User can only access their own profile
});

// Custom parameter name
router.delete('/resume/:resumeOwnerId', 
  authenticate, 
  requireOwnership('resumeOwnerId'), 
  (req, res) => {
    // User can only delete their own resumes
  }
);
```

**Parameters:**
- `userIdParam` (optional): Name of the parameter to check (default: 'userId')
  - Checks both `req.params` and `req.body` for the parameter

**Behavior:**
- Verifies user is authenticated
- Extracts resource owner ID from params or body
- Compares with authenticated user's ID
- Returns 403 error if IDs don't match

**Error Codes:**
- `AUTH_UNAUTHORIZED`: User is not authenticated
- `VALIDATION_FAILED`: Required parameter is missing
- `AUTH_FORBIDDEN`: User doesn't own the resource

## Token Expiration Handling

The middleware provides detailed error information for expired tokens:

```json
{
  "success": false,
  "error": {
    "code": "AUTH_TOKEN_EXPIRED",
    "message": "Token has expired. Please refresh your token.",
    "details": {
      "expiredAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

Clients should:
1. Detect `AUTH_TOKEN_EXPIRED` error code
2. Use the refresh token to obtain a new access token via `POST /api/auth/refresh`
3. Retry the original request with the new access token

## Request Type Extension

The middleware extends the Express Request type to include user information:

```typescript
declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

interface TokenPayload {
  userId: string;
  email: string;
}
```

## Security Considerations

1. **Token Storage**: Clients should store access tokens securely (e.g., memory, secure storage)
2. **Refresh Tokens**: Should be stored in httpOnly cookies or secure storage
3. **HTTPS**: Always use HTTPS in production to prevent token interception
4. **Token Expiration**: Access tokens expire in 15 minutes by default
5. **Refresh Token Rotation**: Refresh tokens are rotated on each use

## Example: Protected Route

```typescript
import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { profileController } from '../controllers/profile.controller';

const router = Router();

// Public route - no authentication
router.get('/templates', (req, res) => {
  // Anyone can view templates
});

// Protected route - requires authentication
router.get('/profile', authenticate, (req, res) => {
  const userId = req.user!.userId; // TypeScript knows user exists
  // Fetch and return user profile
});

// Protected route with ownership check
router.put('/profile/:userId', 
  authenticate, 
  requireOwnership(), 
  (req, res) => {
    // User can only update their own profile
  }
);

export default router;
```

## Testing

When testing protected routes, include a valid JWT token in the Authorization header:

```typescript
const response = await request(app)
  .get('/api/profile')
  .set('Authorization', `Bearer ${accessToken}`)
  .expect(200);
```

For testing purposes, you can generate tokens using the `generateTokens` utility:

```typescript
import { generateTokens } from '../utils/jwt';

const tokens = generateTokens({
  userId: 'test-user-id',
  email: 'test@example.com',
});

const accessToken = tokens.accessToken;
```
