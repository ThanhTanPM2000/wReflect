import { GraphQLObjectType, GraphQLString, GraphQLBoolean, GraphQLInt, GraphQLList } from 'graphql';
import { user, team } from '../../services';
import { TeamType, UserType } from '.';
import { RequestWithUserInfo } from '../../types';

const MemberType = new GraphQLObjectType({
  name: 'Member',
  fields: () => ({
    id: { type: GraphQLString },
    userId: { type: GraphQLString },
    teamId: { type: GraphQLString },
    isOwner: { type: GraphQLBoolean },
    isPendingInvitation: { type: GraphQLBoolean },
    isGuess: { type: GraphQLBoolean },
    invitedBy: { type: GraphQLString },
    joinedAt: { type: GraphQLString },
    user: {
      type: UserType,
      resolve: async (_) => {
        return await user.getUser(_.userId);
      },
    },
    team: {
      type: TeamType,
      resolve: async (_, request: RequestWithUserInfo) => {
        const { id, isAdmin } = request?.user;
        return await team.getTeam(_.teamId, isAdmin ? undefined : id);
      },
    },
  }),
});

export default MemberType;
