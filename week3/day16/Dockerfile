# Use lightweight Node.js image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy Week 2 backend package files
COPY week2/day8/package*.json ./

# Install dependencies
RUN npm install

# Copy Week 2 backend source
COPY week2/day8 .

# Expose application port
EXPOSE 3000

# Start the backend
CMD ["npm", "start"]