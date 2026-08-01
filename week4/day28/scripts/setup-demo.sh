#!/bin/bash

# ==========================================================
# AI Productivity Platform
# Demo Setup Script
# Week 4 - Day 28
# ==========================================================

echo "==============================================="
echo " AI Productivity Platform Demo Setup"
echo "==============================================="

echo ""
echo "Step 1: Checking Node.js..."

node -v

echo ""
echo "Checking npm..."

npm -v

echo ""
echo "Step 2: Checking Docker..."

docker --version

echo ""
echo "Checking Docker Compose..."

docker compose version

echo ""
echo "Step 3: Checking Kubernetes..."

kubectl version --client

echo ""
echo "Step 4: Checking Git..."

git --version

echo ""
echo "==============================================="
echo "Installing Backend Dependencies"
echo "==============================================="

cd ../../day27/backend

npm install

echo ""
echo "==============================================="
echo "Installing Frontend Dependencies"
echo "==============================================="

cd ../frontend

npm install

echo ""
echo "==============================================="
echo "Checking Environment Files"
echo "==============================================="

if [ -f "../backend/.env" ]; then
    echo "Backend .env Found"
else
    echo "Backend .env Missing"
fi

echo ""

if [ -f ".env" ]; then
    echo "Frontend .env Found"
else
    echo "Frontend .env Missing"
fi

echo ""
echo "==============================================="
echo "Checking Docker Compose"
echo "==============================================="

if [ -f "../devops/docker/docker-compose.yml" ]; then
    echo "Docker Compose File Found"
else
    echo "Docker Compose File Missing"
fi

echo ""
echo "==============================================="
echo "Demo Readiness Checklist"
echo "==============================================="

echo "[ ] Backend Ready"
echo "[ ] Frontend Ready"
echo "[ ] MongoDB Connected"
echo "[ ] AI API Configured"
echo "[ ] React Native Ready"
echo "[ ] Docker Ready"
echo "[ ] Kubernetes Ready"

echo ""
echo "==============================================="
echo "Demo Preparation Completed"
echo "==============================================="

echo ""
echo "Before the presentation ensure:"
echo "1. Backend server is running"
echo "2. Frontend application is running"
echo "3. MongoDB is connected"
echo "4. Gemini API Key is configured"
echo "5. Docker containers are healthy"
echo "6. Mobile application is ready"
echo "7. Screenshots are available"
echo "8. Presentation notes are prepared"

echo ""
echo "Good Luck for your Final Presentation!"