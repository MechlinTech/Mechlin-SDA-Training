/**
 * ============================================================
 * File: ai.controller.js
 * Description:
 * Handles incoming AI API requests and communicates with
 * the AI service.
 * ============================================================
 */

const aiService = require("../services/ai.service");
const Task = require("../models/task.model");
/**
 * Chat with AI
 * POST /api/ai/chat
 */
const chat = async (req, res) => {
    try {
        const { message } = req.body;

        if (!message || !message.trim()) {
            return res.status(400).json({
                success: false,
                message: "Message is required.",
            });
        }

        const response = await aiService.chat(message);

        return res.status(200).json({
            success: true,
            response: response.text,
        });
    } catch (error) {
        console.error("AI Controller Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
const summarize = async (req, res) => {
    try {
        const { text } = req.body;

        const result = await aiService.summarize(text);

        res.json({
            success: true,
            response: result.text,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

const generate = async (req, res) => {
    try {
        const { prompt } = req.body;

        const result = await aiService.generate(prompt);

        res.json({
            success: true,
            response: result.text,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

const recommendations = async (req, res) => {
    try {
        const tasks = await Task.find({
            owner: req.user.id,
        });

        const result = await aiService.recommend(tasks);

        res.json({
            success: true,
            response: result.text,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

module.exports = {
    chat,
    summarize,
    generate,
    recommendations,
};