# 📁 Project Structure Guide

This document explains the organization of the BIT Children Ministry codebase.

---

## 🗂️ Directory Overview

### `/public` - Frontend Client Code

Contains all user-facing HTML, CSS, JavaScript, and assets.

```
public/
├── components/         # Reusable HTML components loaded dynamically
│   ├── nav.html       # Navigation bar
│   └── footer.html    # Footer with social links
├── bitimg/            # All images and visual assets
├── *.html             # Page files (index, about, programs, contact, admin)
├── bit.css            # Global stylesheet
└── bit.js             # Client-side JavaScript
```

**Purpose:** Everything the browser loads and displays to users.

**How it works:**
- Server serves this folder as static files
- `bit.js` dynamically loads nav/footer components
- All pages link to shared CSS and JS

---

### `/server` - Backend API Code

Contains the Express.js server and API logic.

```
server/
├── controllers/           # Business logic
│   ├── authController.js # Login handling
│   └── questionController.js # Question CRUD operations
├── routes/               # Endpoint definitions
│   ├── auth.js          # /api/admin/* routes
│   └── questions.js     # /api/questions/* routes
├── middleware/           # Request processing
│   └── auth.js          # Token verification
├── utils/                # Helper functions
│   ├── fileStore.js     # File I/O operations
│   └── tokenManager.js  # Token generation/verification
├── app.js               # Express app configuration
├── server.js           # Server entry point (starts the app)
└── config.js           # Environment configuration
```

**Purpose:** API backend, authentication, data management.

**How it works:**
- `server.js` starts the Express server
- Routes define API endpoints
- Controllers handle business logic
- Middleware processes requests
- Utils provide reusable functions

---

### `/tests` - Test Suites

Contains all automated tests.

```
tests/
├── auth.test.js        # Authentication endpoint tests
├── questions.test.js   # Question CRUD and integration tests
├── server.test.js      # Server health tests
└── README.md           # Test documentation
```

**Purpose:** Ensure code quality and catch bugs.

**How to run:**
```bash
pnpm test              # Run all tests
pnpm run test:watch    # Watch mode
pnpm run test:coverage # With coverage report
```

**Coverage:** 97.89% (27 tests)

---

### `/data` - Data Storage

Contains persistent data in JSON format.

```
data/
└── questions.json      # All submitted questions and answers
```

**Purpose:** Simple file-based database for questions.

**Structure:**
```json
[
  {
    "id": 1709000000000,
    "name": "User Name",
    "question": "Question text?",
    "answer": "Answer text",
    "status": "answered" // or "pending"
  }
]
```

**Notes:**
- In production, consider migrating to a real database (PostgreSQL, MongoDB)
- Regular backups recommended
- IDs are Unix timestamps

---

### `/docs` - Documentation

Contains all project documentation.

```
docs/
├── README.md          # Complete project documentation
├── QUICKSTART.md      # 5-minute setup guide
├── CONTRIBUTING.md    # Contribution guidelines
├── DEPLOYMENT.md      # Production deployment guide
├── API.md             # API reference
├── CHANGELOG.md       # Version history
└── STRUCTURE.md       # This file
```

**Purpose:** Help developers and users understand the project.

**For new developers:** Start with [QUICKSTART.md](QUICKSTART.md)

---

### `/coverage` - Test Coverage Reports

Generated automatically when running `pnpm run test:coverage`.

**Ignored in git** - Not committed to repository.

---

### Root Files

```
BIT/
├── .env               # Environment variables (NEVER commit!)
├── .env.example       # Template for environment variables
├── .gitignore        # Files to exclude from git
├── jest.config.js    # Test configuration
├── package.json      # Project metadata and dependencies
├── pnpm-lock.yaml    # Locked dependency versions
└── README.md         # Project overview (links to docs/)
```

---

## 🔄 Request Flow

### Public Page Request

```
Browser → GET /index.html
   ↓
Server (Express)
   ↓
Serves /public/index.html
   ↓
Browser loads bit.css, bit.js
   ↓
JavaScript fetches components/nav.html, components/footer.html
   ↓
Page fully rendered
```

### API Request (Public)

```
Browser → POST /api/questions
   ↓
server/routes/questions.js
   ↓
server/controllers/questionController.js
   ↓
server/utils/fileStore.js
   ↓
data/questions.json (saved)
   ↓
Response sent back
```

### API Request (Admin)

```
Browser → PATCH /api/questions/:id + Bearer Token
   ↓
server/routes/questions.js
   ↓
server/middleware/auth.js (verify token)
   ↓
server/controllers/questionController.js
   ↓
server/utils/fileStore.js
   ↓
data/questions.json (updated)
   ↓
Response sent back
```

---

## 🎯 Key Design Decisions

### Why `/public` for client code?

- **Standard Convention:** Common in Express apps
- **Clear Separation:** Frontend vs Backend
- **Easy Deployment:** Many platforms expect `public/` for static assets
- **Security:** Prevents accidental exposure of server code

### Why `/docs` for documentation?

- **Organization:** Keeps root directory clean
- **GitHub Convention:** Many projects use `/docs`
- **Maintainability:** Easy to navigate and update
- **Version Control:** Documentation changes tracked separately

### Why file-based storage?

- **Simplicity:** No database setup required for MVP
- **Portability:** Easy to backup and restore
- **Development:** Fast iteration during development
- **Migration Path:** Can easily switch to database later

---

## 🔧 Adding New Features

### Adding a New Page

1. Create HTML file in `/public/`
2. Link to `bit.css` and `bit.js`
3. Include nav/footer sections
4. Add navigation link in `components/nav.html`

### Adding a New API Endpoint

1. Create controller function in `/server/controllers/`
2. Define route in `/server/routes/`
3. Add tests in `/tests/`
4. Document in `/docs/API.md`

### Adding New Tests

1. Create test file in `/tests/`
2. Follow existing patterns
3. Run `pnpm test` to verify
4. Aim for >90% coverage

---

## 📊 File Statistics

- **Total Files:** ~40
- **Lines of Code:** ~3,500
- **Test Coverage:** 97.89%
- **Documentation Pages:** 7

---

## 🔒 Security Notes

### Protected Directories

- `/server/` - Not accessible via web
- `/tests/` - Not accessible via web
- `/data/` - Not accessible via web
- `/node_modules/` - Not accessible via web

### Public Directories

- `/public/` - Everything is publicly accessible
- `/docs/` - Can be publicly accessible (for GitHub Pages)

### Sensitive Files

- `.env` - **NEVER commit to git!**
- `data/questions.json` - Contains user data, handle with care
- Token storage (in memory) - Not persisted to disk

---

## 🚀 Build Process

Currently, no build process is required:

- HTML/CSS/JS served directly
- No transpilation needed
- No bundling required

**For production optimization (future):**
- Minify CSS/JS
- Image optimization
- Add CDN for assets
- Implement caching headers

---

## 📝 Maintenance

### Regular Tasks

- **Backup data:** `data/questions.json`
- **Update dependencies:** `pnpm update`
- **Run tests:** Ensure green before deploying
- **Check logs:** Monitor for errors
- **Review questions:** Admin dashboard

### Version Control

- **Main branch:** Production-ready code
- **Feature branches:** New features
- **Never commit:** `.env`, `/node_modules/`, `/coverage/`, `/data/questions.json` (production)

---

## 🎓 Learning Resources

- [Express.js Guide](https://expressjs.com/en/starter/installing.html)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [MDN Web Docs](https://developer.mozilla.org/)

---

**Questions?** Check [CONTRIBUTING.md](CONTRIBUTING.md) or open an issue.
