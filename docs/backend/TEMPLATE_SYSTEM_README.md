# LaTeX Template System

## Overview

The LaTeX Template System provides a flexible way to generate professional resumes using predefined LaTeX templates. The system includes template management, variable substitution, and LaTeX character escaping.

## Components

### 1. TemplateService (`src/services/template.service.ts`)

Handles all template-related business logic:

- **getAllTemplates(category?)**: Retrieve all active templates, optionally filtered by category
- **getTemplateById(id)**: Get a specific template by ID
- **createTemplate(data)**: Create a new template
- **renderTemplate(templateId, data)**: Render a template with user data

#### Template Rendering Features

- **Variable Substitution**: Replace placeholders like `{{name}}`, `{{email}}`, etc.
- **Array Iteration**: Handle arrays for experience, education, skills, and projects
- **Conditional Sections**: Hide sections when no data is present
- **LaTeX Escaping**: Automatically escape special LaTeX characters in user input
- **Date Formatting**: Format dates as "Mon YYYY" (e.g., "Jan 2023")

### 2. TemplateController (`src/controllers/template.controller.ts`)

Handles HTTP requests for template operations:

- `GET /api/templates` - List all active templates
- `GET /api/templates/:id` - Get template details
- `GET /api/templates/:id/preview` - Serve template preview image

### 3. Template Routes (`src/routes/template.routes.ts`)

Defines the API endpoints for template operations.

## Database Schema

```prisma
model Template {
  id              String   @id @default(uuid())
  name            String
  description     String   @db.Text
  category        String   // 'modern', 'classic', 'creative', 'academic', 'technical'
  previewImageUrl String
  latexContent    String   @db.Text
  variables       String[] // List of template variables
  isActive        Boolean  @default(true)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  resumes Resume[]
}
```

## Seeding Templates

### Running the Seed Script

1. Ensure the database is running:
   ```bash
   docker-compose up -d postgres
   ```

2. Run the template seed script:
   ```bash
   npm run prisma:seed:templates
   ```

### Included Templates

The seed script creates three professional templates:

1. **Modern Professional**
   - Category: `modern`
   - Clean, modern layout with professional styling
   - Features clear hierarchy and easy-to-read sections
   - Perfect for tech and corporate roles

2. **Classic Traditional**
   - Category: `classic`
   - Timeless, traditional format with centered header
   - Ideal for conservative industries (finance, law, academia)

3. **Technical Engineer**
   - Category: `technical`
   - Optimized for software engineers and technical roles
   - Emphasizes technical skills upfront
   - Compact, information-dense layout

## Template Variables

All templates support the following variables:

### Personal Information
- `{{name}}` - Full name
- `{{email}}` - Email address
- `{{phone}}` - Phone number
- `{{location}}` - City, State/Country
- `{{linkedin}}` - LinkedIn profile URL
- `{{github}}` - GitHub username
- `{{website}}` - Personal website URL

### Content Sections
- `{{summary}}` - Professional summary
- `{{experience}}` - Work experience array
- `{{education}}` - Education array
- `{{skills}}` - Skills array
- `{{projects}}` - Projects array

## LaTeX Character Escaping

The system automatically escapes special LaTeX characters:

- `\` → `\textbackslash{}`
- `&`, `%`, `$`, `#`, `_`, `{`, `}` → `\&`, `\%`, etc.
- `~` → `\textasciitilde{}`
- `^` → `\textasciicircum{}`

## Usage Example

```typescript
import { TemplateService } from './services/template.service';

const templateService = new TemplateService();

// Get all templates
const templates = await templateService.getAllTemplates();

// Get templates by category
const modernTemplates = await templateService.getAllTemplates('modern');

// Render a template
const rendered = await templateService.renderTemplate(templateId, {
  personalInfo: {
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1-555-0123',
    location: 'San Francisco, CA',
    github: 'johndoe',
    linkedin: 'linkedin.com/in/johndoe',
  },
  summary: 'Experienced software engineer...',
  experience: [
    {
      company: 'Tech Corp',
      position: 'Senior Engineer',
      startDate: '2020-01-01',
      endDate: null,
      description: 'Leading development...',
      achievements: ['Built scalable API', 'Reduced latency by 50%'],
      technologies: ['Node.js', 'React', 'PostgreSQL'],
    },
  ],
  // ... more data
});
```

## API Endpoints

### List Templates

```http
GET /api/templates
GET /api/templates?category=modern
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Modern Professional",
      "description": "A clean, modern template...",
      "category": "modern",
      "previewImageUrl": "/templates/modern-preview.png",
      "variables": ["name", "email", "phone", ...],
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### Get Template Details

```http
GET /api/templates/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Modern Professional",
    "description": "A clean, modern template...",
    "category": "modern",
    "previewImageUrl": "/templates/modern-preview.png",
    "latexContent": "\\documentclass...",
    "variables": ["name", "email", "phone", ...],
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Get Template Preview

```http
GET /api/templates/:id/preview
```

Returns the preview image file (PNG).

## Preview Images

Preview images are stored in `public/templates/` directory:

- `modern-preview.png`
- `classic-preview.png`
- `technical-preview.png`

**Note:** Current preview files are placeholders. Replace with actual PNG images showing the template layout.

## Adding New Templates

To add a new template:

1. Create the LaTeX template content with variable placeholders
2. Create a preview image (PNG) and save to `public/templates/`
3. Use the `createTemplate` method or add to the seed script:

```typescript
await prisma.template.create({
  data: {
    name: 'Creative Designer',
    description: 'A creative template for designers...',
    category: 'creative',
    previewImageUrl: '/templates/creative-preview.png',
    latexContent: '\\documentclass...',
    variables: ['name', 'email', 'phone', ...],
    isActive: true,
  },
});
```

## Error Handling

The system handles the following errors:

- `TEMPLATE_NOT_FOUND` (404): Template ID doesn't exist
- `TEMPLATE_LIST_FAILED` (500): Failed to retrieve templates
- `TEMPLATE_GET_FAILED` (500): Failed to get template details
- `PREVIEW_NOT_FOUND` (404): Preview image file not found
- `PREVIEW_GET_FAILED` (500): Failed to serve preview image

## Next Steps

This template system is used by the Resume Generation Pipeline (Task 8) to:

1. Select a template based on user preference
2. Render the template with optimized resume content
3. Compile the LaTeX to PDF using the LaTeX compiler service

## Testing

To test the template endpoints:

```bash
# List all templates
curl http://localhost:3000/api/templates

# Get specific template
curl http://localhost:3000/api/templates/{template-id}

# Get template preview
curl http://localhost:3000/api/templates/{template-id}/preview
```

Or use the provided test script (to be created in Task 7.2).
