# Production Dockerfile for Nexus E-Commerce
FROM node:20-alpine AS base

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy application files
COPY . .

# Set environment
ENV NODE_ENV=production
ENV PORT=5000

# Expose server port
EXPOSE 5000

# Run as non-root user
USER node

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/health || exit 1

# Start server
CMD ["node", "src/server.js"]
