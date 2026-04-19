# BIT Server Tests

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Test Structure

- **tests/auth.test.js** - Authentication endpoint tests
- **tests/questions.test.js** - Questions CRUD operations and integration tests
- **tests/server.test.js** - Server health and static file serving tests

## Coverage

Tests cover:
- ✅ Admin login (valid/invalid credentials)
- ✅ Question creation (with/without auth)
- ✅ Question retrieval (all/filtered by status)
- ✅ Question updates (with auth)
- ✅ Question deletion (with auth)
- ✅ Full lifecycle integration test
- ✅ Error handling and validation
