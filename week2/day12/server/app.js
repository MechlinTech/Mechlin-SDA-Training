require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('./middleware/oauth');
const authRoutes = require('./routes/authRoutes');
const { AppError } = require('./middleware/errorHandler');

const app = express();

// ----------------------
// MIDDLEWARE
// ----------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ----------------------
// SESSION CONFIG (For OAuth)
// ----------------------
app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// ----------------------
// DATABASE CONNECTION
// ----------------------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => {
    console.error('❌ MongoDB Connection Failed:', err);
    process.exit(1);
  });

// ----------------------
// ROUTES
// ----------------------
app.get('/', (req, res) => {
  res.json({
    message: 'API v1 running',
    version: 'v1',
  });
});

app.use('/api/v1/auth', authRoutes);

// ----------------------
// 404 HANDLER
// ----------------------
app.use((req, res, next) => {
  next(new AppError(`Route ${req.originalUrl} not found`, 404));
});

// ----------------------
// GLOBAL ERROR HANDLER
// ----------------------
app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    errors: err.errors || null,
  });
});

module.exports = app;