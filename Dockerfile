# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files and patches
COPY package.json pnpm-lock.yaml patches ./patches ./

# Install dependencies
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build the application (client + server)
RUN pnpm run build

# Production stage
FROM node:22-alpine

WORKDIR /app

# Copy package files for production
COPY package.json pnpm-lock.yaml ./
COPY patches ./patches

# Install production dependencies only
RUN npm install -g pnpm && pnpm install --prod --frozen-lockfile

# Copy built artifacts from builder
COPY --from=builder /app/dist ./dist

# Set environment to production
ENV NODE_ENV=production
ENV PORT=8080

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8080/api/meta-capi/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start the application using npm start
CMD ["npm", "start"]
