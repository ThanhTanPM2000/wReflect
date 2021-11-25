import { GraphQLObjectType, GraphQLString } from 'graphql';
import axios from 'axios';
import WorkSpaceType from './workspace_type';

const endpoint = 'http://localhost:3000';

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    updateWorkSpace: {
      type: WorkSpaceType,
      args: { name: { type: GraphQLString } },
      resolve: async function (parentValue, args) {
        return await axios.put(endpoint, args);
      },
    },
  },
});

export default Mutation;
