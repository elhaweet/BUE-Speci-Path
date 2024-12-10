# Use official Node.js image as the base image
FROM node:18-alpine

# Set working directory in the container
WORKDIR /app/backend

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the backend code
COPY . .

# Expose the port the app runs on
EXPOSE 5000

# Command to run the backend
CMD ["node", "server.js"]