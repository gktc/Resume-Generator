# ATS Resume Builder - Documentation

Welcome to the ATS Resume Builder documentation! This directory contains all project documentation organized by category.

## 📁 Documentation Structure

### `/backend` - Backend Documentation
Backend-specific guides, implementation details, and API documentation.

- **Guides**
  - [Error Handling Guide](backend/ERROR_HANDLING_GUIDE.md)
  - [LaTeX Compiler Guide](backend/LATEX_COMPILER_GUIDE.md)
  - [LaTeX Quick Start](backend/LATEX_QUICK_START.md)
  - [Template Quick Start](backend/TEMPLATE_QUICK_START.md)
  - [ATS Score Quick Reference](backend/ATS_SCORE_QUICK_REFERENCE.md)
  - [Community Platform Guide](backend/COMMUNITY_PLATFORM_GUIDE.md)
  - [Interview Prep Module](backend/INTERVIEW_PREP_MODULE.md)

- **Implementation Summaries**
  - [Task 7: Template System](backend/TASK_7_IMPLEMENTATION_SUMMARY.md)
  - [Task 8.2: Queue System](backend/TASK_8.2_VERIFICATION.md)
  - [Task 8.3: Content Selection](backend/TASK_8.3_IMPLEMENTATION.md)
  - [Task 8.4: Content Optimization](backend/TASK_8.4_SUMMARY.md)
  - [Task 8.5: ATS Scoring](backend/TASK_8.5_ATS_SCORE_IMPLEMENTATION.md)
  - [Task 8.6: LaTeX Compilation](backend/TASK_8.6_IMPLEMENTATION.md)
  - [Task 11: Community Platform](backend/TASK_11_SUMMARY.md)
  - [Task 20: Security](backend/TASK_20_SECURITY_IMPLEMENTATION.md)

### `/frontend` - Frontend Documentation
Frontend-specific guides, UI implementation details, and component documentation.

- **Guides**
  - [Error Handling Guide](frontend/ERROR_HANDLING_GUIDE.md)
  - [Authentication Guide](frontend/AUTHENTICATION_GUIDE.md)
  - [Profile Management Implementation](frontend/PROFILE_MANAGEMENT_IMPLEMENTATION.md)
  - [Navigation & Layout Implementation](frontend/NAVIGATION_LAYOUT_IMPLEMENTATION.md)

- **Feature Documentation**
  - [Resume Generation UI](frontend/RESUME_GENERATION_UI.md)
  - [Resume History UI](frontend/RESUME_HISTORY_UI.md)
  - [Interview Prep UI](frontend/INTERVIEW_PREP_UI.md)
  - [Community Platform UI](frontend/COMMUNITY_PLATFORM_UI.md)

### `/guides` - General Guides
Cross-cutting concerns and general project guides.

- [Application Status](APPLICATION_STATUS.md) - Current state of the application
- [Data Structure Fixes](DATA_STRUCTURE_FIXES.md) - Database schema updates
- [Task 19: Error Handling Summary](TASK_19_ERROR_HANDLING_SUMMARY.md)

## 🚀 Quick Links

### Getting Started
1. [Backend README](../packages/backend/src/README.md) - Backend setup and architecture
2. [Frontend Setup](frontend/AUTHENTICATION_GUIDE.md) - Frontend authentication setup

### Key Features
- **Resume Generation**: [Backend](backend/TASK_8.4_SUMMARY.md) | [Frontend](frontend/RESUME_GENERATION_UI.md)
- **Interview Prep**: [Backend](backend/INTERVIEW_PREP_MODULE.md) | [Frontend](frontend/INTERVIEW_PREP_UI.md)
- **Community Platform**: [Backend](backend/COMMUNITY_PLATFORM_GUIDE.md) | [Frontend](frontend/COMMUNITY_PLATFORM_UI.md)

### Development Guides
- [Error Handling](backend/ERROR_HANDLING_GUIDE.md) - How to handle errors properly
- [LaTeX Compilation](backend/LATEX_COMPILER_GUIDE.md) - Working with LaTeX templates
- [ATS Scoring](backend/ATS_SCORE_QUICK_REFERENCE.md) - Understanding ATS score calculation

## 📋 Specs

Project specifications and planning documents are located in `.kiro/specs/`:
- [ATS Resume Builder Spec](.kiro/specs/ats-resume-builder/)
- [Template Preview Images Spec](.kiro/specs/template-preview-images/)

## 🔧 Contributing

When adding new documentation:
1. Place backend docs in `/docs/backend`
2. Place frontend docs in `/docs/frontend`
3. Place general guides in `/docs/guides`
4. Update this README with links to new documentation

## 📝 Documentation Standards

- Use clear, descriptive titles
- Include code examples where relevant
- Keep documentation up-to-date with code changes
- Use markdown formatting for readability
- Add diagrams or screenshots when helpful
