# AI Setup Guide

## Overview

This guide explains how to configure the AI module for the AI Productivity application using Google Gemini.

---

# Prerequisites

Before running the AI module, ensure the following are installed:

- Node.js 18+
- npm
- Express.js
- Google Gemini API Key
- Internet Connection

---

# Install Dependencies

Install the required packages.

```bash
npm install @google/generative-ai dotenv
```

---

# Environment Variables

Create a `.env` file in the backend root.

Example:

```env
GEMINI_API_KEY=your_gemini_api_key
```

Never commit the `.env` file to Git.

---

# Folder Structure

```
ai/

config/
services/
prompts/
examples/
docs/
```

---

# Configuration

The Gemini configuration is located at:

```
config/gemini.config.js
```

It contains:

- API Key
- Model Name
- Generation Settings
- Safety Settings

---

# Available Model

```
gemini-2.5-flash
```

You may replace it with another supported Gemini model if required.

---

# Backend Integration

Example:

```javascript
const geminiService = require("../ai/services/gemini.service");

const result = await geminiService.generateResponse(prompt);

res.json(result);
```

---

# API Endpoint

```
POST /api/ai/chat
```

Request

```json
{
  "prompt": "Suggest a study plan for today."
}
```

Response

```json
{
  "success": true,
  "response": "Here is your personalized study plan..."
}
```

---

# Running the Application

Start the backend server.

```bash
npm install

npm start
```

or

```bash
npm run dev
```

---

# Testing

Using Postman

```
POST http://localhost:5000/api/ai/chat
```

Headers

```
Authorization: Bearer <JWT_TOKEN>

Content-Type: application/json
```

Body

```json
{
  "prompt": "How can I improve productivity?"
}
```

---

# Common Issues

## Invalid API Key

Verify:

```
GEMINI_API_KEY
```

is correctly configured.

---

## Network Error

Check:

- Internet connection
- Firewall
- Gemini service availability

---

## Unauthorized

Verify:

- JWT Token
- Authentication middleware
- Authorization header

---

## Empty Response

Check:

- Prompt content
- API quota
- Gemini model configuration

---

# Best Practices

- Store API keys securely.
- Keep prompts modular.
- Validate all user input.
- Log AI errors.
- Limit prompt length.
- Protect API endpoints using JWT.
- Never expose API keys to the frontend.

---

# Security Recommendations

- Use HTTPS in production.
- Enable request rate limiting.
- Sanitize user input.
- Avoid logging sensitive information.
- Monitor API usage.

---

# Future Improvements

- Streaming AI responses
- Conversation history
- Multi-turn chat
- Function calling
- Image understanding
- Voice interaction
- AI caching using Redis

---

# Status

| Feature | Status |
|---------|--------|
| Gemini Configuration | ✅ |
| API Integration | ✅ |
| Authentication | ✅ |
| Prompt Management | ✅ |
| Documentation | ✅ |

---

End of AI Setup Guide