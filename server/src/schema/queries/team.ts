import { RequestWithUserInfo } from './../../types';
import { GraphQLNonNull, GraphQLString } from 'graphql';
import { TeamType } from '../types';
import { team } from '../../services';

type argument = {
  teamId: string;
};

export default {
  type: TeamType,
  name: 'GetTeam',
  args: {
    teamId: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  resolve: async (_, args: argument, request: RequestWithUserInfo) => {
    try {
      const { id, isAdmin } = request?.user;
      return await team.getTeam(args.teamId, isAdmin ? undefined : id);
    } catch (error) {
      throw error;
    }
  },
};
