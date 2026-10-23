# ==============================================================================
# Multi-Stage Production Dockerfile for Notarial Palata Telegram Bot
# Security: Runs as non-root user 'node', includes dumb-init and healthcheck
# ==============================================================================

# Stage 1: Build stage
FROM node:22-alpine AS builder

WORKDIR /usr/src/app

RUN apk add --no-cache openssl python3 make g++

COPY package*.json ./
COPY tsconfig*.json ./
COPY prisma ./prisma/

RUN npm ci

COPY src ./src

RUN npx prisma generate
RUN npm run build
RUN npm prune --production

# Stage 2: Production runtime stage
FROM node:22-alpine AS runner

WORKDIR /usr/src/app

RUN apk add --no-cache openssl curl dumb-init

ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

# Copy runtime dependencies and compiled output
COPY --chown=node:node package*.json ./
COPY --chown=node:node --from=builder /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=builder /usr/src/app/dist ./dist
COPY --chown=node:node --from=builder /usr/src/app/prisma ./prisma

USER node

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:3000/health/live || exit 1

ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["node", "dist/index.js"]
