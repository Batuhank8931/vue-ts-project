# Use a base image with Node.js
FROM node:16-alpine

# Set the working directory
WORKDIR ./src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install app dependencies
RUN npm install

# Install Bootstrap
RUN npm install bootstrap

# Copy the rest of the application code
COPY . .

# Expose the port your app will run on
EXPOSE 8080

# Command to run the application
CMD ["npm", "run", "serve"]
