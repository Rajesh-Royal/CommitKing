# Contributing to CommitKings 🤝

First off, thank you for considering contributing to CommitKings! It's people like you that make this project a great tool for the GitHub community.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Process](#development-process)
- [Submitting Changes](#submitting-changes)
- [Coding Standards](#coding-standards)
- [Commit Messages](#commit-messages)
- [Testing](#testing)
- [Documentation](#documentation)

## 🤝 Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## 🚀 Getting Started

### Prerequisites

- **Node.js**: Version 18.17.0 or higher
- **pnpm**: Latest version (we use pnpm for package management)
- **Git**: For version control
- **Supabase Account**: For database and authentication

### Fork and Clone

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/CommitKing.git
   cd CommitKing
   ```
3. **Add the original repository** as upstream:
   ```bash
   git remote add upstream https://github.com/Rajesh-Royal/CommitKing.git
   ```

### Setup Development Environment

1. **Install dependencies**:
   ```bash
   pnpm install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your Supabase credentials
   ```

3. **Set up the database**:
   ```bash
   pnpm db:push
   ```

4. **Start the development server**:
   ```bash
   pnpm dev
   ```

5. **Verify everything works**:
   - Open [http://localhost:3000](http://localhost:3000)
   - Check that you can view profiles and repositories
   - Test the rating functionality

## 🔄 Development Process

### Branching Strategy

- `master`: Production-ready code
- `develop`: Integration branch for features
- `feature/feature-name`: Feature development
- `bugfix/bug-name`: Bug fixes
- `hotfix/hotfix-name`: Critical production fixes

### Workflow

1. **Create a new branch** from `develop`:
   ```bash
   git checkout develop
   git pull upstream develop
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following our [coding standards](#coding-standards)

3. **Test your changes**:
   ```bash
   pnpm type-check
   pnpm lint
   pnpm build
   ```

4. **Commit your changes** using [conventional commits](#commit-messages)

5. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request** to the `develop` branch

## 📝 Submitting Changes

### Before Submitting

- [ ] Code follows our style guidelines
- [ ] Self-review of the code has been performed
- [ ] Code is commented, particularly in hard-to-understand areas
- [ ] Documentation has been updated if needed
- [ ] Changes generate no new warnings
- [ ] Tests have been added/updated for new functionality
- [ ] All tests pass locally

### Pull Request Process

1. **Use our PR template** (auto-populated when creating a PR)
2. **Link to related issues** using "Fixes #issue-number"
3. **Provide clear description** of changes and motivation
4. **Add screenshots** for UI changes
5. **Request review** from maintainers
6. **Address feedback** promptly and respectfully

### Review Process

- PRs require at least one approval from a maintainer
- All checks (linting, type checking, builds) must pass
- Constructive feedback is encouraged and expected
- Reviews focus on code quality, security, and project consistency

## 🎨 Coding Standards

### General Principles

- **TypeScript First**: All code should be written in TypeScript
- **Functional Components**: Use functional components with hooks
- **Early Returns**: Use early returns for error handling
- **Descriptive Naming**: Use clear, descriptive variable and function names
- **Single Responsibility**: Functions and components should have a single purpose

### Code Style

We use automated formatting with Prettier and linting with ESLint:

```bash
# Check formatting
pnpm format:check

# Fix formatting
pnpm format

# Lint code
pnpm lint

# Fix linting issues
pnpm lint:fix
```

### Component Structure

```typescript
// 1. Imports (grouped and sorted)
import React from 'react';
import { Button } from '@/components/ui/button';

// 2. Types/Interfaces
interface ComponentProps {
  title: string;
  onAction: () => void;
}

// 3. Component
export const Component: React.FC<ComponentProps> = ({ title, onAction }) => {
  // 4. Early returns for error handling
  if (!title) return null;

  // 5. Hooks
  const [state, setState] = useState();

  // 6. Event handlers
  const handleClick = () => {
    onAction();
  };

  // 7. Render
  return (
    <div>
      <h1>{title}</h1>
      <Button onClick={handleClick}>Action</Button>
    </div>
  );
};
```

### File Naming

- **Components**: PascalCase (`ProfileCard.tsx`)
- **Hooks**: camelCase with `use` prefix (`useItemQueue.ts`)
- **Utilities**: camelCase (`debugLog.ts`)
- **Constants**: UPPER_SNAKE_CASE (`PRIORITY_PROFILES`)

## 📝 Commit Messages

We follow [Conventional Commits](https://conventionalcommits.org/) specification:

### Format

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```bash
feat(auth): add GitHub OAuth integration
fix(ui): resolve avatar loading timeout issue
docs(readme): update installation instructions
refactor(hooks): simplify useItemQueue logic
test(utils): add tests for GitHub API utilities
chore(deps): update dependencies to latest versions
```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage
```

### Writing Tests

- Write tests for new functionality
- Update tests when modifying existing code
- Follow the existing test patterns
- Use descriptive test names
- Test both happy paths and edge cases

### Test Structure

```typescript
describe('Component/Function Name', () => {
  it('should handle the expected behavior', () => {
    // Arrange
    const input = 'test input';
    
    // Act
    const result = functionToTest(input);
    
    // Assert
    expect(result).toBe('expected output');
  });
});
```

## 📚 Documentation

### What to Document

- **New Features**: Add usage examples and explanations
- **API Changes**: Update relevant documentation
- **Breaking Changes**: Clearly document migration steps
- **Complex Logic**: Add inline comments for complex algorithms

### Documentation Style

- Use clear, concise language
- Include code examples
- Keep documentation up to date with code changes
- Use proper Markdown formatting

## 🐛 Reporting Issues

### Before Reporting

1. **Search existing issues** to avoid duplicates
2. **Check the latest version** to see if the issue is already fixed
3. **Try to reproduce** the issue with minimal steps

### Issue Template

Use our issue templates for:

- **Bug Reports**: Include steps to reproduce, expected vs actual behavior
- **Feature Requests**: Describe the problem and proposed solution
- **Documentation Issues**: Specify what needs to be improved

## 💬 Getting Help

### Community Support

- **GitHub Discussions**: General questions and community chat
- **Issues**: Bug reports and feature requests
- **Discord**: Real-time community support (link coming soon)

### Maintainer Contact

- **Project Lead**: @Rajesh-Royal
- **Response Time**: We aim to respond within 48 hours

## 🎉 Recognition

Contributors are recognized in:

- **Contributors section** in README
- **Release notes** for significant contributions
- **Special mentions** in project announcements

## 📋 Contributor Checklist

Before your first contribution:

- [ ] Read and understand the Code of Conduct
- [ ] Set up development environment successfully
- [ ] Run tests and ensure they pass
- [ ] Make a small test change and verify the workflow
- [ ] Introduce yourself in GitHub Discussions

---

Thank you for contributing to CommitKings! Your efforts help make this project better for everyone. 🙏
