FROM node:16-alpine

# Set working directory
WORKDIR /app

# Install app dependencies
COPY package.json package-lock.json ./
RUN npm install
RUN mkdir -p node_modules/.cache && chmod -R 777 node_modules/.cache

# Copy the app's source code
COPY . .

# Expose the app on port 3000
EXPOSE 3000

# Start the development server
CMD ["npm", "start"]