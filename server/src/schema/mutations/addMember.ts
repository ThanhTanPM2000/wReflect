import { GraphQLInt } from 'graphql';
import { MemberType } from '../types';
import { RequestWithUserInfo, addMemberToTeamType } from '../../types';

import { member } from '../../services';

export default {
  type: MemberType,
  args: {
    userId: { type: GraphQLInt },
    teamId: { type: GraphQLInt },
  },
  resolve: async (_, args: addMemberToTeamType, request: RequestWithUserInfo) => {
    const { email } = request.user;
    return await member.addMemberToTeam(email, args);
  },
};
