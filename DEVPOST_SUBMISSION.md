# Caliber - AI-Powered ATS Resume Builder

## Inspiration
Job seekers struggle with creating resumes that pass Applicant Tracking Systems (ATS). We wanted to democratize access to professional resume optimization using free, local AI - no expensive subscriptions or data privacy concerns.

## What it does
Caliber is an intelligent resume builder that:
- **Parses existing resumes** from PDF/DOCX files using AI
- **Analyzes job descriptions** to extract key requirements and skills
- **Generates ATS-optimized resumes** tailored to specific positions with detailed scoring
- **Provides interview preparation** with AI-generated questions based on your experience
- **Offers multiple professional LaTeX templates** for polished, ATS-friendly output
- **Enables community learning** through anonymous interview experience sharing

## How we built it
**Tech Stack:**
- **Frontend:** React + TypeScript + Tailwind CSS
- **Backend:** Node.js + Express + TypeScript
- **Database:** PostgreSQL with Prisma ORM
- **AI:** Ollama with Gemma 2B (local, free, private)
- **Document Generation:** LaTeX compilation in Docker containers
- **Queue System:** Bull/Redis for async resume generation
- **Authentication:** JWT-based secure auth

**Architecture:** Full-stack monorepo with separate frontend/backend packages, containerized services, and async job processing for scalability.

## Challenges we ran into
1. **AI Model Performance:** Initial model (Gemma 3:4B) was too slow (3+ min per request). Switched to Gemma 2:2B and implemented JSON format mode for 10x speed improvement.
2. **JSON Parsing Reliability:** AI responses weren't consistently valid JSON. Added robust parsing with markdown removal and format enforcement.
3. **LaTeX Security:** Running user-generated LaTeX posed security risks. Isolated compilation in Docker containers with timeouts.
4. **ATS Score Accuracy:** Balancing keyword matching with semantic understanding required iterative prompt engineering.

## Accomplishments that we're proud of
- ✅ **100% Free & Private:** No API costs, all processing runs locally
- ✅ **Production-Ready Architecture:** Scalable queue system, proper error handling, comprehensive logging
- ✅ **Smart Resume Optimization:** AI-powered content generation that actually improves ATS scores
- ✅ **Professional Output:** Multiple LaTeX templates producing publication-quality PDFs
- ✅ **Complete Job Search Platform:** Resume building + interview prep + community insights in one place

## What we learned
- Local AI (Ollama) is viable for production apps with proper model selection and optimization
- JSON format enforcement dramatically improves LLM output reliability
- LaTeX in Docker provides both quality and security for document generation
- User experience matters: async processing with progress indicators prevents frustration
- Smaller, faster models often outperform larger ones for structured tasks

## What's next for Caliber
1. **Enhanced AI Features:**
   - Cover letter generation
   - LinkedIn profile optimization
   - Salary negotiation coaching

2. **Advanced Analytics:**
   - Track application success rates
   - A/B test different resume versions
   - Industry-specific ATS insights

3. **Collaboration Tools:**
   - Resume review requests from peers
   - Mentor feedback integration
   - Team hiring workflows

4. **Mobile App:**
   - On-the-go resume updates
   - Quick job application tracking
   - Interview prep flashcards

5. **Integration Ecosystem:**
   - Direct job board applications
   - LinkedIn import/export
   - Calendar integration for interview scheduling
