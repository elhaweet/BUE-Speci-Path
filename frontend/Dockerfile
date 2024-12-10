# Use official Node.js image as the base image
FROM node:18-alpine

# Set working directory in the container
WORKDIR /app/frontend

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the frontend code
COPY . .

# Build the frontend application
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Command to run the frontend
CMD ["npm", "run", "dev"]