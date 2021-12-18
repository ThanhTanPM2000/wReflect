import { GraphQLInt, GraphQLBoolean, GraphQLNonNull } from 'graphql';
import { MemberType } from '../types';
import { RequestWithUserInfo, setRoleMemberType } from '../../types';

import { member } from '../../services';

export default {
  type: MemberType,
  args: {
    email: { type: new GraphQLNonNull(GraphQLInt) },
    teamId: { type: new GraphQLNonNull(GraphQLInt) },
    isOwner: { type: new GraphQLNonNull(GraphQLBoolean) },
  },
  resolve: async (_, args: setRoleMemberType, request: RequestWithUserInfo) => {
    const { email: ownerEmail } = request.user;
    return await member.setRoleMember(ownerEmail, args);
  },
};
