import { GraphQLInt, GraphQLNonNull } from 'graphql';
import { RequestWithUserInfo, removeMemberType } from '../../types';

import { member } from '../../services';
import { MemberType } from '../types';

export default {
  type: MemberType,
  args: {
    userId: { type: new GraphQLNonNull(GraphQLInt) },
    teamId: { type: new GraphQLNonNull(GraphQLInt) },
  },
  resolve: async (_, args: removeMemberType, request: RequestWithUserInfo) => {
    const { email } = request.user;
    return await member.removeMember(email, args);
  },
};
