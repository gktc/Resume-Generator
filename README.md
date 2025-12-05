# Caliber

An AI-powered resume builder that generates ATS-optimized resumes tailored to specific job descriptions. Caliber helps job seekers create targeted resumes and prepare for interviews using community-contributed interview experiences.

## Features

- 🔐 **User Authentication** - Secure account creation and login
- 👤 **Profile Management** - Store career information (experience, education, skills, projects)
- 📄 **Resume Upload & Parsing** - Extract data from existing PDF/DOCX resumes
- 🎯 **Job Description Analysis** - AI-powered extraction of requirements and skills
- 📝 **LaTeX Template System** - Multiple professional resume templates
- ✨ **Resume Generation** - Create ATS-optimized resumes with scoring
- 💼 **Interview Preparation** - Generate potential interview questions
- 🤝 **Community Platform** - Share and access anonymous interview experiences

## Tech Stack

### Backend
- Node.js + Express.js + TypeScript
- PostgreSQL (Prisma ORM)
- Redis (Bull queue)
- JWT Authentication
- OpenAI API
- LaTeX (pdflatex in Docker)

### Frontend
- React 18 + TypeScript
- React Router
- TanStack Query
- Tailwind CSS
- Axios

## Prerequisites

- Node.js 20+ and npm
- Docker and Docker Compose
- Ollama with Gemma 2B model (for AI features - free and local)

## Quick Start

### Prerequisites
- Node.js 20+ and npm
- Docker Desktop

### Setup Steps

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment**
   ```bash
   # Backend
   cp packages/backend/.env.example packages/backend/.env
   # Edit packages/backend/.env - add JWT_SECRET and other configs
   
   # Frontend
   cp packages/frontend/.env.example packages/frontend/.env
   ```

3. **Start Docker Services**
   ```bash
   npm run docker:up
   ```

4. **Initialize Database**
   ```bash
   cd packages/backend
   npm run prisma:generate
   npm run prisma:migrate:deploy
   npm run seed:templates
   ```

5. **Start Development Servers**
   ```bash
   npm run dev
   ```

### Access Points
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- Prisma Studio: `npm run prisma:studio` (in backend folder)

## Project Structure

Clean monorepo structure with backend and frontend workspaces:

```
caliber/
├── packages/
│   ├── backend/              # Express.js API + PostgreSQL + Redis
│   └── frontend/             # React + TypeScript + Tailwind CSS
├── docs/                     # Comprehensive documentation
├── .kiro/                    # IDE configuration and specs
├── docker-compose.yml        # PostgreSQL, Redis, LaTeX services
└── package.json              # Workspace configuration
```

See [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) for detailed structure and conventions.

## Available Scripts

### Root Level
- `npm run dev` - Run both backend and frontend
- `npm run build` - Build both projects
- `npm run lint` - Lint all workspaces
- `npm run format` - Format code with Prettier
- `npm run docker:up` - Start Docker services
- `npm run docker:down` - Stop Docker services

### Backend
- `npm run dev:backend` - Start backend dev server
- `npm run build:backend` - Build backend

### Frontend
- `npm run dev:frontend` - Start frontend dev server
- `npm run build:frontend` - Build frontend

## Docker Services

The project uses Docker Compose to run the following services:

- **PostgreSQL** (port 5432) - Main database
- **Redis** (port 6379) - Queue and caching
- **LaTeX** - PDF compilation container

## Development Workflow

1. Start Docker services: `npm run docker:up`
2. Run development servers: `npm run dev`
3. Make changes to code (hot reload enabled)
4. Format code: `npm run format`
5. Lint code: `npm run lint`

## Environment Variables

### Backend (.env)
- `NODE_ENV` - Environment (development/production)
- `PORT` - Server port (default: 3000)
- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_HOST` - Redis host
- `JWT_SECRET` - JWT signing secret
- `OPENAI_API_KEY` - OpenAI API key

### Frontend (.env)
- `VITE_API_URL` - Backend API URL

## 🎨 Styling

The frontend uses **Tailwind CSS** with a component-based architecture:

- **[CSS Component Library](packages/frontend/src/styles/README.md)** - Complete component documentation
- Reusable component classes for buttons, cards, forms, notifications, and more
- Semantic naming and consistent theme tokens
- Built-in accessibility with WCAG AA compliance

## 📚 Documentation

- **[Documentation Index](docs/README.md)** - Complete documentation overview
- **[Backend README](packages/backend/src/README.md)** - API documentation and architecture
- **[CSS Component Library](packages/frontend/src/styles/README.md)** - UI component system
- **[Database Schema](docs/backend/DATABASE.md)** - Database structure and relationships
- **[Smart Resume Generation](docs/backend/SMART_RESUME_GENERATION.md)** - Intelligent content optimization

## License

MIT
