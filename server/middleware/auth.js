const { verifyToken } = require("../utils/tokenManager");

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token || !verifyToken(token)) {
    return res.status(401).json({ error: "Unauthorized. Invalid or missing token." });
  }

  next();
}

module.exports = authMiddleware;
