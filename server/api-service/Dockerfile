# ── API Service — Node.js + Express ───────────────────────────────
FROM node:20-alpine

WORKDIR /app

# Install dependencies first (better layer caching)
COPY package*.json ./
RUN npm install --production

# Copy source
COPY . .

# Create log file if it doesn't exist
RUN mkdir -p src/logstreamer/logs && \
    touch src/logstreamer/logs/server.log

EXPOSE 5001

CMD ["node", "server.js"]