# Manual Test Scripts

This directory contains manual testing and debugging scripts used during development. These are **not** automated tests - they're standalone scripts to test specific features.

## 🧪 Available Test Scripts

### Resume Generation & Processing

- **`test-ats-score.js`** - Test ATS score calculation algorithm
  ```bash
  node tests/manual/test-ats-score.js
  ```

- **`test-content-selection.js`** - Test content selection logic
  ```bash
  node tests/manual/test-content-selection.js
  ```

- **`test-content-optimization.js`** - Test AI content optimization
  ```bash
  node tests/manual/test-content-optimization.js
  ```

- **`test-latex-compiler.js`** - Test LaTeX PDF compilation
  ```bash
  node tests/manual/test-latex-compiler.js
  ```

### Templates

- **`test-template-endpoints.js`** - Test template API endpoints
  ```bash
  node tests/manual/test-template-endpoints.js
  ```

- **`check-templates.ts`** - Check template database entries
  ```bash
  npx tsx tests/manual/check-templates.ts
  ```

- **`fix-all-templates.ts`** - Fix broken template placeholders
  ```bash
  npx tsx tests/manual/fix-all-templates.ts
  ```

### Community & Interview Features

- **`test-community-platform.js`** - Test community platform endpoints
  ```bash
  node tests/manual/test-community-platform.js
  ```

- **`test-interview-prep.js`** - Test interview question generation
  ```bash
  node tests/manual/test-interview-prep.js
  ```

### Security & Profile

- **`test-security.js`** - Test security features and validation
  ```bash
  node tests/manual/test-security.js
  ```

- **`test-profile-api.js`** - Test profile API endpoints
  ```bash
  node tests/manual/test-profile-api.js
  ```

## 📝 Usage Notes

### Prerequisites
- Backend server should be running (`npm run dev:backend`)
- Database should be initialized
- Docker services (PostgreSQL, Redis, LaTeX) should be running

### Running Tests
Most scripts can be run directly with Node.js:
```bash
cd packages/backend
node tests/manual/test-<feature>.js
```

TypeScript scripts need tsx:
```bash
cd packages/backend
npx tsx tests/manual/<script>.ts
```

### Purpose
These scripts were created during development to:
- Test individual features in isolation
- Debug specific functionality
- Verify API endpoints
- Test edge cases
- Validate data transformations

## ⚠️ Important Notes

1. **Not Automated Tests**: These are manual scripts, not part of a test suite
2. **Development Tools**: Used for debugging and verification during development
3. **May Need Updates**: Some scripts might need updates if APIs have changed
4. **Not Required**: The application works without running these scripts

## 🔄 Automated Testing

For automated testing, consider adding:
- Jest or Vitest for unit tests
- Supertest for API integration tests
- Playwright or Cypress for E2E tests

These manual scripts can serve as a reference for writing automated tests.

## 🗑️ Cleanup

If you don't need these scripts anymore, you can safely delete this directory. The application will continue to work normally.
