import { GraphQLObjectType, GraphQLString, GraphQLBoolean, GraphQLInt, GraphQLList } from 'graphql';
import { user } from '../../services';
import { TeamType, UserType } from '.';

const MemberType = new GraphQLObjectType({
  name: 'Member',
  fields: () => ({
    id: { type: GraphQLString },
    email: { type: GraphQLString },
    isOwner: { type: GraphQLBoolean },
    teamId: { type: GraphQLInt },
    joinedAt: { type: GraphQLString },
    assignedBy: { type: GraphQLString },
    status: { type: GraphQLString },
    user: {
      type: UserType,
      resolve: async (_) => {
        return await user.getUserById(_?.email || undefined);
      },
    },
    team: { type: TeamType },
  }),
});

export default MemberType;
