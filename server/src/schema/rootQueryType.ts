import { GraphQLObjectType, GraphQLList } from 'graphql';
import WorkSpaceType from './workSpaceType';

const test = [
  {
    id: '1',
    name: 'test',
  },
];

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    workspaces: {
      type: new GraphQLList(WorkSpaceType),
      resolve: () => {
        return test;
      },
    },
  },
});

export default RootQuery;
