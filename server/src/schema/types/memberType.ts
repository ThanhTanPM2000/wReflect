import { GraphQLObjectType, GraphQLString, GraphQLBoolean, GraphQLInt } from 'graphql';

const MemberType = new GraphQLObjectType({
  name: 'Member',
  fields: () => ({
    isOwner: { type: GraphQLBoolean },
    userId: { type: GraphQLInt },
    teamId: { type: GraphQLInt },
    joinAt: { type: GraphQLString },
    assignedBy: { type: GraphQLString },
  }),
});

export default MemberType;
