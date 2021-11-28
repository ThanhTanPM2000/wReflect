import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import expressFileUpload from 'express-fileupload';
import { graphqlHTTP } from 'express-graphql';
import proxy from 'express-http-proxy';

import sessionManager from './middleware/sessionManager';
import './prisma'; // eager load to test connection
import logger from './logger';
import { unlessStartsWith } from './helpers';
import { apiPaths } from './types';
import config from './config';
import schema from './schema';
import apiRouter from './apiRouter';

const app = express();
app.use(expressFileUpload());
app.use(
  cors({
    credentials: true,
    origin: config.CLIENT_URL,
  }),
);

if (config.NODE_ENV === 'development') {
  // proxy requests to development frontend
  app.use(unlessStartsWith(apiPaths, proxy(config.CLIENT_URL)));
} else {
  // STATIC_DIR gets populated in a whatsapp-self-serve build
  // It comes from the built react folder
  // TODO: build both dashboard and server and test the routing
  app.use(unlessStartsWith(apiPaths, express.static(config.STATIC_DIR)));
}

app.use(cookieParser());
app.use(bodyParser.json({ type: 'application/json' }));
app.use(sessionManager);
app.use('/api', apiRouter());
app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: true,
  }),
);

app.listen(config.SERVER_PORT, () => {
  logger.info(`server is listening on http://${config.SERVER_URL}:${config.SERVER_PORT}`);
});
