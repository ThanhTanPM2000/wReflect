import { GraphQLNonNull, GraphQLString } from 'graphql';
import { RequestWithUserInfo, removeMemberType } from '../../types';

import { member } from '../../services';
import { MemberType } from '../types';

export default {
  type: MemberType,
  args: {
    memberId: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: async (_, args: removeMemberType, request: RequestWithUserInfo) => {
    try {
      const { email: ownerEmail } = request?.user;
      return await member.removeMember(ownerEmail, args.memberId);
    } catch (error) {
      throw error;
    }
  },
};
