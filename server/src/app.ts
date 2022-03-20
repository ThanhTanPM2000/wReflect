import dotenv from 'dotenv';
import { StatusCodes } from 'http-status-codes';
import { ApolloError } from 'apollo-server-errors';
dotenv.config();
import http from 'http';
import cors from 'cors';
import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import { execute, subscribe } from 'graphql';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { ApolloServer } from 'apollo-server-express';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { constraintDirective, constraintDirectiveTypeDefs } from 'graphql-constraint-directive';

import './prisma'; // eager load to test connection
import logger from './logger';
import config from './config';
import apiRouter from './apiRouter';
import { resolvers, typeDefs } from './apollo';
import sessionManager from './middleware/sessionManager';
import depthLimit from 'graphql-depth-limit';

// import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';

async function startApolloServer(typeDefs, resolvers) {
  const app = express();

  app.use(
    cors({
      origin: [config.CLIENT_URL, 'http://localhost:4000', 'https://studio.apollographql.com'],
      credentials: true,
    }),
  );
  app.use(cookieParser());
  app.use(bodyParser.json());
  app.use(express.static('public'));
  app.use(sessionManager);

  app.use('/api', apiRouter());

  let schema = makeExecutableSchema({
    typeDefs: [constraintDirectiveTypeDefs, ...typeDefs],
    resolvers,
  });
  schema = constraintDirective()(schema);

  const httpServer = http.createServer(app);
  const subscriptionServer = SubscriptionServer.create(
    {
      schema,
      execute,
      subscribe,
    },
    {
      server: httpServer,
      path: '/graphql',
    },
  );

  const server = new ApolloServer({
    schema,
    context: ({ req, res }) => ({ req, res }),
    formatError: (err) => {
      const errorsList = ['403', '404'];
      // if(err.extensions?.code === "INTERNAL_SERVER_ERROR") {
      //   return new ApolloError(``)
      // }
      if (err.extensions?.code === `BAD_USER_INPUT`) {
        return new ApolloError(`Invalid argument value`, `${StatusCodes.BAD_REQUEST}`, {
          messageDetail: err.message,
        });
      } else if (errorsList.includes(err?.extensions?.code)) return err;
      else {
        return new ApolloError('Something failed with server', `${StatusCodes.INTERNAL_SERVER_ERROR}`, {
          messageDetail: err.message,
        });
      }
    },
    validationRules: [depthLimit(10)],
    introspection: process.env.NODE_ENV !== 'production',
    plugins: [
      {
        async serverWillStart() {
          return {
            async drainServer() {
              subscriptionServer.close();
            },
          };
        },
      },
    ],
  });
  await server.start();

  server.applyMiddleware({
    app,
    cors: {
      origin: [config.CLIENT_URL, 'http://localhost:4000'],
      credentials: true,
    },
  });

  const port = config.PORT || 4000;

  await new Promise<void>((resolve) => httpServer.listen({ port }, resolve));
  logger.info(`server is listening on ${config.SERVER_URL}`);
}

startApolloServer(typeDefs, resolvers);
