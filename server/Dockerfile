FROM node:16 as build-stage
ENV NODE_ENV development
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn --pure-lockfile
COPY . .
RUN yarn build 


# production stage
FROM node:16 as production-stage
ENV NODE_ENV production
# RUN apt-get update && apt-get install -y netcat && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY --from=build-stage /app/dist ./
COPY --from=build-stage /app/docker-entrypoint.sh /docker-entrypoint.sh
COPY --from=build-stage /app/node_modules /node_modules
COPY --from=build-stage /app/prisma /prisma
COPY --from=build-stage /app/package.json /package.json
EXPOSE 4000
