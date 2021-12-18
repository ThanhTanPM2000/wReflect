import { GraphQLInt, GraphQLNonNull, GraphQLString } from 'graphql';
import { RequestWithUserInfo, removeMemberType } from '../../types';

import { member } from '../../services';
import { MemberType } from '../types';

export default {
  type: MemberType,
  args: {
    email: { type: GraphQLString },
    teamId: { type: new GraphQLNonNull(GraphQLInt) },
  },
  resolve: async (_, args: removeMemberType, request: RequestWithUserInfo) => {
    const { email: ownerEmail } = request.user;
    return await member.removeMember(ownerEmail, args);
  },
};
