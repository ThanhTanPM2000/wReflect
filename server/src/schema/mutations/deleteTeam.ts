import { isOwnerTeam } from './../../services/team';
import { RequestWithUserInfo } from '../../types';
import { GraphQLString, GraphQLNonNull } from 'graphql';

import { team } from '../../services';
import { TeamType } from '../types';

type argument = {
  teamId: string;
};

export default {
  type: TeamType,
  name: 'DeleteTeam',
  args: {
    teamId: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: async (_, { teamId }: argument, request: RequestWithUserInfo) => {
    try {
      const { email } = request?.user;
      const isOwner = await isOwnerTeam(email, teamId);
      if (!isOwner) throw new Error(`You are not the owner of Team ${teamId}`);

      return await team.deleteTeam(email, teamId);
    } catch (error) {
      throw error;
    }
  },
};
