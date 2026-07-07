# Base image
FROM node:22-alpine

# Set working directory inside the container
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the project
COPY . .

# Application listens on port 5000
EXPOSE 5000

# Start the application
CMD ["npm", "start"]