require("dotenv").config();

const express = require("express");
const session = require("express-session");
const passport = require("./middleware/oauth");

const authRoutes = require("./routes/authRoutes");
const { errorHandler } = require("./middleware/errorHandler");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "day12-session-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Authentication API is running",
  });
});

app.use("/api/auth", authRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Day 12 Authentication API running on port ${PORT}`);
  });
}

module.exports = app;