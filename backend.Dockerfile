# Use Node.js as base image
FROM node:18

# Set working directory inside the container
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy backend source code
COPY . .

# Expose API port
EXPOSE 5000

# Start the Express server
CMD ["node", "server.js"]
