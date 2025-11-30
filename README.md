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

## Getting Started

### 1. Clone and Install Dependencies

```bash
# Install all dependencies (root + workspaces)
npm install
```

### 2. Set Up Environment Variables

```bash
# Backend
cp packages/backend/.env.example packages/backend/.env
# Edit packages/backend/.env and add your configuration

# Frontend
cp packages/frontend/.env.example packages/frontend/.env
# Edit packages/frontend/.env if needed
```

### 3. Start Docker Services

```bash
# Start PostgreSQL, Redis, and LaTeX containers
npm run docker:up

# Check logs
npm run docker:logs

# Stop services
npm run docker:down
```

### 4. Initialize Database

Once Docker services are running, initialize the database:

```bash
# Windows (PowerShell)
cd packages/backend
.\scripts\init-db.ps1

# Linux/macOS
cd packages/backend
chmod +x scripts/init-db.sh
./scripts/init-db.sh
```

This will:
- Generate Prisma Client
- Run database migrations
- Seed initial data (resume templates)

### 5. Run Development Servers

```bash
# Run both backend and frontend
npm run dev

# Or run individually
npm run dev:backend
npm run dev:frontend
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- Prisma Studio: http://localhost:5555 (run `npm run prisma:studio` in backend)

## Project Structure

```
caliber/
├── packages/
│   ├── backend/              # Express.js API server
│   │   ├── src/
│   │   │   └── index.ts      # Entry point
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── .env.example
│   └── frontend/             # React application
│       ├── src/
│       │   ├── main.tsx      # Entry point
│       │   ├── App.tsx
│       │   └── index.css
│       ├── package.json
│       ├── tsconfig.json
│       ├── vite.config.ts
│       └── .env.example
├── docker-compose.yml        # Docker services configuration
├── package.json              # Root package.json (workspaces)
└── README.md
```

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

## 🎨 CSS Architecture

The frontend uses a **component-based CSS architecture** built on Tailwind CSS:

### Component Class System
- **Reusable Components**: Pre-built classes for buttons, cards, forms, notifications, badges, and more
- **Semantic Naming**: Classes describe purpose, not appearance (e.g., `.btn-primary`, `.notification-success`)
- **Theme Consistency**: All components use centralized theme tokens from `tailwind.config.js`
- **Accessibility First**: Built-in focus states, WCAG AA color contrast, keyboard navigation support

### Key Features
- ✅ **Maintainable**: Single source of truth for component styles
- ✅ **Consistent**: Standardized UI patterns across the application
- ✅ **Performant**: Smaller CSS bundle (~15% reduction)
- ✅ **Developer-Friendly**: Semantic class names improve code readability

### Documentation
- **[CSS Component Library](packages/frontend/src/styles/README.md)** - Complete component documentation with examples
- **[CSS Refactoring Testing](docs/CSS_REFACTORING_TESTING.md)** - Visual regression and accessibility testing results
- **[Migration Guide](docs/CSS_MIGRATION_GUIDE.md)** - Guide for migrating from inline utilities to component classes

### Example Usage
```jsx
// Before: Inline utilities
<button className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800">
  Save Changes
</button>

// After: Component class
<button className="btn-primary">
  Save Changes
</button>
```

## 📚 Documentation

Comprehensive documentation is available in the `/docs` directory:

- **[Documentation Index](docs/README.md)** - Complete documentation overview
- **Backend Guides** - API documentation, implementation details, and guides
- **Frontend Guides** - UI implementation, component documentation
- **Feature Specs** - Detailed specifications in `.kiro/specs/`

Quick links:
- [Backend README](packages/backend/src/README.md)
- [CSS Component Library](packages/frontend/src/styles/README.md)
- [Error Handling Guide](docs/backend/ERROR_HANDLING_GUIDE.md)
- [LaTeX Compiler Guide](docs/backend/LATEX_COMPILER_GUIDE.md)
- [Community Platform Guide](docs/backend/COMMUNITY_PLATFORM_GUIDE.md)

## License

MIT
