module.exports = {
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.test.js"],
  collectCoverageFrom: [
    "server/**/*.js",
    "!server/server.js"
  ],
  coverageDirectory: "coverage",
  verbose: true,
  testTimeout: 10000
};
