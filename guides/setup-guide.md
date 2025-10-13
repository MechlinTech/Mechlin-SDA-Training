# Setup Guide

## Prerequisites

### Required Software
- [Node.js](https://nodejs.org/) (v18+)
- [Git](https://git-scm.com/)
- [Docker](https://www.docker.com/)
- [VS Code](https://code.visualstudio.com/) or preferred IDE
- [Postman](https://www.postman.com/)

### Development Environment
- GitHub account
- VS Code with recommended extensions
- Terminal/Command Line proficiency
- Basic understanding of JavaScript/TypeScript

## Getting Started

### 1. Fork and Clone Repository

```bash
# Fork this repository on GitHub, then clone your fork
git clone https://github.com/YOUR_USERNAME/sda-training.git
cd sda-training

# Add upstream remote
git remote add upstream https://github.com/mechlin-tech/sda-training.git
```

### 2. Set Up Development Environment

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration
```

### 3. Create Your Training Branch

```bash
# Create and switch to your training branch
git checkout -b your-name-training

# Push to your fork
git push -u origin your-name-training
```

### 4. Start with Week 1

Navigate to `week1/day1/` and follow the daily instructions.

## Environment Configuration

### Database Setup

#### MongoDB
```bash
# Install MongoDB
# macOS
brew install mongodb-community

# Ubuntu
sudo apt-get install mongodb

# Start MongoDB
mongod --dbpath /data/db
```

#### PostgreSQL
```bash
# Install PostgreSQL
# macOS
brew install postgresql

# Ubuntu
sudo apt-get install postgresql postgresql-contrib

# Start PostgreSQL
sudo service postgresql start
```

#### Redis
```bash
# Install Redis
# macOS
brew install redis

# Ubuntu
sudo apt-get install redis-server

# Start Redis
redis-server
```

### Environment Variables

Create a `.env` file in the root directory:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/sda-training
POSTGRES_URL=postgresql://username:password@localhost:5432/sda_training
REDIS_URL=redis://localhost:6379

# API Keys
OPENAI_API_KEY=your_openai_api_key_here
HUGGING_FACE_API_KEY=your_hugging_face_api_key_here

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=3000
NODE_ENV=development

# Frontend Configuration
REACT_APP_API_URL=http://localhost:3000/api
REACT_APP_WS_URL=ws://localhost:3000

# Mobile Configuration
EXPO_PUBLIC_API_URL=http://localhost:3000/api
```

## VS Code Extensions

### Recommended Extensions
- **ES7+ React/Redux/React-Native snippets**
- **Prettier - Code formatter**
- **ESLint**
- **GitLens**
- **Thunder Client** (API testing)
- **Docker**
- **Kubernetes**

### VS Code Settings

Create `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "emmet.includeLanguages": {
    "javascript": "javascriptreact"
  },
  "files.associations": {
    "*.js": "javascript",
    "*.jsx": "javascriptreact"
  }
}
```

## Development Workflow

### Daily Workflow
1. **Start your day**: Navigate to the current day's folder
2. **Read the README**: Review learning objectives and tasks
3. **Complete tasks**: Follow hands-on exercises
4. **Commit progress**: Use descriptive commit messages
5. **Create PRs**: Submit pull requests for code review

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/day1-setup

# Make changes and commit
git add .
git commit -m "Complete Day 1: SDLC & GitHub Mastery"

# Push to your fork
git push origin feature/day1-setup

# Create pull request on GitHub
```

### Code Quality
- Follow ESLint configuration
- Write meaningful commit messages
- Include tests for new features
- Update documentation as needed

## Troubleshooting

### Common Issues

#### Node.js Version Issues
```bash
# Check Node.js version
node --version

# Use nvm to manage Node.js versions
nvm install 18
nvm use 18
```

#### Database Connection Issues
```bash
# Check MongoDB status
mongod --version

# Check PostgreSQL status
pg_ctl status

# Check Redis status
redis-cli ping
```

#### Port Conflicts
```bash
# Check if port 3000 is in use
lsof -i :3000

# Kill process using port
kill -9 <PID>
```

### Getting Help
- Check the daily README files
- Review the documentation in each week
- Ask questions in GitHub Discussions
- Contact training support

## Next Steps

1. **Complete Week 1**: Advanced Frontend & Full-Stack Foundations
2. **Move to Week 2**: Advanced Backend & Databases
3. **Continue to Week 3**: DevOps & Mobile Development
4. **Finish with Week 4**: AI, Generative AI & Capstone Project

## Resources

- [Git Documentation](https://git-scm.com/doc)
- [Node.js Documentation](https://nodejs.org/docs/)
- [VS Code Documentation](https://code.visualstudio.com/docs)
- [Docker Documentation](https://docs.docker.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)

---

**Ready to start your training journey? Begin with [Week 1, Day 1](../week1/day1/README.md)!** 🚀
