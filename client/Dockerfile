# Step 1: Build the Vite app
FROM node:18-alpine as build

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy all files and build
COPY . .
RUN npm run build

# Step 2: Serve with nginx
FROM nginx:alpine

# Copy built files from step 1
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]