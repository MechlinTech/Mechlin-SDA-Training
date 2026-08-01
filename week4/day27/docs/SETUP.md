# AI Productivity Capstone - Setup Guide

## 1. Introduction

This guide explains how to set up and run the AI Productivity Capstone project on a local machine.

---

# 2. Prerequisites

Before starting, ensure the following software is installed:

- Node.js (v20 or later)
- npm
- Git
- MongoDB Atlas Account
- Visual Studio Code
- Docker (Optional)
- Kubernetes (Optional)

---

# 3. Clone Repository

```bash
git clone https://github.com/<your-github-username>/Mechlin-SDA-Training.git
```

Move into the project directory.

```bash
cd Mechlin-SDA-Training/week4/day27
```

---

# 4. Backend Setup

Move to backend folder.

```bash
cd backend
```

Install dependencies.

```bash
npm install
```

Create a `.env` file.

Example:

```env
PORT=5000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

GEMINI_API_KEY=your_gemini_api_key
```

Run backend server.

```bash
npm run dev
```

Backend runs on

```
http://localhost:5000
```

---

# 5. Frontend Setup

Open another terminal.

```bash
cd frontend
```

Install dependencies.

```bash
npm install
```

Run Vite.

```bash
npm run dev
```

Frontend runs on

```
http://localhost:5173
```

---

# 6. API Configuration

Frontend communicates with backend using Axios.

Base URL

```
http://localhost:5000/api
```

---

# 7. Authentication

Register a new account.

↓

Login.

↓

JWT Token is generated.

↓

Frontend stores JWT.

↓

Protected APIs become accessible.

---

# 8. Available Features

After setup the application supports:

- User Registration
- User Login
- Dashboard
- Task Management
- Analytics
- AI Assistant
- Logout

---

# 9. Docker Setup (Optional)

Move to devops/docker

```bash
cd ../devops/docker
```

Build containers.

```bash
docker compose up --build
```

---

# 10. Kubernetes (Optional)

Apply configuration.

```bash
kubectl apply -f .
```

---

# 11. Folder Structure

week4/day27/

```
backend/
frontend/
docs/
devops/
mobile/
scripts/
```

---

# 12. Troubleshooting

### MongoDB Connection Error

Verify:

- Internet connection
- MongoDB Atlas whitelist
- Connection string

---

### JWT Error

Verify:

- JWT_SECRET exists in .env

---

### Gemini Error

Verify:

- GEMINI_API_KEY
- API quota
- Internet connection

---

### Port Already In Use

Change PORT in backend .env

or stop existing process.

---

# 13. Useful Commands

Backend

```bash
npm run dev
```

Frontend

```bash
npm run dev
```

Install Packages

```bash
npm install
```

Build Frontend

```bash
npm run build
```

---

# 14. Conclusion

The project is now ready for development and testing. Both frontend and backend communicate through REST APIs, while MongoDB stores application data and Gemini powers the AI Assistant.