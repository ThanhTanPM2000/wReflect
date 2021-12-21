import { GraphQLString, GraphQLNonNull, GraphQLBoolean } from 'graphql';
import { TeamType } from '../types';
import { createTeamType, RequestWithUserInfo } from '../../types';

import { team } from '../../services';

export default {
  type: TeamType,
  name: 'CreateTeam',
  args: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    description: { type: GraphQLString },
    startDate: { type: new GraphQLNonNull(GraphQLString) },
    endDate: { type: new GraphQLNonNull(GraphQLString) },
    status: { type: GraphQLString },
    isPublic: { type: GraphQLBoolean },
    picture: { type: GraphQLString },
  },
  resolve: async (_, args: createTeamType, request: RequestWithUserInfo) => {
    try {
      const { email, id } = request?.user;
      return await team.createTeam(email, id, args);
    } catch (error) {
      throw error;
    }
  },
};
