# LaTeX Template System - Quick Start Guide

## 🚀 Getting Started

### Prerequisites
```bash
# 1. Start the database
docker-compose up -d postgres

# 2. Seed the templates (one-time setup)
cd packages/backend
npm run prisma:seed:templates

# 3. Start the backend server
npm run dev
```

### Test the API
```bash
# Run the test script
node test-template-endpoints.js
```

## 📋 API Endpoints

### List All Templates
```bash
curl http://localhost:3000/api/templates
```

### Filter by Category
```bash
curl http://localhost:3000/api/templates?category=modern
```

### Get Template Details
```bash
curl http://localhost:3000/api/templates/{template-id}
```

### Get Template Preview
```bash
curl http://localhost:3000/api/templates/{template-id}/preview
```

## 💻 Usage in Code

### List Templates
```typescript
import { TemplateService } from './services/template.service';

const templateService = new TemplateService();

// Get all templates
const templates = await templateService.getAllTemplates();

// Get templates by category
const modernTemplates = await templateService.getAllTemplates('modern');
```

### Render a Template
```typescript
const rendered = await templateService.renderTemplate(templateId, {
  personalInfo: {
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1-555-0123',
    location: 'San Francisco, CA',
    github: 'johndoe',
    linkedin: 'linkedin.com/in/johndoe',
  },
  summary: 'Experienced software engineer with 5+ years...',
  experience: [
    {
      company: 'Tech Corp',
      position: 'Senior Engineer',
      startDate: '2020-01-01',
      endDate: null, // null = Present
      description: 'Leading development of core platform',
      achievements: [
        'Built scalable API serving 1M+ requests/day',
        'Reduced latency by 50% through optimization',
      ],
      technologies: ['Node.js', 'React', 'PostgreSQL'],
    },
  ],
  education: [
    {
      institution: 'University of California',
      degree: 'Bachelor of Science',
      fieldOfStudy: 'Computer Science',
      startDate: '2015-09-01',
      endDate: '2019-06-01',
      gpa: 3.8,
      achievements: ['Dean\'s List', 'Graduated with Honors'],
    },
  ],
  skills: [
    {
      name: 'JavaScript',
      category: 'technical',
      proficiency: 'expert',
      yearsOfExperience: 5,
    },
    {
      name: 'React',
      category: 'technical',
      proficiency: 'advanced',
      yearsOfExperience: 4,
    },
  ],
  projects: [
    {
      title: 'E-commerce Platform',
      description: 'Full-stack e-commerce solution',
      technologies: ['React', 'Node.js', 'MongoDB'],
      url: 'https://example.com',
      githubUrl: 'https://github.com/user/project',
      startDate: '2023-01-01',
      endDate: '2023-06-01',
      highlights: [
        'Implemented payment processing with Stripe',
        'Built admin dashboard with analytics',
      ],
    },
  ],
});

// rendered is now a LaTeX string ready for compilation
```

## 📝 Available Templates

### 1. Modern Professional
- **ID:** Get from API
- **Category:** `modern`
- **Best For:** Tech and corporate roles
- **Style:** Clean, modern layout

### 2. Classic Traditional
- **ID:** Get from API
- **Category:** `classic`
- **Best For:** Finance, law, academia
- **Style:** Traditional, centered header

### 3. Technical Engineer
- **ID:** Get from API
- **Category:** `technical`
- **Best For:** Software engineering roles
- **Style:** Skills-first, compact layout

## 🔧 Template Variables

### Required Variables
- `{{name}}` - Full name
- `{{email}}` - Email address
- `{{phone}}` - Phone number

### Optional Variables
- `{{location}}` - City, State
- `{{linkedin}}` - LinkedIn URL
- `{{github}}` - GitHub username
- `{{website}}` - Personal website
- `{{summary}}` - Professional summary

### Array Variables
- `{{experience}}` - Work experience entries
- `{{education}}` - Education entries
- `{{skills}}` - Skills list
- `{{projects}}` - Project entries

## ⚠️ Important Notes

### Date Format
- Dates should be ISO strings: `"2023-01-01"`
- `null` for endDate means "Present"
- Formatted as: "Jan 2023"

### LaTeX Characters
- Special characters are automatically escaped
- No need to escape `&`, `%`, `$`, etc.
- The system handles it for you

### Conditional Sections
- Sections with no data are automatically hidden
- Empty arrays won't show empty sections
- Keeps resumes clean and professional

## 🐛 Troubleshooting

### Templates Not Found
```bash
# Re-seed the templates
npm run prisma:seed:templates
```

### Database Connection Error
```bash
# Check if database is running
docker-compose ps

# Start database if needed
docker-compose up -d postgres
```

### Preview Images Not Loading
- Check that `public/templates/` directory exists
- Verify preview image files are present
- Replace placeholders with actual PNG images

## 📚 More Information

- **Full Documentation:** See `TEMPLATE_SYSTEM_README.md`
- **Implementation Details:** See `TASK_7_IMPLEMENTATION_SUMMARY.md`
- **Test Script:** Run `node test-template-endpoints.js`

## 🎯 Next Steps

1. **Test the API:** Run the test script to verify everything works
2. **Replace Previews:** Add actual PNG preview images
3. **Integrate with Task 8:** Use templates in resume generation pipeline
4. **Add More Templates:** Create additional templates as needed

## 💡 Tips

- Use the test script to see example API responses
- Check the seed script for template structure examples
- Review the service code for advanced usage patterns
- Templates are cached for performance (future optimization)

## 🔗 Related Files

- Service: `src/services/template.service.ts`
- Controller: `src/controllers/template.controller.ts`
- Routes: `src/routes/template.routes.ts`
- Seed: `prisma/seed-templates.ts`
- Tests: `test-template-endpoints.js`
