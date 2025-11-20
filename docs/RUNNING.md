# ATS Resume Builder - Running Guide

## 🎉 Your Application is Now Running!

### Services Status

✅ **Docker Services** (Running)
- PostgreSQL: `localhost:5432`
- Redis: `localhost:6379`
- LaTeX Compiler: Ready

✅ **Backend API** (Running)
- URL: http://localhost:3000
- Health Check: http://localhost:3000/health
- Status: Connected to database

✅ **Prisma Studio** (Running)
- URL: http://localhost:5555
- Visual database browser

✅ **Database** (Initialized)
- Schema: All 11 tables created
- Seed Data: 5 resume templates loaded
- Test Users: 2 users registered

---

## Quick Commands

### Start/Stop Services

```bash
# Start Docker services
npm run docker:up

# Stop Docker services
npm run docker:down

# View Docker logs
npm run docker:logs

# Start backend server
npm run dev:backend

# Start frontend (when ready)
npm run dev:frontend

# Start both
npm run dev
```

### Database Commands

```bash
cd packages/backend

# Open Prisma Studio (visual database browser)
npm run prisma:studio

# Generate Prisma Client
npm run prisma:generate

# Create new migration
npm run prisma:migrate

# Seed database
npm run prisma:seed

# Reset database (WARNING: deletes all data)
npm run db:reset
```

---

## Test the API

### Register a User

```powershell
$body = @{
  email='user@example.com'
  password='SecurePass123'
  firstName='John'
  lastName='Doe'
} | ConvertTo-Json

Invoke-RestMethod -Uri 'http://localhost:3000/api/auth/register' `
  -Method Post -Body $body -ContentType 'application/json'
```

### Login

```powershell
$body = @{
  email='user@example.com'
  password='SecurePass123'
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri 'http://localhost:3000/api/auth/login' `
  -Method Post -Body $body -ContentType 'application/json'

# Save the access token
$token = $response.data.tokens.accessToken
```

### Get Current User

```powershell
$headers = @{
  Authorization = "Bearer $token"
}

Invoke-RestMethod -Uri 'http://localhost:3000/api/auth/me' `
  -Method Get -Headers $headers
```

---

## What's Working

✅ **Project Structure**
- Monorepo with backend and frontend workspaces
- TypeScript configuration
- Docker Compose setup
- ESLint and Prettier

✅ **Database**
- PostgreSQL with Prisma ORM
- 11 tables with relationships
- Migrations and seed data
- Indexes for performance

✅ **Authentication System**
- User registration with password hashing (bcrypt)
- User login with JWT tokens
- Access token (15 min) + Refresh token (7 days)
- Token refresh endpoint
- Logout with session invalidation
- Protected routes with middleware
- Password strength validation
- Email format validation

✅ **API Endpoints**
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user (protected)
- `GET /health` - Health check

---

## Next Steps

### Immediate Next Features

1. **User Profile Management** (Task 4)
   - CRUD for work experience
   - CRUD for education
   - CRUD for skills
   - CRUD for projects

2. **Resume Upload & Parsing** (Task 5)
   - File upload endpoint
   - PDF parsing
   - DOCX parsing
   - Data extraction with AI

3. **Job Description Analysis** (Task 6)
   - AI-powered job analysis
   - Keyword extraction
   - Requirements matching

4. **Resume Generation** (Task 7)
   - LaTeX template rendering
   - PDF compilation
   - ATS score calculation
   - Async job queue

---

## Useful URLs

- **Backend API**: http://localhost:3000
- **API Health**: http://localhost:3000/health
- **Prisma Studio**: http://localhost:5555
- **Frontend** (when started): http://localhost:5173

---

## Troubleshooting

### Backend won't start
```bash
# Check if port 3000 is in use
netstat -ano | findstr :3000

# Check Docker services
docker ps

# View backend logs
# (Check the terminal where you ran npm run dev:backend)
```

### Database connection issues
```bash
# Restart Docker services
npm run docker:down
npm run docker:up

# Check PostgreSQL logs
docker logs ats-postgres

# Verify DATABASE_URL in packages/backend/.env
```

### Prisma errors
```bash
cd packages/backend

# Regenerate Prisma Client
npm run prisma:generate

# Check migration status
npx prisma migrate status

# Reset database (WARNING: deletes data)
npm run db:reset
```

---

## Development Workflow

1. **Start Docker services** (if not running)
   ```bash
   npm run docker:up
   ```

2. **Start backend server**
   ```bash
   npm run dev:backend
   ```

3. **Start frontend** (when ready)
   ```bash
   npm run dev:frontend
   ```

4. **Make changes** - Hot reload is enabled

5. **Test your changes** - Use Prisma Studio or API calls

6. **Commit your work**
   ```bash
   git add .
   git commit -m "feat: your feature description"
   ```

---

## Current Progress

- ✅ Task 1: Project structure and development environment
- ✅ Task 2: Database schema and migrations
- ✅ Task 3: Authentication system
- ⏳ Task 4: User profile management (Next)
- ⏳ Task 5: Resume upload and parsing
- ⏳ Task 6: Job description analysis
- ⏳ Task 7: Resume generation
- ⏳ Task 8: Interview preparation
- ⏳ Task 9: Community platform

---

## Need Help?

- Check the [README.md](./README.md) for project overview
- Check [SETUP.md](./SETUP.md) for detailed setup instructions
- Check [packages/backend/DATABASE.md](./packages/backend/DATABASE.md) for database documentation
- Check [packages/backend/src/README.md](./packages/backend/src/README.md) for API documentation

Happy coding! 🚀
