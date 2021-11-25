import { GraphQLString, GraphQLObjectType } from 'graphql';

const WorkSpaceType = new GraphQLObjectType({
  name: 'WorkSpace',
  fields: {
    id: { type: GraphQLString },
    name: { type: GraphQLString },
  },
});

export default WorkSpaceType;
