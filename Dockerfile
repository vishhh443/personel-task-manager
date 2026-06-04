# Build stage
FROM node:20-alpine AS builder
WORKDIR /usr/src/app

# Install client dependencies and build frontend
COPY client/package*.json ./client/
RUN cd client && npm install
COPY client ./client
RUN cd client && npm run build

# Install server dependencies
COPY server/package*.json ./server/
RUN cd server && npm install --production
COPY server ./server

# Production stage
FROM node:20-alpine AS production
WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/server ./server
COPY --from=builder /usr/src/app/client/dist ./client/dist

ENV NODE_ENV=production
EXPOSE 5000

CMD ["node", "server/app.js"]
