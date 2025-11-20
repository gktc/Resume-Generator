# Backend API Documentation

## Authentication System

The authentication system uses JWT (JSON Web Tokens) with access and refresh token pattern for secure user authentication.

### Endpoints

#### Register User
```
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123",
  "firstName": "John",
  "lastName": "Doe"
}

Response (201):
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe"
    },
    "tokens": {
      "accessToken": "jwt-token",
      "refreshToken": "jwt-refresh-token",
      "expiresIn": 900
    }
  }
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123"
}

Response (200):
{
  "success": true,
  "data": {
    "user": { ... },
    "tokens": { ... }
  }
}
```

#### Get Current User
```
GET /api/auth/me
Authorization: Bearer <access-token>

Response (200):
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

#### Refresh Token
```
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "jwt-refresh-token"
}

Response (200):
{
  "success": true,
  "data": {
    "tokens": {
      "accessToken": "new-jwt-token",
      "refreshToken": "new-jwt-refresh-token",
      "expiresIn": 900
    }
  }
}
```

#### Logout
```
POST /api/auth/logout
Content-Type: application/json

{
  "refreshToken": "jwt-refresh-token"
}

Response (200):
{
  "success": true,
  "data": {
    "message": "Logged out successfully"
  }
}
```

### Password Requirements

- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number

### Token Expiration

- **Access Token**: 15 minutes (configurable via `JWT_EXPIRES_IN`)
- **Refresh Token**: 7 days (configurable via `JWT_REFRESH_EXPIRES_IN`)

### Error Codes

| Code | Status | Description |
|------|--------|-------------|
| `AUTH_TOKEN_MISSING` | 401 | No authentication token provided |
| `AUTH_TOKEN_INVALID` | 401 | Invalid or expired token |
| `AUTH_INVALID_CREDENTIALS` | 401 | Invalid email or password |
| `AUTH_UNAUTHORIZED` | 401 | User not authorized |
| `USER_EXISTS` | 409 | User with email already exists |
| `USER_NOT_FOUND` | 404 | User not found |
| `VALIDATION_FAILED` | 400 | Input validation failed |

### Using Authentication in Routes

```typescript
import { authenticate } from '../middleware/auth.middleware';

// Protected route
router.get('/protected', authenticate, (req, res) => {
  // req.user contains { userId, email }
  const userId = req.user.userId;
  // ... your logic
});

// Optional authentication
router.get('/public', optionalAuthenticate, (req, res) => {
  if (req.user) {
    // User is authenticated
  } else {
    // User is not authenticated
  }
});
```

### Security Features

1. **Password Hashing**: Bcrypt with 10 salt rounds
2. **JWT Tokens**: Signed with secret keys
3. **Token Rotation**: New refresh token on each refresh
4. **Session Management**: Refresh tokens stored in database
5. **Token Expiration**: Short-lived access tokens
6. **Input Validation**: Email format and password strength validation
7. **SQL Injection Protection**: Prisma parameterized queries

## Project Structure

```
src/
├── controllers/       # Request handlers
│   └── auth.controller.ts
├── services/         # Business logic
│   └── auth.service.ts
├── routes/           # API routes
│   └── auth.routes.ts
├── middleware/       # Express middleware
│   └── auth.middleware.ts
├── utils/            # Utility functions
│   ├── jwt.ts
│   ├── password.ts
│   └── validation.ts
├── lib/              # External libraries
│   └── prisma.ts
├── types/            # TypeScript types
│   └── database.ts
└── index.ts          # Application entry point
```

## Development

### Running the Server

```bash
# Development mode with hot reload
npm run dev:backend

# Build for production
npm run build:backend

# Run production build
npm run start
```

### Environment Variables

Create a `.env` file in `packages/backend/`:

```env
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ats_resume_builder
JWT_SECRET=your-secret-key-change-this
JWT_REFRESH_SECRET=your-refresh-secret-key-change-this
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
```

### Testing with cURL

```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test1234","firstName":"Test","lastName":"User"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test1234"}'

# Get current user
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Next Steps

After authentication is complete, the next features to implement are:

1. **Profile Management** - CRUD operations for user profile data
2. **Resume Upload & Parsing** - File upload and text extraction
3. **Job Description Analysis** - AI-powered job analysis
4. **Resume Generation** - LaTeX compilation and PDF generation
5. **Interview Preparation** - AI-generated interview questions
6. **Community Platform** - Interview experience sharing
