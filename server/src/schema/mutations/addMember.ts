import { GraphQLInt, GraphQLList, GraphQLString, GraphQLObjectType, GraphQLNonNull } from 'graphql';
import { RequestWithUserInfo, addMemberToTeamType } from '../../types';

import { member } from '../../services';

export default {
  type: new GraphQLObjectType({
    name: 'AddTeamMembers',
    fields: {
      success: { type: new GraphQLList(GraphQLString) },
      errors: { type: new GraphQLList(GraphQLString) },
    },
  }),
  args: {
    emailUsers: { type: new GraphQLNonNull(new GraphQLList(GraphQLString)) },
    teamId: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: async (_, args: addMemberToTeamType, request: RequestWithUserInfo) => {
    try {
      const { email } = request?.user;
      return await member.addMembersToTeam(email, args);
    } catch (error) {
      throw error;
    }
  },
};
