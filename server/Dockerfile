FROM node:16 as build-stage
ENV NODE_ENV development
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn --pure-lockfile
COPY . .
RUN yarn compile 


# production stage
FROM node:16 as production-stage
ENV NODE_ENV production
WORKDIR /app
RUN apt-get update && apt-get install -y netcat && rm -rf /var/lib/apt/lists/*
COPY --from=build-stage /app/dist /app
COPY --from=build-stage /app/node_modules /node_modules
COPY --from=build-stage /app/package.json ./

EXPOSE 4000
CMD [ "node", "app.js" ]
