FROM node:16 as build-stage
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn --pure-lockfile --network-timeout 100000
COPY . .
RUN yarn build

# Production stage
FROM nginx:stable as production-stage
# Copy the custom Nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build-stage /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]


