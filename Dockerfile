
FROM node:18-alpine

WORKDIR /app

# Copy package files first to leverage cache
COPY package*.json ./

# Install dependencies (will include sqlite3, express, etc)
RUN npm install

# Copy the rest of the application
COPY . .

# Create uploads directory
RUN mkdir -p uploads

# Expose port (internal)
EXPOSE 3000

# Start server
CMD ["node", "server.js"]
