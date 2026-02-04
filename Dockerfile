FROM node:25-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:25-alpine AS production

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

COPY --from=builder /app/dist ./dist

ENV PORT=3456
ENV NODE_ENV=production

EXPOSE 3456

USER node

CMD ["node", "dist/server.js"]
