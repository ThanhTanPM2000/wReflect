import { RequestWithUserInfo } from './../../types';
import { GraphQLInt, GraphQLNonNull, GraphQLString, GraphQLBoolean } from 'graphql';

import { TeamType } from '../types';
import { team } from '../../services';
import { updateTeamType } from '../../types';

export default {
  type: TeamType,
  args: {
    id: { type: new GraphQLNonNull(GraphQLInt) },
    name: {
      type: GraphQLString,
    },
    startDate: { type: GraphQLString },
    endDate: { type: GraphQLString },
    status: { type: GraphQLString },
    isPublish: { type: GraphQLBoolean },
    picture: { type: GraphQLString },
    description: { type: GraphQLString },
  },
  resolve: async (_, args: updateTeamType, request: RequestWithUserInfo) => {
    const { email } = request.user;
    return await team.updateTeam(email, args);
  },
};
