# ✅ Step 1: Use Node.js as the base image to build React app
FROM node:18 AS build

# Set working directory
WORKDIR /app

# ✅ Step 2: Copy package.json and package-lock.json first (Leverages Docker caching)
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# ✅ Step 3: Copy only necessary frontend source code
COPY . . 

# Build the React app for production
RUN npm run build

# ✅ Step 4: Use Nginx as the final image to serve the built app
FROM nginx:alpine

# Set working directory
WORKDIR /usr/share/nginx/html

# Remove default Nginx static files
RUN rm -rf ./*

# ✅ Step 5: Copy React build files from Node container to Nginx
COPY --from=build /app/build ./

# ✅ Step 6: Copy custom Nginx configuration for React app
COPY nginx.conf /etc/nginx/conf.d/default.conf

# ✅ Expose the correct frontend port
EXPOSE 80

# ✅ Start Nginx
CMD ["nginx", "-g", "daemon off;"]

