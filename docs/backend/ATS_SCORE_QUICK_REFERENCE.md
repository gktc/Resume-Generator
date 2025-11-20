# ATS Score Calculation - Quick Reference

## Score Components & Weights

```
┌─────────────────────────────────────────────────────────────┐
│                    OVERALL ATS SCORE                        │
│                        (0-100)                              │
└─────────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
    ┌───▼────┐         ┌────▼────┐        ┌────▼────┐
    │Keyword │         │Experience│        │ Format  │
    │ Match  │         │Relevance │        │Parseable│
    │  40%   │         │   30%    │        │   20%   │
    └────────┘         └──────────┘        └─────────┘
                                                │
                                           ┌────▼────┐
                                           │Education│
                                           │  Match  │
                                           │   10%   │
                                           └─────────┘
```

## Scoring Breakdown

### 1. Keyword Match (40%)
**What it measures**: Resume content vs job keywords

**Calculation**:
- Extract all resume text (summary, experience, skills, projects)
- Match against job skills + keywords
- Score = (Matched Keywords / Total Keywords) × 100

**Example**:
```
Job Keywords: 16 total
Matched: 12
Missing: 4 (rest api, agile, team leadership, mentoring)
Score: 75/100
```

### 2. Experience Relevance (30%)
**What it measures**: Years of experience vs job level

**Calculation**:
- Calculate total years from work history
- Match against experience level requirements
- Apply bonuses for multiple positions & recency

**Level Requirements**:
```
Entry:     0-2 years   → 80 base
Junior:    1-3 years   → 80 base
Mid:       2-5 years   → 85 base
Senior:    5-10 years  → 90 base
Lead:      7-15 years  → 90 base
Principal: 10-20 years → 95 base
```

**Example**:
```
Candidate: 7.6 years
Job Level: Senior (5-10 years)
Base Score: 90
+ Multiple positions: +10
+ Recent experience: +5
Final Score: 95/100
```

### 3. Format Parseability (20%)
**What it measures**: Resume structure & completeness

**Calculation**:
- Start with 100
- Deduct for missing/incomplete sections
- Add bonuses for extras

**Deductions**:
```
- No/short summary:        -10
- No experience:           -20
- No skills:               -15
- No education:            -10
- Missing achievements:    -5 each
- Missing position/company: -5 each
```

**Bonuses**:
```
+ Has projects:            +5
+ Complete contact info:   +5
```

### 4. Education Match (10%)
**What it measures**: Degree requirements met

**Calculation**:
- Base: 70 (for having education)
- Match degree level to requirements
- Add bonuses for GPA & achievements

**Degree Matching**:
```
PhD required + PhD:           100
Master's required + Master's:  95
Bachelor's required + Bachelor's: 90
Bachelor's (no requirement):   85
```

**Bonuses**:
```
+ GPA ≥ 3.5:        +5
+ Has achievements: +5
```

## Score Interpretation

```
90-100: Excellent Match ⭐⭐⭐⭐⭐
  → Strong candidate, high ATS pass rate
  → Resume well-optimized for job

80-89:  Good Match ⭐⭐⭐⭐
  → Solid candidate, likely to pass ATS
  → Minor improvements possible

70-79:  Fair Match ⭐⭐⭐
  → May pass ATS with improvements
  → Focus on missing keywords

60-69:  Weak Match ⭐⭐
  → Low ATS pass rate
  → Significant optimization needed

0-59:   Poor Match ⭐
  → Unlikely to pass ATS
  → Major revisions required
```

## Suggestions Generated

The system provides actionable feedback based on scores:

| Condition | Suggestion |
|-----------|------------|
| Keyword < 70 | "Incorporate more job-specific keywords. Missing: [top 5]" |
| Experience < 70 | "Highlight more relevant work experience" |
| Format < 80 | "Improve resume structure with detailed achievements" |
| Education < 70 | "Ensure education section lists relevant degrees" |
| Any missing keywords | "Consider adding these skills: [top 3]" |

## Example Output

```json
{
  "overall": 89,
  "breakdown": {
    "keywordMatch": 75,
    "experienceRelevance": 95,
    "formatParseability": 100,
    "educationMatch": 100
  },
  "missingKeywords": [
    "rest api",
    "agile",
    "team leadership",
    "mentoring"
  ],
  "suggestions": [
    "Consider adding these skills if you have them: rest api, agile, team leadership"
  ]
}
```

## Usage in Code

```typescript
// In ResumeGenerationService
const atsScore = await this.calculateATSScore(optimizedContent, jobAnalysis);

// Returns ATSScore object with:
// - overall: number (0-100)
// - breakdown: { keywordMatch, experienceRelevance, formatParseability, educationMatch }
// - missingKeywords: string[]
// - suggestions: string[]
```

## Testing

Run the test script:
```bash
cd packages/backend
node test-ats-score.js
```

Expected output:
```
✓ Calculates keyword matching score
✓ Calculates experience relevance score
✓ Calculates format parseability score
✓ Calculates education match score
✓ Generates weighted overall score (0-100)
✓ Identifies missing keywords
✓ Provides improvement suggestions
```

## Key Benefits

✅ **Transparent**: Clear breakdown of how score is calculated
✅ **Actionable**: Specific suggestions for improvement
✅ **Accurate**: Multi-dimensional assessment
✅ **Fast**: No external API calls, instant results
✅ **Comprehensive**: Covers all major ATS factors
