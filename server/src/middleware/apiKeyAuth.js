const config = require("../../config");

const apiKeyMiddleware = (req, res, next) => {
  const apiKey = req.get("x-api-key");

  if (!apiKey || apiKey !== config.api.key) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  next();
};

module.exports = apiKeyMiddleware;
