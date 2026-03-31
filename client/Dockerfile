# Stage 1: Build the React Application
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Build the React application
RUN npm run build

# Stage 2: Serve the React application using Nginx
FROM nginx:alpine

# Copy the build output to replace the default nginx contents.
COPY --from=build /app/build /usr/share/nginx/html

# Overwrite default nginx config to serve React and proxy /api requests
RUN rm /etc/nginx/conf.d/default.conf
RUN echo "server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files \$uri \$uri/ /index.html; \
    } \
    location /api/ { \
        proxy_pass http://backend:6001/; \
        proxy_http_version 1.1; \
        proxy_set_header Upgrade \$http_upgrade; \
        proxy_set_header Connection 'upgrade'; \
        proxy_set_header Host \$host; \
        proxy_cache_bypass \$http_upgrade; \
    } \
}" > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
