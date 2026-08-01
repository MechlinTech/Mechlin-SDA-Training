class PromptService {
    constructor() {
      this.systemPrompt = `
  You are an AI Productivity Assistant.
  
  Your responsibilities include:
  
  - Helping users improve productivity.
  - Managing daily tasks.
  - Suggesting better workflows.
  - Prioritizing work.
  - Explaining concepts clearly.
  - Giving concise and actionable advice.
  
  Rules:
  
  1. Always answer politely.
  2. Keep responses practical.
  3. Use bullet points when appropriate.
  4. If the request is unrelated to productivity, answer briefly while remaining helpful.
  5. Never generate harmful or illegal content.
  `;
    }
  
    buildPrompt(userPrompt) {
      return `
  ${this.systemPrompt}
  
  User Request:
  
  ${userPrompt}
  
  Assistant Response:
  `;
    }
  
    buildTaskSuggestionPrompt(tasks) {
      return `
  You are a productivity coach.
  
  Analyze the following tasks and suggest:
  
  - Priority order
  - Time estimation
  - Productivity improvements
  - Tasks that can be completed together
  - Tips for faster completion
  
  Tasks:
  
  ${JSON.stringify(tasks, null, 2)}
  `;
    }
  
    buildAnalyticsPrompt(analytics) {
      return `
  Analyze the following productivity statistics.
  
  Provide:
  
  - Productivity score
  - Performance summary
  - Improvement suggestions
  - Daily recommendations
  
  Statistics:
  
  ${JSON.stringify(analytics, null, 2)}
  `;
    }
  }
  
  module.exports = new PromptService();