const rateLimit = require("express-rate-limit");

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // max 5 login attempts
  message: {
    success: false,
    message: "Too many login attempts. Try again after 15 minutes."
  },
  standardHeaders: true,
  legacyHeaders: false
});

module.exports = loginLimiter;