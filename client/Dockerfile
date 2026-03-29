# Stage 1: Build the React Application
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Pass build argument for API URL
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL

RUN npm run build

# Stage 2: Serve the React application using Nginx
FROM nginx:alpine

# Copy the build output to replace the default nginx contents.
COPY --from=build /app/build /usr/share/nginx/html

# Overwrite default nginx config to support React client-side routing
RUN rm /etc/nginx/conf.d/default.conf
RUN echo "server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files \$uri \$uri/ /index.html; \
    } \
}" > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
