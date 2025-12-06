FROM node:18-alpine

WORKDIR /app/frontend

# Copy package files
COPY apps/frontend/package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY apps/frontend/src ./src
COPY apps/frontend/index.html ./
COPY apps/frontend/tsconfig*.json ./
COPY apps/frontend/vite.config.ts ./

EXPOSE 5173

CMD ["npm", "run", "dev"]
