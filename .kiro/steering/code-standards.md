---
inclusion: always
---

# Code Standards for ATS Resume Builder

## General Principles

- Write clean, readable, and maintainable code
- Follow DRY (Don't Repeat Yourself) principle
- Use meaningful variable and function names
- Add comments for complex logic, not obvious code

## TypeScript/JavaScript Standards

- Use TypeScript for all new code
- Enable strict mode in tsconfig.json
- Use async/await instead of raw promises
- Prefer const over let, avoid var
- Use arrow functions for callbacks
- Add JSDoc comments for all public functions and classes

## API Development

- Follow REST conventions for endpoints
- Use proper HTTP status codes (200, 201, 400, 401, 404, 500)
- All API responses must follow format: `{ success: boolean, data: any, error?: string }`
- Validate all input data before processing
- Use parameterized queries to prevent SQL injection
- Implement rate limiting on public endpoints

## Security Requirements

- Never commit secrets, API keys, or passwords to git
- Use environment variables for configuration
- Encrypt sensitive user data at rest
- Sanitize all user inputs
- Implement proper authentication and authorization
- Use HTTPS for all production endpoints

## Error Handling

- Always handle errors gracefully
- Log errors with sufficient context for debugging
- Return user-friendly error messages
- Use try-catch blocks for async operations
- Implement global error handlers

## Testing

- Write tests for critical business logic
- Test edge cases and error conditions
- Mock external dependencies (APIs, databases)
- Aim for meaningful test coverage, not just high percentages
- Use descriptive test names that explain what is being tested

## Code Organization

- Keep files focused and under 300 lines when possible
- Group related functionality into modules
- Separate business logic from presentation logic
- Use consistent file naming conventions
- Organize imports: external libraries first, then internal modules

## Database

- Use migrations for schema changes
- Index frequently queried columns
- Avoid N+1 query problems
- Use transactions for multi-step operations
- Never store plain text passwords

## Performance

- Optimize database queries before adding caching
- Use pagination for large data sets
- Implement lazy loading where appropriate
- Avoid blocking operations in request handlers
- Profile before optimizing

## Git Practices

- Write clear, descriptive commit messages
- Keep commits focused on single changes
- Create feature branches for new work
- Review your own code before requesting review
- Don't commit commented-out code or debug logs
