import { GraphQLSchema } from 'graphql';

import RootQuery from './rootQueryType';
import Mutation from './mutations';

export default new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
