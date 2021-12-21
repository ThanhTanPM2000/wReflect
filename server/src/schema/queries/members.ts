import { getListMembersType } from './../../types';
import { GraphQLList, GraphQLNonNull, GraphQLString } from 'graphql';
import { MemberType } from '../types';
import { member } from '../../services';
import { RequestWithUserInfo } from '../../types';

export default {
  name: 'GetMembers',
  type: new GraphQLList(MemberType),
  args: {
    teamId: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: async (_, args: getListMembersType, request: RequestWithUserInfo) => {
    try {
      // const { id, isAdmin } = request?.user;
      // return await member.getListMembers(args.teamId, isAdmin ? undefined : id);
    } catch (error) {
      throw error;
    }
  },
};
