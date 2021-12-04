import { GraphQLInt } from 'graphql';

import { team } from '../../services';
import { TeamType } from '../types';

type argument = {
  teamId: number;
};

export default {
  type: TeamType,
  args: {
    teamId: { type: GraphQLInt },
  },
  resolve: async (_, { teamId }: argument) => {
    return await team.deleteTeam(teamId);
  },
};
