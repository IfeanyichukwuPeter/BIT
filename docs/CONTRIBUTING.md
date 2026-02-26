# Contributing to BIT Children Ministry Website

First off, thank you for considering contributing to the BIT Children Ministry website! It's people like you that help us reach more children and families with the message of Christ.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Submitting Changes](#submitting-changes)

---

## 📜 Code of Conduct

This project is a ministry initiative. We expect all contributors to:

- Be respectful and considerate in communications
- Focus on what is best for the community and ministry
- Show empathy towards other contributors
- Accept constructive criticism gracefully

---

## 🚀 Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/BIT.git
   cd BIT
   ```
3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/original-repo/BIT.git
   ```
4. **Install dependencies**:
   ```bash
   pnpm install
   ```

---

## 🔄 Development Workflow

### Creating a Branch

Always create a new branch for your work:

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

**Branch naming conventions:**
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `style/` - CSS/styling changes
- `refactor/` - Code refactoring
- `test/` - Adding or updating tests

### Making Changes

1. **Make your changes** in your feature branch
2. **Test locally**:
   ```bash
   pnpm dev
   # Visit http://localhost:3000
   ```
3. **Run tests**:
   ```bash
   pnpm test
   ```
4. **Check code coverage**:
   ```bash
   pnpm run test:coverage
   ```

### Keeping Your Fork Updated

```bash
git fetch upstream
git checkout main
git merge upstream/main
```

---

## 💻 Coding Standards

### JavaScript

- Use **ES6+** syntax
- Use **async/await** for asynchronous operations
- Prefer **const** over **let**, avoid **var**
- Use descriptive variable and function names
- Add comments for complex logic

**Example:**
```javascript
// Good
async function fetchQuestions() {
  const response = await fetch("/api/questions");
  return response.json();
}

// Avoid
function getQ() {
  return fetch("/api/questions").then(r => r.json());
}
```

### CSS

- Use **semantic class names**
- Follow **mobile-first** approach
- Keep specificity low
- Group related styles together

**Example:**
```css
/* Good */
.section-title {
  font-size: 1.5rem;
  color: var(--primary-color);
}

/* Avoid */
#section div.title {
  font-size: 24px;
}
```

### HTML

- Use **semantic HTML5** elements
- Include **alt text** for images
- Ensure **accessibility** (ARIA labels where needed)
- Keep structure clean and readable

---

## 🧪 Testing Guidelines

### Writing Tests

All new features should include tests:

```javascript
describe("Feature Name", () => {
  it("should do something specific", async () => {
    const result = await someFunction();
    expect(result).toBe(expectedValue);
  });
});
```

### Test Coverage Requirements

- Aim for **>90%** coverage on new code
- Test both success and error cases
- Include edge cases
- Test authentication where applicable

### Running Tests

```bash
# Run all tests
pnpm test

# Run specific test file
pnpm test tests/questions.test.js

# Watch mode
pnpm run test:watch
```

---

## 📝 Submitting Changes

### Commit Messages

Use clear, descriptive commit messages:

**Format:**
```
type(scope): subject

body (optional)

footer (optional)
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Formatting, missing semi-colons, etc.
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

**Examples:**
```bash
git commit -m "feat(contact): add email validation to question form"
git commit -m "fix(admin): resolve token expiration issue"
git commit -m "docs(readme): update installation instructions"
```

### Pull Request Process

1. **Update your branch** with latest main:
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

3. **Create a Pull Request** on GitHub with:
   - Clear title describing the change
   - Detailed description of what was changed and why
   - Screenshots (if UI changes)
   - Link to related issue (if applicable)

4. **PR Checklist:**
   - [ ] Code follows project style guidelines
   - [ ] Tests pass locally
   - [ ] New tests added for new features
   - [ ] Documentation updated
   - [ ] No console.log statements left behind
   - [ ] Responsive design tested on mobile

### Review Process

- Maintainers will review your PR
- Address any requested changes
- Once approved, your PR will be merged

---

## 🐛 Reporting Bugs

### Before Submitting

- Check if the bug has already been reported
- Verify the bug exists in the latest version
- Collect relevant information

### Bug Report Template

```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
- OS: [e.g. Windows, macOS, Linux]
- Browser: [e.g. Chrome, Firefox, Safari]
- Version: [e.g. 22]
```

---

## 💡 Suggesting Features

We love feature suggestions! Please include:

- Clear description of the feature
- Why it would be useful for the ministry
- Possible implementation approach
- Any potential challenges

---

## 🔍 Code Review Guidelines

When reviewing others' code:

- Be kind and constructive
- Explain why you're suggesting changes
- Recognize good solutions
- Test the changes locally

---

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [Jest Documentation](https://jestjs.io/)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
- [MDN Web Docs](https://developer.mozilla.org/)

---

## ❓ Questions?

If you have questions about contributing:

- Open an issue with the `question` label
- Contact the maintainers
- Check existing issues and PRs

---

Thank you for contributing to BIT Children Ministry! Your efforts help us reach more children and families with the Gospel. 🙏
