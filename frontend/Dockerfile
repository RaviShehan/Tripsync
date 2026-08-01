FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3001
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
COPY --from=build --chown=nextjs:nodejs /app/.next ./.next
COPY --from=build --chown=nextjs:nodejs /app/public ./public
COPY --from=build --chown=nextjs:nodejs /app/package.json ./package.json
COPY --from=build --chown=nextjs:nodejs /app/next.config.ts ./next.config.ts
COPY --from=build --chown=nextjs:nodejs /app/tsconfig.json ./tsconfig.json
COPY --from=build --chown=nextjs:nodejs /app/node_modules ./node_modules
USER nextjs
EXPOSE 3001
CMD ["npx", "next", "start"]
