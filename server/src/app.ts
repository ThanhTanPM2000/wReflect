import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import expressFileUpload from 'express-fileupload';
import { graphqlHTTP } from 'express-graphql';
import proxy from 'express-http-proxy';
import StatusCodes from 'http-status-codes';

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
    origin: [config.CLIENT_URL, 'http://localhost:3000'],
  }),
);

app.use(cookieParser());
app.use(bodyParser.json({ type: 'application/json' }));

app.use(sessionManager);
app.use('/api', apiRouter());
app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: true,
    customFormatErrorFn: (error: Error) => {
      return { message: error.message };
    },
  }),
);

const port = config.PORT || 4000;
app.listen(port, () => {
  logger.info(`server is listening on http://${config.SERVER_URL}:${port}`);
});
