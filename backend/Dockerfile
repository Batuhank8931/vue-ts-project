# Use an official Node.js image as a base image
FROM node:16-alpine

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY backend/package*.json ./backend/

# Install dependencies, including dev dependencies for TypeScript types
RUN cd ./backend && npm install

# Generate Prisma client
RUN cd ./backend && npx prisma generate

# Copy the rest of the application code
COPY . .

# Copy the .env file
COPY backend/.env backend/.env

# Set MySQL environment variables
ENV MYSQL_USER=root
ENV MYSQL_ROOT_PASSWORD=new_password
ENV MYSQL_HOST=localhost
ENV MYSQL_PORT=3306

# Copy the entrypoint.sh script
COPY backend/entrypoint.sh .

# Set execute permission to the entrypoint.sh script
RUN chmod +x ./entrypoint.sh

# Set the entry point
ENTRYPOINT ["sh", "./entrypoint.sh"]
