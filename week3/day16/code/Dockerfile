# Base image
FROM node:18-alpine AS base

# -------------------------
# Dependencies stage
# -------------------------
FROM base AS deps

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci --omit=dev && npm cache clean --force


# -------------------------
# Builder stage
# -------------------------
FROM base AS builder

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN npm run build


# -------------------------
# Production stage
# -------------------------
FROM node:18-alpine AS runner

WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nodejs

# Copy production dependencies
COPY --from=deps /app/node_modules ./node_modules

# Copy built application
COPY --from=builder /app/dist ./dist

# Copy package metadata
COPY --from=builder /app/package.json ./package.json


# Copy container health check
COPY --from=builder /app/healthcheck.js ./healthcheck.js

# Create required directories
RUN mkdir -p logs uploads \
    && chown -R nodejs:nodejs /app

# Run as non-root user
USER nodejs

# Application port
EXPOSE 3000

# Container health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node healthcheck.js

# Start application
CMD ["node", "dist/index.js"]