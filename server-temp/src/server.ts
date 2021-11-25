import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import schema from './schema/schema';
import logger from './logger';

const app = express();

app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: true,
  }),
);

const port = process.env.PORT || 4000;

app.listen(port, () => {
  logger.info(`server connecting on http://localhost:${port}`);
});
