FROM node:18-alpine

WORKDIR /app/backend

# Copy package files
COPY apps/backend/package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY apps/backend/src ./src
COPY apps/backend/tsconfig.json ./

# Build
RUN npm run build

EXPOSE 5000

CMD ["npm", "run", "dev"]
