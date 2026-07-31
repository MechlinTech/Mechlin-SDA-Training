/**
 * ============================================================
 * File: ai.routes.js
 * Description:
 * Routes for AI features.
 * ============================================================
 */

const express = require("express");
const router = express.Router();
const {
    chat,
    summarize,
    generate,
    recommendations,
} = require("../controllers/ai.controller");
const authenticateUser = require("../middleware/auth.middleware");


// Protected AI Chat Route
router.post("/chat", authenticateUser, chat);
router.post("/summarize", authenticateUser, summarize);
router.post("/generate", authenticateUser, generate);
router.post("/recommendations", authenticateUser, recommendations);


module.exports = router;