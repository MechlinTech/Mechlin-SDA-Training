require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('./middleware/oauth');
const authRoutes = require('./routes/authRoutes');
const { AppError } = require('./middleware/errorHandler');
const { setupSwagger } = require('./middleware/swagger');
const userRoutes = require('./routes/userRoutes');
const { monitoringMiddleware, healthCheck, metrics } = require('./middleware/monitoring');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const { getEnvironment } = require('./config/environments');
const systemHealthCheck = require('./monitoring/health-check');
const envConfig = getEnvironment();
const app = express();

const PORT = envConfig.port;
const secretsManager = require('./config/secrets');

// Validate required secrets on startup
try {
  secretsManager.validateSecrets();
  console.log('✅ All required secrets are configured');
} catch (error) {
  console.error('❌ Secret validation failed:', error.message);
  process.exit(1); // Stop app immediately
}

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
  .connect(envConfig.database.mongodb.uri)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => {
    console.error('❌ MongoDB Connection Failed:', err);
    process.exit(1);
  });

app.use(monitoringMiddleware);
app.get('/api/v1/system-health', async (req, res) => {
  const result = await systemHealthCheck.performHealthCheck();
  res.json(result);
});
app.get('/api/v1/metrics', metrics);
app.get('/api/v1/health', async (req, res) => {
  const result = await healthCheck.performHealthCheck();
  res.json(result);
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
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/analytics', analyticsRoutes);
setupSwagger(app);
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
    error: {
      message: err.message,
      details: err.errors || null
    }
  });
});
module.exports = app;