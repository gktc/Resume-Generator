# Midnight Ghost Theme Audit Summary

## ✅ Already Updated

- MainLayout.tsx - Dark theme with black background, gray sidebar
- ResumeHistoryPage.tsx - Black background, dark cards
- ATSScoreDisplay.tsx - White cards with black text (intentional for score display)
- index.css - Global styles with Poppins font

## ❌ Needs Updating (Old Gray/Blue Theme)

### Authentication Pages

- **LoginPage.tsx** - bg-gray-50, bg-white, text-blue-600
- **RegisterPage.tsx** - bg-gray-50, bg-white, text-blue-600

### Profile Pages

- **ProfileDashboardPage.tsx** - bg-gray-50, bg-white cards
- **BasicInfoPage.tsx** - bg-gray-50, bg-white cards
- **WorkExperiencePage.tsx** - bg-gray-50, bg-white, text-blue-600
- **EducationPage.tsx** - bg-gray-50, bg-white cards
- **SkillsPage.tsx** - bg-gray-50, bg-white, text-purple-600
- **ProjectsPage.tsx** - bg-gray-50, bg-white, text-orange-600

### Resume Pages

- **ResumeGeneratorPage.tsx** - bg-gray-50, bg-white cards
- **ResumeDetailPage.tsx** - bg-gray-50, bg-white, text-blue-600
- **ResumeUploadPage.tsx** - bg-gray-50, bg-white, text-blue-600
- **ParsedDataReviewPage.tsx** - bg-gray-50, bg-white cards

### Interview Pages

- **InterviewQuestionsPage.tsx** - bg-gray-50, bg-white cards
- **InterviewInsightsPage.tsx** - bg-gray-50, bg-white cards
- **CompanySearchPage.tsx** - bg-gray-50, bg-white cards
- **InterviewExperienceFormPage.tsx** - bg-gray-50, bg-white cards

### Dashboard

- **DashboardPage.tsx** - bg-gray-50, bg-white cards

## Color Mapping Guide

### Old → New

- `bg-gray-50` → `bg-black` (main background)
- `bg-white` → `bg-[#1A1A1A]` (cards/containers)
- `bg-gray-100` → `bg-gray-800` (hover states)
- `text-gray-900` → `text-white` (primary text)
- `text-gray-600` → `text-gray-400` (secondary text)
- `text-gray-500` → `text-gray-500` (tertiary text - keep)
- `text-blue-600` → `text-white` (links/buttons)
- `bg-blue-600` → `bg-white` (primary buttons)
- `hover:bg-blue-700` → `hover:bg-gray-200` (button hover)
- `border-gray-200` → `border-gray-800` (borders)
- `border-gray-300` → `border-gray-700` (input borders)

### Button Styles

- Primary: `bg-white text-black hover:bg-gray-200`
- Secondary: `border border-gray-700 text-white hover:bg-gray-800`
- Danger: `bg-red-500 text-white hover:bg-red-600`

## Priority Order

1. **High**: Dashboard, Login, Register (most visible)
2. **Medium**: Profile pages, Resume Generator
3. **Low**: Interview pages, Detail pages

