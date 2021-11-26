import { GraphQLObjectType, GraphQLString } from 'graphql';
import WorkSpaceType from './workSpaceType';

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    updateWorkSpace: {
      type: WorkSpaceType,
      args: {
        name: { type: GraphQLString },
      },
      resolve: (parentValue, args) => {
        return { ...args };
      },
    },
  },
});

export default Mutation;
