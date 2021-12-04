import { GraphQLObjectType, GraphQLList, GraphQLBoolean, GraphQLString, GraphQLInt } from 'graphql';
import { TeamType } from '../types';
import { team } from '../../services';

type argumentsFindTeams = {
  isGettingAll: boolean;
  search: string;
  page: number;
  size: number;
};

export default {
  type: new GraphQLObjectType({
    name: 'FindListTeams',
    fields: {
      data: { type: new GraphQLList(TeamType) },
      total: { type: GraphQLInt },
    },
  }),
  args: {
    isGettingAll: { type: GraphQLBoolean },
    search: { type: GraphQLString },
    page: { type: GraphQLInt },
    size: { type: GraphQLInt },
  },
  resolve: async (_, args: argumentsFindTeams) => {
    // const { id, isAdmin } = request.user;
    const { isGettingAll, search, page, size } = args;
    const { teams, total } = await team.getListTeams(undefined, !!isGettingAll, page, size, search);
    return { data: teams, total };
  },
};
