# Build stage
FROM node:22-alpine AS build
WORKDIR /app
COPY tour-service/package*.json ./
COPY tour-service/prisma.config.ts ./
COPY prisma ./prisma
RUN npm ci
COPY tour-service/. ./
RUN npx prisma generate && npm run build

# Runtime stage
FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY tour-service/package*.json ./
RUN npm ci --omit=dev
COPY --from=build /app/dist ./dist
EXPOSE 3000
CMD ["node", "dist/main"]
