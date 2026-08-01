require("dotenv").config();

module.exports = {
  apiKey: process.env.GEMINI_API_KEY,

  model: "gemini-2.5-flash",

  generationConfig: {
    temperature: 0.7,

    topP: 0.95,

    topK: 40,

    maxOutputTokens: 2048,
  },

  safetySettings: [
    {
      category: "HARM_CATEGORY_HARASSMENT",
      threshold: "BLOCK_MEDIUM_AND_ABOVE",
    },

    {
      category: "HARM_CATEGORY_HATE_SPEECH",
      threshold: "BLOCK_MEDIUM_AND_ABOVE",
    },

    {
      category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
      threshold: "BLOCK_MEDIUM_AND_ABOVE",
    },

    {
      category: "HARM_CATEGORY_DANGEROUS_CONTENT",
      threshold: "BLOCK_MEDIUM_AND_ABOVE",
    },
  ],
};