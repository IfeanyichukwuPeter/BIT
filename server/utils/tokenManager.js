const { randomBytes } = require("crypto");

// Token storage (in production, use a database or Redis)
const tokens = new Map();

function generateToken() {
  return randomBytes(16).toString("hex");
}

function verifyToken(token) {
  return tokens.has(token);
}

function storeToken(token, metadata = {}) {
  tokens.set(token, { ...metadata, createdAt: Date.now() });
}

function revokeToken(token) {
  tokens.delete(token);
}

module.exports = {
  generateToken,
  verifyToken,
  storeToken,
  revokeToken
};
