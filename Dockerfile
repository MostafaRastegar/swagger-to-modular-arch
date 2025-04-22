# Build stage
FROM docker.cache.****.ir/node:20-alpine AS builder
WORKDIR /app
RUN npm config set registry https://npm.cache.****.ir
RUN npm config set strict-ssl false

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build both frontend and backend
RUN npm run build:prod

# Verify build directories
RUN echo "Checking if build directories exist:" && \
    ls -la && \
    ls -la build && \
    ls -la build-api

# Create non-root user
RUN addgroup -g 1001 nodejs && \
    adduser -D -u 1001 -G nodejs nodeuser

# Install serve for serving the frontend
RUN npm install -g serve

# Create the workspaces directory and set permissions
RUN mkdir -p workspaces && \
    chown -R nodeuser:nodejs /app

# Switch to non-root user
USER nodeuser

# Expose ports for both frontend and backend
EXPOSE 3000
EXPOSE 3001

# Start command to run both services
CMD ["sh", "-c", "node build-api/api.js & serve -s build"]