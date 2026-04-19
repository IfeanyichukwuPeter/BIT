# 📡 API Documentation

Complete reference for the BIT Children Ministry API.

**Base URL:** `http://localhost:3000/api`  
**Production URL:** `https://your-domain.com/api`

---

## 📋 Table of Contents

- [Authentication](#authentication)
- [Questions](#questions)
- [Response Formats](#response-formats)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)

---

## 🔐 Authentication

### Login

Authenticate to get an access token for protected endpoints.

**Endpoint:** `POST /api/admin/login`

**Request:**
```http
POST /api/admin/login
Content-Type: application/json

{
  "username": "admin",
  "password": "BITadmin123"
}
```

**Success Response (200):**
```json
{
  "token": "4f8a7b3e9c2d1a5f6g8h9i0j",
  "message": "Login successful."
}
```

**Error Response (401):**
```json
{
  "error": "Invalid username or password."
}
```

**Usage:**
Store the token and include it in subsequent requests:
```http
Authorization: Bearer 4f8a7b3e9c2d1a5f6g8h9i0j
```

---

## ❓ Questions

### Get All Questions

Retrieve all questions, optionally filtered by status.

**Endpoint:** `GET /api/questions`

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `status` | string | No | Filter by status: `answered` or `pending` |

**Request Examples:**

```http
# Get all questions
GET /api/questions

# Get only answered questions
GET /api/questions?status=answered

# Get only pending questions
GET /api/questions?status=pending
```

**Success Response (200):**
```json
[
  {
    "id": 1709000000000,
    "name": "Ada",
    "question": "What time do programs start on Sundays?",
    "answer": "We start at 9:00 AM after first service.",
    "status": "answered"
  },
  {
    "id": 1709000005000,
    "name": "Anonymous",
    "question": "Is there a registration fee?",
    "answer": "",
    "status": "pending"
  }
]
```

**Response Fields:**
| Field | Type | Description |
|-------|------|-------------|
| `id` | number | Unique identifier (timestamp) |
| `name` | string | Submitter's name or "Anonymous" |
| `question` | string | The question text |
| `answer` | string | Admin's answer (empty if pending) |
| `status` | string | Either "answered" or "pending" |

---

### Create Question

Submit a new question (public endpoint, no auth required).

**Endpoint:** `POST /api/questions`

**Request:**
```http
POST /api/questions
Content-Type: application/json

{
  "name": "John Doe",
  "question": "What ages can join the programs?"
}
```

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | No | Submitter's name (defaults to "Anonymous") |
| `question` | string | Yes | The question text |

**Success Response (201):**
```json
{
  "id": 1709012345678,
  "name": "John Doe",
  "question": "What ages can join the programs?",
  "answer": "",
  "status": "pending"
}
```

**Error Response (400):**
```json
{
  "error": "Question is required."
}
```

**Examples:**

```javascript
// With name
fetch('/api/questions', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Mary',
    question: 'When is the next event?'
  })
});

// Anonymous (no name)
fetch('/api/questions', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    question: 'How can I volunteer?'
  })
});
```

---

### Update Question (Admin Only)

Answer a question or update an existing answer.

**Endpoint:** `PATCH /api/questions/:id`

**Authentication:** Required (Bearer token)

**Request:**
```http
PATCH /api/questions/1709012345678
Authorization: Bearer 4f8a7b3e9c2d1a5f6g8h9i0j
Content-Type: application/json

{
  "answer": "We welcome children ages 5-15 to our programs!"
}
```

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `answer` | string | Yes | The answer to the question |

**Success Response (200):**
```json
{
  "id": 1709012345678,
  "name": "John Doe",
  "question": "What ages can join the programs?",
  "answer": "We welcome children ages 5-15 to our programs!",
  "status": "answered"
}
```

**Error Responses:**

**401 Unauthorized:**
```json
{
  "error": "Unauthorized. Invalid or missing token."
}
```

**404 Not Found:**
```json
{
  "error": "Question not found."
}
```

**Example:**
```javascript
const token = localStorage.getItem('adminToken');

fetch('/api/questions/1709012345678', {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    answer: 'Programs start at 9:00 AM on Sundays.'
  })
});
```

---

### Delete Question (Admin Only)

Remove a question permanently.

**Endpoint:** `DELETE /api/questions/:id`

**Authentication:** Required (Bearer token)

**Request:**
```http
DELETE /api/questions/1709012345678
Authorization: Bearer 4f8a7b3e9c2d1a5f6g8h9i0j
```

**Success Response (204):**
```
No content (successful deletion)
```

**Error Responses:**

**401 Unauthorized:**
```json
{
  "error": "Unauthorized. Invalid or missing token."
}
```

**404 Not Found:**
```json
{
  "error": "Question not found."
}
```

**Example:**
```javascript
const token = localStorage.getItem('adminToken');

fetch('/api/questions/1709012345678', {
  method: 'DELETE',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

---

## 📊 Response Formats

### Success Responses

All successful responses follow this structure:

**Single Resource:** Object containing the resource
```json
{
  "id": 123,
  "field": "value"
}
```

**Multiple Resources:** Array of objects
```json
[
  { "id": 1, "field": "value" },
  { "id": 2, "field": "value" }
]
```

### Error Responses

All errors return JSON with an `error` field:

```json
{
  "error": "Description of what went wrong"
}
```

---

## ⚠️ Error Handling

### HTTP Status Codes

| Code | Meaning | When It Happens |
|------|---------|-----------------|
| 200 | OK | Successful GET/PATCH |
| 201 | Created | Successful POST |
| 204 | No Content | Successful DELETE |
| 400 | Bad Request | Invalid input/missing required fields |
| 401 | Unauthorized | Invalid or missing authentication token |
| 404 | Not Found | Resource doesn't exist |
| 500 | Server Error | Internal server error |

### Common Error Scenarios

**Missing Required Field:**
```json
{
  "error": "Question is required."
}
```

**Authentication Failed:**
```json
{
  "error": "Invalid username or password."
}
```

**Token Invalid:**
```json
{
  "error": "Unauthorized. Invalid or missing token."
}
```

**Resource Not Found:**
```json
{
  "error": "Question not found."
}
```

---

## 🔒 Rate Limiting

Currently, no rate limiting is implemented. 

**Recommended for production:**
- 100 requests per 15 minutes for public endpoints
- 500 requests per 15 minutes for authenticated endpoints

---

## 💻 Code Examples

### JavaScript (Fetch API)

**Get all questions:**
```javascript
async function getQuestions() {
  const response = await fetch('/api/questions');
  const questions = await response.json();
  return questions;
}
```

**Get answered questions:**
```javascript
async function getAnsweredQuestions() {
  const response = await fetch('/api/questions?status=answered');
  return response.json();
}
```

**Submit a question:**
```javascript
async function submitQuestion(name, question) {
  const response = await fetch('/api/questions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, question })
  });
  
  if (!response.ok) {
    throw new Error('Failed to submit question');
  }
  
  return response.json();
}
```

**Admin login:**
```javascript
async function adminLogin(username, password) {
  const response = await fetch('/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  
  if (!response.ok) {
    throw new Error('Login failed');
  }
  
  const data = await response.json();
  localStorage.setItem('adminToken', data.token);
  return data;
}
```

**Answer a question (admin):**
```javascript
async function answerQuestion(id, answer) {
  const token = localStorage.getItem('adminToken');
  
  const response = await fetch(`/api/questions/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ answer })
  });
  
  return response.json();
}
```

### cURL Examples

**Get all questions:**
```bash
curl http://localhost:3000/api/questions
```

**Submit a question:**
```bash
curl -X POST http://localhost:3000/api/questions \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","question":"Sample question?"}'
```

**Admin login:**
```bash
curl -X POST http://localhost:3000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"BITadmin123"}'
```

**Answer question (replace TOKEN):**
```bash
curl -X PATCH http://localhost:3000/api/questions/1709012345678 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"answer":"This is the answer."}'
```

**Delete question:**
```bash
curl -X DELETE http://localhost:3000/api/questions/1709012345678 \
  -H "Authorization: Bearer TOKEN"
```

---

## 🧪 Testing with Postman

1. **Import Collection:**
   - Create new collection "BIT API"
   - Add requests for each endpoint

2. **Set Environment Variables:**
   - `base_url`: `http://localhost:3000`
   - `token`: (set after login)

3. **Test Flow:**
   - Login → Copy token
   - Create question
   - Update question with token
   - Delete question with token

---

## 📝 Notes

- All endpoints return JSON
- Timestamps are in milliseconds (Unix epoch)
- Tokens don't expire (in current implementation)
- Questions are stored in `data/questions.json`
- IDs are generated using `Date.now()`

---

## 🔮 Future Enhancements

Planned API features:

- [ ] Token expiration and refresh
- [ ] Pagination for questions
- [ ] Search/filter by keywords
- [ ] Question categories/tags
- [ ] Email notifications
- [ ] Bulk operations
- [ ] WebSocket support for real-time updates
- [ ] API versioning

---

**Last Updated:** February 26, 2026  
**API Version:** 1.0.0
