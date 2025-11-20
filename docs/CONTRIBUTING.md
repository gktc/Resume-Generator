# Contributing Guide

Thank you for contributing to the ATS Resume Builder project!

## Development Setup

1. Follow the [SETUP.md](./SETUP.md) guide to set up your development environment
2. Create a new branch for your feature: `git checkout -b feature/your-feature-name`
3. Make your changes following our code standards
4. Test your changes thoroughly
5. Submit a pull request

## Code Standards

Please follow the guidelines in [.kiro/steering/code-standards.md](./.kiro/steering/code-standards.md):

- Use TypeScript for all new code
- Follow ESLint and Prettier configurations
- Write meaningful commit messages
- Add comments for complex logic
- Ensure proper error handling

## Project Structure

```
ats-resume-builder/
├── packages/
│   ├── backend/          # Express.js API
│   │   ├── src/          # Source code
│   │   ├── prisma/       # Database schema
│   │   └── tests/        # Backend tests
│   └── frontend/         # React app
│       ├── src/          # Source code
│       └── tests/        # Frontend tests
├── scripts/              # Setup and utility scripts
└── docker-compose.yml    # Docker services
```

## Workflow

### Before Starting Work

1. Pull latest changes: `git pull origin main`
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Review the task in `.kiro/specs/ats-resume-builder/tasks.md`

### During Development

1. Write code following our standards
2. Format code: `npm run format`
3. Lint code: `npm run lint`
4. Test your changes locally
5. Commit with clear messages: `git commit -m "feat: add user authentication"`

### Commit Message Format

Use conventional commits:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

Examples:
```
feat: add resume upload endpoint
fix: resolve JWT token expiration issue
docs: update API documentation
refactor: simplify job analysis logic
```

### Before Submitting PR

1. Ensure all tests pass
2. Format code: `npm run format`
3. Lint code: `npm run lint`
4. Build both projects: `npm run build`
5. Update documentation if needed

## Testing

- Write tests for new features
- Ensure existing tests still pass
- Test edge cases and error conditions
- Mock external dependencies (APIs, databases)

## Pull Request Process

1. Update the README.md or documentation if needed
2. Ensure your code follows the style guidelines
3. Write a clear PR description explaining your changes
4. Link related issues or tasks
5. Request review from maintainers

## Questions?

If you have questions:
- Check the [README.md](./README.md)
- Review the [design document](./.kiro/specs/ats-resume-builder/design.md)
- Check existing issues and discussions
- Ask in the project discussions

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
