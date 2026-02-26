const request = require("supertest");
const app = require("../server/app");

describe("Server Health", () => {
  it("should serve static files", async () => {
    const response = await request(app)
      .get("/index.html")
      .expect(200);

    expect(response.text).toContain("BIT Children Ministry");
  });

  it("should return 404 for non-existent routes", async () => {
    await request(app)
      .get("/api/nonexistent")
      .expect(404);
  });
});
