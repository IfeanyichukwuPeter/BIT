const request = require("supertest");
const app = require("../server/app");

describe("Auth API - E2E Tests", () => {
  describe("POST /api/admin/login", () => {
    it("should login successfully with valid credentials", async () => {
      const response = await request(app)
        .post("/api/admin/login")
        .send({
          username: "admin",
          password: "BITadmin123"
        })
        .expect(200);

      expect(response.body).toHaveProperty("token");
      expect(response.body).toHaveProperty("message", "Login successful.");
      expect(typeof response.body.token).toBe("string");
      expect(response.body.token.length).toBeGreaterThan(0);
    });

    it("should fail with invalid username", async () => {
      const response = await request(app)
        .post("/api/admin/login")
        .send({
          username: "wronguser",
          password: "BITadmin123"
        })
        .expect(401);

      expect(response.body).toHaveProperty("error", "Invalid username or password.");
    });

    it("should fail with invalid password", async () => {
      const response = await request(app)
        .post("/api/admin/login")
        .send({
          username: "admin",
          password: "wrongpassword"
        })
        .expect(401);

      expect(response.body).toHaveProperty("error", "Invalid username or password.");
    });

    it("should fail with missing credentials", async () => {
      const response = await request(app)
        .post("/api/admin/login")
        .send({})
        .expect(401);

      expect(response.body).toHaveProperty("error");
    });

    it("should fail with only username", async () => {
      const response = await request(app)
        .post("/api/admin/login")
        .send({ username: "admin" })
        .expect(401);

      expect(response.body).toHaveProperty("error");
    });

    it("should fail with only password", async () => {
      const response = await request(app)
        .post("/api/admin/login")
        .send({ password: "BITadmin123" })
        .expect(401);

      expect(response.body).toHaveProperty("error");
    });
  });
});
