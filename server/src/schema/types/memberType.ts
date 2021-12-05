import { GraphQLObjectType, GraphQLString, GraphQLBoolean, GraphQLInt, GraphQLList } from 'graphql';
import { TeamType, UserType } from '.';

const MemberType = new GraphQLObjectType({
  name: 'Member',
  fields: () => ({
    isOwner: { type: GraphQLBoolean },
    userId: { type: GraphQLInt },
    teamId: { type: GraphQLInt },
    joinAt: { type: GraphQLString },
    assignedBy: { type: GraphQLString },
    user: { type: new GraphQLList(UserType) },
    team: { type: new GraphQLList(TeamType) },
  }),
});

export default MemberType;
