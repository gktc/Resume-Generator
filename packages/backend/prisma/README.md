# Database Schema and Migrations

This directory contains the Prisma schema and database migrations for the ATS Resume Builder.

## Schema Overview

The database schema includes the following main entities:

### User & Authentication
- **User**: User accounts with authentication
- **Session**: JWT session management

### Profile Data
- **WorkExperience**: User's work history
- **Education**: Academic background
- **Skill**: Technical and soft skills
- **Project**: Portfolio projects

### Job & Resume
- **JobDescription**: Saved job postings with AI analysis
- **Resume**: Generated resumes with ATS scores
- **Template**: LaTeX resume templates

### Interview Preparation
- **InterviewQuestion**: AI-generated interview questions
- **InterviewExperience**: Community-submitted interview data
- **InterviewRound**: Individual interview rounds

## Database Commands

### Generate Prisma Client
```bash
npm run prisma:generate
```

### Create a New Migration
```bash
npm run prisma:migrate
```

This will:
1. Prompt you for a migration name
2. Create a new migration file
3. Apply the migration to your database
4. Regenerate the Prisma Client

### Apply Migrations (Production)
```bash
npm run prisma:migrate:deploy
```

### Push Schema Without Migration (Development)
```bash
npm run db:push
```

Use this for rapid prototyping. It syncs your schema with the database without creating migration files.

### Reset Database
```bash
npm run db:reset
```

⚠️ **Warning**: This will:
1. Drop the database
2. Create a new database
3. Apply all migrations
4. Run the seed script

### Seed Database
```bash
npm run prisma:seed
```

Populates the database with initial data (templates).

### Open Prisma Studio
```bash
npm run prisma:studio
```

Opens a visual database browser at http://localhost:5555

## Migration Workflow

### Development
1. Modify `schema.prisma`
2. Run `npm run prisma:migrate` to create and apply migration
3. Commit both the schema and migration files

### Production
1. Pull latest code with migrations
2. Run `npm run prisma:migrate:deploy` to apply migrations
3. Restart the application

## Schema Design Principles

### Indexing Strategy
- All foreign keys are indexed
- User-scoped queries are indexed with `userId`
- Frequently filtered fields (company, role, category) are indexed
- Composite indexes for common query patterns

### Data Types
- UUIDs for all primary keys
- `@db.Text` for long text fields
- JSON for complex nested structures (analyzedData, atsScore)
- Arrays for lists (achievements, technologies, skills)

### Cascading Deletes
- All user-related data cascades on user deletion
- Resume-related data cascades on resume deletion
- Interview rounds cascade on experience deletion

### Timestamps
- All models include `createdAt` and `updatedAt`
- Automatic timestamp management via Prisma

## Common Queries

### Get User Profile with All Data
```typescript
const profile = await prisma.user.findUnique({
  where: { id: userId },
  include: {
    workExperiences: { orderBy: { order: 'asc' } },
    educations: { orderBy: { order: 'asc' } },
    skills: { orderBy: { order: 'asc' } },
    projects: { orderBy: { order: 'asc' } },
  },
});
```

### Get Resume with Related Data
```typescript
const resume = await prisma.resume.findUnique({
  where: { id: resumeId },
  include: {
    user: true,
    jobDescription: true,
    template: true,
    interviewQuestions: true,
  },
});
```

### Search Interview Experiences
```typescript
const experiences = await prisma.interviewExperience.findMany({
  where: {
    company: { contains: searchTerm, mode: 'insensitive' },
    isAnonymous: true,
  },
  include: {
    rounds: { orderBy: { roundNumber: 'asc' } },
  },
});
```

## Troubleshooting

### Migration Conflicts
If you encounter migration conflicts:
```bash
# Reset your local database
npm run db:reset

# Or manually resolve conflicts
npx prisma migrate resolve --applied <migration-name>
```

### Schema Drift
If your database schema doesn't match your Prisma schema:
```bash
# Check for drift
npx prisma migrate status

# Fix drift (development only)
npm run db:push
```

### Connection Issues
Verify your `DATABASE_URL` in `.env`:
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ats_resume_builder"
```

Make sure PostgreSQL is running:
```bash
# Check Docker containers
docker ps

# Start Docker services
npm run docker:up
```

## Best Practices

1. **Always create migrations** for schema changes in production
2. **Test migrations** on a staging database first
3. **Backup database** before running migrations in production
4. **Version control** all migration files
5. **Never edit** migration files after they've been applied
6. **Use transactions** for data migrations
7. **Document** complex migrations in comments

## Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- [Prisma Migrate](https://www.prisma.io/docs/concepts/components/prisma-migrate)
