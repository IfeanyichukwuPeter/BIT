const request = require("supertest");
const fs = require("fs");
const path = require("path");
const app = require("../server/app");

const TEST_DATA_FILE = path.join(__dirname, "..", "data", "questions.json");
let originalData = [];
let authToken = "";

describe("Questions API - E2E Tests", () => {
  // Backup original data before tests
  beforeAll(() => {
    if (fs.existsSync(TEST_DATA_FILE)) {
      originalData = JSON.parse(fs.readFileSync(TEST_DATA_FILE, "utf8"));
    }
  });

  // Restore original data after tests
  afterAll(() => {
    fs.writeFileSync(TEST_DATA_FILE, JSON.stringify(originalData, null, 2));
  });

  // Get auth token before protected operations
  beforeEach(async () => {
    const response = await request(app)
      .post("/api/admin/login")
      .send({
        username: "admin",
        password: "BITadmin123"
      });
    authToken = response.body.token;
  });

  describe("GET /api/questions", () => {
    it("should return all questions", async () => {
      const response = await request(app)
        .get("/api/questions")
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it("should filter questions by status=answered", async () => {
      const response = await request(app)
        .get("/api/questions?status=answered")
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      response.body.forEach(q => {
        expect(q.status).toBe("answered");
      });
    });

    it("should filter questions by status=pending", async () => {
      const response = await request(app)
        .get("/api/questions?status=pending")
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      response.body.forEach(q => {
        expect(q.status).toBe("pending");
      });
    });
  });

  describe("POST /api/questions", () => {
    it("should create a new question with name", async () => {
      const newQuestion = {
        name: "Test User",
        question: "This is a test question?"
      };

      const response = await request(app)
        .post("/api/questions")
        .send(newQuestion)
        .expect(201);

      expect(response.body).toHaveProperty("id");
      expect(response.body).toHaveProperty("name", "Test User");
      expect(response.body).toHaveProperty("question", "This is a test question?");
      expect(response.body).toHaveProperty("answer", "");
      expect(response.body).toHaveProperty("status", "pending");
    });

    it("should create a question as Anonymous when name is empty", async () => {
      const newQuestion = {
        name: "",
        question: "Anonymous question?"
      };

      const response = await request(app)
        .post("/api/questions")
        .send(newQuestion)
        .expect(201);

      expect(response.body).toHaveProperty("name", "Anonymous");
      expect(response.body).toHaveProperty("question", "Anonymous question?");
    });

    it("should create a question as Anonymous when name is missing", async () => {
      const newQuestion = {
        question: "No name question?"
      };

      const response = await request(app)
        .post("/api/questions")
        .send(newQuestion)
        .expect(201);

      expect(response.body).toHaveProperty("name", "Anonymous");
    });

    it("should fail when question is missing", async () => {
      const response = await request(app)
        .post("/api/questions")
        .send({ name: "Test User" })
        .expect(400);

      expect(response.body).toHaveProperty("error", "Question is required.");
    });

    it("should fail when question is empty string", async () => {
      const response = await request(app)
        .post("/api/questions")
        .send({ name: "Test User", question: "" })
        .expect(400);

      expect(response.body).toHaveProperty("error", "Question is required.");
    });

    it("should trim whitespace from question", async () => {
      const response = await request(app)
        .post("/api/questions")
        .send({ question: "  Whitespace question?  " })
        .expect(201);

      expect(response.body.question).toBe("Whitespace question?");
    });
  });

  describe("PATCH /api/questions/:id", () => {
    let questionId;

    beforeEach(async () => {
      // Create a question first
      const response = await request(app)
        .post("/api/questions")
        .send({
          name: "Test",
          question: "Question to update?"
        });
      questionId = response.body.id;
    });

    it("should update question answer with valid token", async () => {
      const response = await request(app)
        .patch(`/api/questions/${questionId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({ answer: "This is the answer." })
        .expect(200);

      expect(response.body).toHaveProperty("id", questionId);
      expect(response.body).toHaveProperty("answer", "This is the answer.");
      expect(response.body).toHaveProperty("status", "answered");
    });

    it("should fail without authentication token", async () => {
      const response = await request(app)
        .patch(`/api/questions/${questionId}`)
        .send({ answer: "Unauthorized answer" })
        .expect(401);

      expect(response.body).toHaveProperty("error");
    });

    it("should fail with invalid token", async () => {
      const response = await request(app)
        .patch(`/api/questions/${questionId}`)
        .set("Authorization", "Bearer invalidtoken123")
        .send({ answer: "Unauthorized answer" })
        .expect(401);

      expect(response.body).toHaveProperty("error");
    });

    it("should return 404 for non-existent question", async () => {
      const response = await request(app)
        .patch("/api/questions/999999999")
        .set("Authorization", `Bearer ${authToken}`)
        .send({ answer: "Answer to nothing" })
        .expect(404);

      expect(response.body).toHaveProperty("error", "Question not found.");
    });

    it("should trim whitespace from answer", async () => {
      const response = await request(app)
        .patch(`/api/questions/${questionId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({ answer: "  Trimmed answer  " })
        .expect(200);

      expect(response.body.answer).toBe("Trimmed answer");
    });
  });

  describe("DELETE /api/questions/:id", () => {
    let questionId;

    beforeEach(async () => {
      // Create a question first
      const response = await request(app)
        .post("/api/questions")
        .send({
          name: "Test",
          question: "Question to delete?"
        });
      questionId = response.body.id;
    });

    it("should delete question with valid token", async () => {
      await request(app)
        .delete(`/api/questions/${questionId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(204);

      // Verify it's deleted
      const questions = await request(app).get("/api/questions");
      const found = questions.body.find(q => q.id === questionId);
      expect(found).toBeUndefined();
    });

    it("should fail without authentication token", async () => {
      const response = await request(app)
        .delete(`/api/questions/${questionId}`)
        .expect(401);

      expect(response.body).toHaveProperty("error");
    });

    it("should fail with invalid token", async () => {
      const response = await request(app)
        .delete(`/api/questions/${questionId}`)
        .set("Authorization", "Bearer invalidtoken123")
        .expect(401);

      expect(response.body).toHaveProperty("error");
    });

    it("should return 404 for non-existent question", async () => {
      const response = await request(app)
        .delete("/api/questions/999999999")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(404);

      expect(response.body).toHaveProperty("error", "Question not found.");
    });
  });

  describe("Integration - Full workflow", () => {
    it("should handle complete question lifecycle", async () => {
      // 1. Create a question
      const createResponse = await request(app)
        .post("/api/questions")
        .send({
          name: "Integration Test",
          question: "Full lifecycle test?"
        })
        .expect(201);

      const questionId = createResponse.body.id;
      expect(createResponse.body.status).toBe("pending");

      // 2. Verify it appears in pending questions
      const pendingResponse = await request(app)
        .get("/api/questions?status=pending")
        .expect(200);

      const found = pendingResponse.body.find(q => q.id === questionId);
      expect(found).toBeDefined();
      expect(found.status).toBe("pending");

      // 3. Admin answers the question
      const updateResponse = await request(app)
        .patch(`/api/questions/${questionId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({ answer: "Lifecycle complete!" })
        .expect(200);

      expect(updateResponse.body.status).toBe("answered");
      expect(updateResponse.body.answer).toBe("Lifecycle complete!");

      // 4. Verify it appears in answered questions
      const answeredResponse = await request(app)
        .get("/api/questions?status=answered")
        .expect(200);

      const answeredFound = answeredResponse.body.find(q => q.id === questionId);
      expect(answeredFound).toBeDefined();
      expect(answeredFound.status).toBe("answered");

      // 5. Admin deletes the question
      await request(app)
        .delete(`/api/questions/${questionId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(204);

      // 6. Verify it's gone
      const finalResponse = await request(app).get("/api/questions");
      const deleted = finalResponse.body.find(q => q.id === questionId);
      expect(deleted).toBeUndefined();
    });
  });
});
