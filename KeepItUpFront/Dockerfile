# Stage 1: Build the Angular app
FROM node:18 AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install project dependencies
RUN npm install

# Install Angular CLI globally to make `ng` command available
RUN npm install -g @angular/cli

# Copy the rest of the application source code
COPY . .

RUN npm run build -- --configuration production --project keep-it-up-frontend

# Stage 2: Serve the Angular app
FROM nginx:alpine

# Copy built Angular files from the build stage
COPY --from=build /usr/share/nginx/html/keep-it-up-frontend /usr/share/nginx/html
# Copy the NGINX configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start NGINX
CMD ["nginx", "-g", "daemon off;"]
