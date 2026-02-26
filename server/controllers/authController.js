const { generateToken, storeToken } = require("../utils/tokenManager");
const config = require("../config");

function login(req, res) {
  const { username, password } = req.body;

  if (username === config.ADMIN_USERNAME && password === config.ADMIN_PASSWORD) {
    const token = generateToken();
    storeToken(token, { username });

    return res.json({ token, message: "Login successful." });
  }

  res.status(401).json({ error: "Invalid username or password." });
}

module.exports = {
  login
};
