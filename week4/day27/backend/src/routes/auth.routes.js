/**
 * ----------------------------------------------------------
 * Authentication Routes
 * ----------------------------------------------------------
 * This file defines all authentication-related API routes.
 *
 * Available Routes:
 * POST /api/auth/register
 * POST /api/auth/login
 * ----------------------------------------------------------
 */

const express = require("express");
const validate = require("../middleware/validation.middleware");
const {
    registerUser,
    loginUser,
} = require("../controllers/auth.controller");

const router = express.Router();
const {
    registerValidator,
    loginValidator,
} = require("../validators/auth.validator");
// Register
router.post(
    "/register",
    registerValidator,
    validate,
    registerUser
);


// Login
router.post(
    "/login",
    loginValidator,
    validate,
    loginUser
);

module.exports = router;