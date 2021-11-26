import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import expressFileUpload from 'express-fileupload';
import { graphqlHTTP } from 'express-graphql';

import './prisma'; // eager load to test connection
import logger from './logger';
import config from './config';
import schema from './schema';

dotenv.config();
const app = express();
app.use(expressFileUpload());
app.use(
  cors({
    credentials: true,
    origin: config.CLIENT_URL,
  }),
);

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
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
