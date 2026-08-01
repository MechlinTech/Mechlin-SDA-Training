/**
 * ============================================================
 * File: ai.service.js
 * Description:
 * Handles all AI-related operations using Google's Gemini API.
 * This service is responsible for sending prompts to Gemini
 * and returning AI-generated responses.
 * ============================================================
 */

const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

class AIService {
    /**
     * Generate AI response
     * @param {string} message
     * @returns {Promise<string>}
     */
    async chat(message) {
        try {
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: message,
            });

            return {
                success: true,
                text: response.text,
            };
        } catch (error) {
            console.error("Gemini Error:", error);

            throw new Error("Failed to generate AI response.");
        }

    }
    async summarize(text) {
        return this.chat(`Summarize the following:\n\n${text}`);
    }

    async generate(prompt) {
        return this.chat(prompt);
    }

    async recommend(tasks) {
        return this.chat(
            `Based on these tasks, give productivity recommendations:\n${JSON.stringify(tasks)}`
        );
    }
}

module.exports = new AIService();