import { GraphQLBoolean, GraphQLNonNull, GraphQLString } from 'graphql';
import { MemberType } from '../types';
import { RequestWithUserInfo, setRoleMemberType } from '../../types';

import { member } from '../../services';

export default {
  type: MemberType,
  args: {
    memberId: { type: new GraphQLNonNull(GraphQLString) },
    isOwner: { type: new GraphQLNonNull(GraphQLBoolean) },
  },
  resolve: async (_, args: setRoleMemberType, request: RequestWithUserInfo) => {
    try {
      const { email: ownerEmail } = request?.user;
      return await member.setRoleMember(ownerEmail, args);
    } catch (error) {
      throw error;
    }
  },
};
