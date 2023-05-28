FROM node:16 as build-stage
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn --pure-lockfile --network-timeout 100000
COPY . .
RUN yarn build

# Production stage
FROM bitnami/nginx:1.20 as production-stage
COPY --from=build-stage /app/build /app
COPY keyreply-entrypoint.sh /app
COPY nginx.conf /opt/bitnami/nginx/conf/server_blocks/default.conf
CMD ["/opt/bitnami/scripts/nginx/entrypoint.sh", "/opt/bitnami/scripts/nginx/run.sh"]

