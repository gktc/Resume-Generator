# Community Interview Platform - Quick Start

## 🚀 Quick Test

```bash
# Start the backend server (if not already running)
cd packages/backend
npm run dev

# In another terminal, run the test suite
node test-community-platform.js
```

## 📋 API Endpoints

### Submit Interview Experience
```bash
POST /api/interview/experience
Authorization: Bearer <token>

{
  "company": "Google",
  "role": "Software Engineer",
  "interviewDate": "2024-01-15",
  "outcome": "offer",
  "overallDifficulty": "hard",
  "preparationTips": ["Practice daily", "Mock interviews"],
  "rounds": [
    {
      "roundNumber": 1,
      "roundType": "phone-screen",
      "duration": 45,
      "difficulty": "easy",
      "topics": ["Background"],
      "questions": ["Tell me about yourself"],
      "notes": "Friendly recruiter"
    }
  ]
}
```

### Get Available Companies
```bash
GET /api/interview/insights
Authorization: Bearer <token>
```

### Get Company Insights
```bash
GET /api/interview/insights/Google/Software%20Engineer
Authorization: Bearer <token>
```

## 🔑 Valid Values

**Outcome**: `offer`, `rejected`, `pending`, `withdrew`

**Difficulty**: `easy`, `medium`, `hard`

**Round Types**: 
- `phone-screen`
- `technical`
- `system-design`
- `behavioral`
- `cultural-fit`
- `take-home`
- `onsite`

## ✅ Features

- ✓ Submit interview experiences with multiple rounds
- ✓ Automatic PII anonymization (emails, phones, URLs)
- ✓ Aggregate insights by company and role
- ✓ Common questions, topics, and tips
- ✓ Difficulty distribution statistics
- ✓ Process structure analysis

## 📊 What Gets Aggregated

- Average number of interview rounds
- Most common round types
- Frequently asked questions
- Popular topics
- Difficulty distribution (easy/medium/hard %)
- Success tips from multiple candidates

## 🔒 Privacy

All submissions are automatically anonymized:
- `user@email.com` → `[email]`
- `555-1234` → `[phone]`
- `https://site.com` → `[url]`
- `Mr. John Smith` → `[name]`

## 📖 Full Documentation

See `COMMUNITY_PLATFORM_GUIDE.md` for complete documentation.

## 🧪 Testing

The test suite (`test-community-platform.js`) covers:
- Authentication
- Experience submission
- Data validation
- Anonymization
- Insights retrieval
- Error handling

## 🎯 Requirements Satisfied

All requirements 9.1-9.5 and 10.1-10.5 from the design document are implemented.
