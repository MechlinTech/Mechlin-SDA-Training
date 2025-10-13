# Git Workflow Guide

## Branching Strategy

### Main Branches
- **main**: Production-ready code
- **develop**: Integration branch for features
- **feature/**: Feature development branches
- **hotfix/**: Critical bug fixes
- **release/**: Release preparation branches

### Branch Naming Convention
```
feature/day1-setup
feature/day2-css
feature/week1-frontend
hotfix/authentication-bug
release/v1.0.0
```

## Daily Workflow

### 1. Start Your Day
```bash
# Pull latest changes
git checkout develop
git pull upstream develop

# Create feature branch
git checkout -b feature/day1-setup
```

### 2. Make Changes
```bash
# Make your changes
# ... code changes ...

# Stage changes
git add .

# Commit with descriptive message
git commit -m "Complete Day 1: SDLC & GitHub Mastery

- Set up repository structure
- Created PR templates
- Implemented branching strategy
- Added documentation"
```

### 3. Push and Create PR
```bash
# Push to your fork
git push origin feature/day1-setup

# Create pull request on GitHub
# Use the PR template
```

### 4. Code Review
- Review your own code first
- Address reviewer feedback
- Make necessary changes
- Update documentation

### 5. Merge and Cleanup
```bash
# After PR is approved and merged
git checkout develop
git pull upstream develop
git branch -d feature/day1-setup
git push origin --delete feature/day1-setup
```

## Commit Message Guidelines

### Format
```
<type>(<scope>): <description>

<body>

<footer>
```

### Types
- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes
- **refactor**: Code refactoring
- **test**: Adding tests
- **chore**: Maintenance tasks

### Examples
```
feat(auth): add JWT authentication

- Implement JWT token generation
- Add authentication middleware
- Create login/logout endpoints

Closes #123
```

```
fix(api): resolve CORS issues

- Add CORS middleware
- Configure allowed origins
- Update documentation

Fixes #456
```

## Pull Request Guidelines

### PR Title
- Use descriptive title
- Include day/week reference
- Mention main feature

### PR Description
- Describe changes made
- Include screenshots if applicable
- Reference related issues
- Add testing notes

### PR Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No breaking changes

## Conflict Resolution

### When Conflicts Occur
```bash
# Pull latest changes
git checkout develop
git pull upstream develop

# Rebase your feature branch
git checkout feature/your-branch
git rebase develop

# Resolve conflicts
# ... edit conflicted files ...

# Continue rebase
git add .
git rebase --continue
```

### Merge vs Rebase
- **Merge**: Preserves commit history
- **Rebase**: Cleaner linear history
- **Squash**: Single commit for feature

## Best Practices

### Code Quality
- Write clean, readable code
- Follow project conventions
- Add meaningful comments
- Include error handling

### Documentation
- Update README files
- Document new features
- Include code examples
- Add troubleshooting guides

### Testing
- Write unit tests
- Test edge cases
- Verify error handling
- Test user workflows

### Security
- Never commit secrets
- Use environment variables
- Validate input data
- Follow security best practices

## Troubleshooting

### Common Issues

#### Undo Last Commit
```bash
# Soft reset (keeps changes)
git reset --soft HEAD~1

# Hard reset (loses changes)
git reset --hard HEAD~1
```

#### Recover Lost Changes
```bash
# View reflog
git reflog

# Reset to specific commit
git reset --hard <commit-hash>
```

#### Clean Working Directory
```bash
# Remove untracked files
git clean -fd

# Reset to last commit
git reset --hard HEAD
```

### Getting Help
- Check Git documentation
- Use `git help <command>`
- Ask in GitHub Discussions
- Review project guidelines

## Advanced Workflows

### Feature Flags
```bash
# Create feature branch
git checkout -b feature/new-feature

# Develop feature
# ... code changes ...

# Test with feature flag
# ... testing ...

# Merge when ready
```

### Hotfix Workflow
```bash
# Create hotfix branch from main
git checkout main
git pull upstream main
git checkout -b hotfix/critical-bug

# Fix the bug
# ... code changes ...

# Test fix
# ... testing ...

# Merge to main and develop
```

### Release Workflow
```bash
# Create release branch
git checkout develop
git checkout -b release/v1.0.0

# Prepare release
# ... version updates ...

# Test release
# ... testing ...

# Merge to main
git checkout main
git merge release/v1.0.0
git tag v1.0.0
```

## Resources

- [Git Documentation](https://git-scm.com/doc)
- [GitHub Flow](https://guides.github.com/introduction/flow/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Git Best Practices](https://www.atlassian.com/git/tutorials/comparing-workflows)

---

**Ready to start coding? Begin with [Week 1, Day 1](../week1/day1/README.md)!** 🚀
