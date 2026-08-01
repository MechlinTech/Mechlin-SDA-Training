const {
    GoogleGenerativeAI,
  } = require("@google/generative-ai");
  
  const config = require("../config/gemini.config");
  
  const promptService = require("./prompt.service");
  
  class GeminiService {
    constructor() {
      this.genAI = new GoogleGenerativeAI(config.apiKey);
  
      this.model = this.genAI.getGenerativeModel({
        model: config.model,
        generationConfig: config.generationConfig,
        safetySettings: config.safetySettings,
      });
    }
  
    async generateResponse(userPrompt) {
      try {
        const finalPrompt =
          promptService.buildPrompt(userPrompt);
  
        const result =
          await this.model.generateContent(finalPrompt);
  
        const response =
          await result.response;
  
        return {
          success: true,
  
          response: response.text(),
        };
      } catch (error) {
        console.error(
          "Gemini Service Error:",
          error.message
        );
  
        return {
          success: false,
  
          response:
            "Unable to generate AI response.",
  
          error: error.message,
        };
      }
    }
  
    async healthCheck() {
      try {
        await this.model.generateContent(
          "Hello"
        );
  
        return true;
      } catch (error) {
        return false;
      }
    }
  }
  
  module.exports = new GeminiService();