import { StatusCodes } from 'http-status-codes';
import { ApolloError } from 'apollo-server-errors';
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';

import sessionManager from './middleware/sessionManager';
import './prisma'; // eager load to test connection
import config from './config';
import apiRouter from './apiRouter';

import { ApolloServer } from 'apollo-server-express';
// import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';

import http from 'http';

import { resolvers, typeDefs } from './apollo';
import logger from './logger';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { constraintDirective, constraintDirectiveTypeDefs } from 'graphql-constraint-directive';

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
  const server = new ApolloServer({
    schema,

    context: ({ req, res }) => ({ req, res }),
    formatError: (err) => {
      if (err.extensions?.code === `INTERNAL_SERVER_ERROR`) {
        return new ApolloError('Something failed with server', `${StatusCodes.INTERNAL_SERVER_ERROR}`, {
          messageDetail: err.message,
        });
      } else if (err.extensions?.code === `BAD_USER_INPUT`) {
        return new ApolloError(`Invalid argument value`, `${StatusCodes.BAD_REQUEST}`, {
          messageDetail: err.message,
        });
      }
      return err;
    },
    // plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
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

  // httpServer.listen(port, () => {
  //   logger.info(`server is listening on ${config.SERVER_URL}`);
  // });
  await new Promise<void>((resolve) => httpServer.listen({ port: 4000 }, resolve));
  // console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
  logger.info(`server is listening on ${config.SERVER_URL}`);
}

startApolloServer(typeDefs, resolvers);
