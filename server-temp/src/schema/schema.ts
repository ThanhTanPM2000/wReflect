import { GraphQLSchema } from 'graphql';

import RootQuery from './root_query_type';
import Mutation from './mutations';

const schema = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});

export default schema;
