# Use Node.js LTS version
FROM node:18-slim

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json files
COPY package*.json ./

COPY index.js ./

COPY build ./build

# Install dependencies
RUN npm install --production

# Expose port (if needed)
EXPOSE 9000

# Run the application
CMD ["node", "index.js"]