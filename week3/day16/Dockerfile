# Use the official lightweight Node.js image.
FROM node:20-alpine

# Set the working directory inside the container.
WORKDIR /app

# Copy package files first to take advantage of Docker layer caching.
COPY package*.json ./

# Install production dependencies.
RUN npm install --omit=dev

# Copy the application source code.
COPY . .

# Document the port used by the application.
EXPOSE 3000

# Start the Node.js application.
CMD ["npm", "start"]