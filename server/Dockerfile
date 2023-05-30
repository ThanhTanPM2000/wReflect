FROM node:16 as build-stage
ENV NODE_ENV development

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn --pure-lockfile
COPY . .
RUN yarn prisma generate
RUN yarn build 


# production stage
FROM node:16 as production-stage
ENV NODE_ENV production
RUN npm install -g prisma

COPY --from=build-stage /app/dist /app
COPY --from=build-stage /app/node_modules /app/node_modules
COPY --from=build-stage /app/prisma /app/prisma
WORKDIR /app

EXPOSE 4000
CMD prisma migrate deploy && node app.js
