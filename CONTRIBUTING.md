# Contributing to SDA Training Program

Thank you for your interest in contributing to the SDA Training Program! This document provides guidelines and information for contributors.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Process](#development-process)
- [Submitting Changes](#submitting-changes)
- [Style Guidelines](#style-guidelines)
- [Documentation](#documentation)
- [Testing](#testing)
- [Questions](#questions)

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to training@mechlin.tech.

## Getting Started

### Prerequisites

- Node.js 18+
- Git
- Docker (for containerization)
- VS Code or preferred IDE
- GitHub account

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/sda-training.git
   cd sda-training
   ```
3. Add the upstream remote:
   ```bash
   git remote add upstream https://github.com/mechlin-tech/sda-training.git
   ```

### Development Environment

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Process

### Branch Naming

Use descriptive branch names:
- `feature/add-new-exercise`
- `fix/typo-in-documentation`
- `docs/update-setup-guide`
- `refactor/improve-code-structure`

### Commit Messages

Follow the conventional commit format:
```
type(scope): description

[optional body]

[optional footer]
```

Examples:
- `feat(week1): add new React exercise for day 4`
- `fix(docs): correct typo in setup guide`
- `docs(api): update API documentation`
- `refactor(backend): improve error handling`

### Pull Request Process

1. **Create a Pull Request**
   - Use the provided PR template
   - Include a clear description of changes
   - Reference any related issues

2. **Code Review**
   - Ensure all checks pass
   - Address reviewer feedback
   - Update documentation if needed

3. **Merge**
   - Squash and merge for clean history
   - Delete the feature branch after merge

## Submitting Changes

### For Training Participants

1. **Daily Submissions**
   - Commit your daily work with descriptive messages
   - Create a PR for each day's work
   - Include screenshots of working applications
   - Update relevant documentation

2. **Weekly Reviews**
   - Submit `WEEK<n>_SUMMARY.md`
   - Include architecture diagrams
   - Demonstrate code quality and best practices
   - Show integration testing

3. **Final Project**
   - Complete full-stack AI-enabled application
   - Include multi-platform deployment
   - Implement CI/CD pipeline
   - Provide comprehensive documentation

### For Contributors

1. **Bug Reports**
   - Use the bug report template
   - Include steps to reproduce
   - Provide environment details
   - Add screenshots if applicable

2. **Feature Requests**
   - Use the feature request template
   - Describe the problem and solution
   - Provide use cases and examples
   - Consider implementation complexity

3. **Documentation**
   - Follow the existing style and format
   - Include code examples where relevant
   - Update table of contents if needed
   - Test all links and references

## Style Guidelines

### Code Style

- Follow ESLint configuration
- Use meaningful variable and function names
- Include comments for complex logic
- Maintain consistent formatting

### Documentation Style

- Use clear, concise language
- Include code examples
- Provide step-by-step instructions
- Use proper markdown formatting

### File Organization

- Keep related files together
- Use descriptive file names
- Follow the established directory structure
- Maintain consistent naming conventions

## Documentation

### Writing Guidelines

- Use active voice
- Be clear and concise
- Include practical examples
- Test all instructions

### Types of Documentation

- **Setup Guides**: Step-by-step installation instructions
- **API Documentation**: Endpoint descriptions and examples
- **Tutorials**: Learning exercises and projects
- **Reference**: Quick lookup information

### Updating Documentation

- Keep documentation current with code changes
- Update examples when APIs change
- Review and test all instructions
- Get feedback from other contributors

## Testing

### Test Requirements

- Write tests for new features
- Ensure existing tests still pass
- Include edge cases and error conditions
- Test across different environments

### Test Types

- **Unit Tests**: Individual function testing
- **Integration Tests**: Component interaction testing
- **End-to-End Tests**: Full workflow testing
- **Performance Tests**: Load and stress testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Questions

### Getting Help

- **GitHub Issues**: For bugs and feature requests
- **GitHub Discussions**: For questions and ideas
- **Email**: training@mechlin.tech for direct support

### Community

- Join our community discussions
- Share your learning journey
- Help other participants
- Contribute to the knowledge base

## Recognition

Contributors will be recognized in:
- CONTRIBUTORS.md file
- Release notes
- Community highlights
- Special acknowledgments

## License

By contributing to this project, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to the SDA Training Program! Your contributions help make this program better for everyone.
