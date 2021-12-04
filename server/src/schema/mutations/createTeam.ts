import { GraphQLString, GraphQLNonNull } from 'graphql';
import { TeamType } from '../types';
import { createTeamType } from '../../types';

import { team } from '../../services';

export default {
  type: TeamType,
  args: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    description: { type: GraphQLString },
    startDate: { type: new GraphQLNonNull(GraphQLString) },
    endDate: { type: new GraphQLNonNull(GraphQLString) },
    picture: { type: GraphQLString },
  },
  resolve: async (_, args: createTeamType) => {
    return await team.createTeam(args);
  },
};
