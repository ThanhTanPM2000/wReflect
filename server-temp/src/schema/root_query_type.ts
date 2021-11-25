import { GraphQLObjectType, GraphQLList } from 'graphql';
import axios from 'axios';
import workSpaceType from './workspace_type';

const endpoint = 'http://localhost:3000';

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    // get list workspaces
    workSpaces: {
      type: new GraphQLList(workSpaceType),
      resolve() {
        return axios.get(`${endpoint}`);
      },
    },
  },
});

export default RootQuery;
