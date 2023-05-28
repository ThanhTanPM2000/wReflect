FROM node:16 as build-stage
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn --pure-lockfile --network-timeout 100000
COPY . .
RUN yarn build

# Production stage
FROM bitnami/nginx:1.20 as production-stage
# Copy the custom Nginx configuration
COPY nginx.conf /opt/bitnami/nginx/conf/server_blocks/
COPY --from=build-stage /app/build /usr/share/nginx/html
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]


