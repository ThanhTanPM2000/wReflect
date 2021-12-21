import { customerError, getListDataType } from './../../types';
import { GraphQLObjectType, GraphQLList, GraphQLBoolean, GraphQLString, GraphQLInt, GraphQLEnumType } from 'graphql';
import { TeamType } from '../types';
import { team } from '../../services';
import { RequestWithUserInfo } from '../../types';
import { AuthenticationError } from 'apollo-server-errors';
import { errorName } from '../../constant/errorsConstant';

export default {
  type: new GraphQLObjectType({
    name: 'GetTeams',
    fields: {
      data: { type: new GraphQLList(TeamType) },
      total: { type: GraphQLInt },
      message: { type: GraphQLString },
    },
  }),
  args: {
    status: { type: GraphQLString },
    isGettingAll: { type: GraphQLBoolean },
    search: { type: GraphQLString },
    page: { type: GraphQLInt },
    size: { type: GraphQLInt },
  },
  resolve: async (_, args: getListDataType, request: RequestWithUserInfo) => {
    try {
      const { id, isAdmin } = request?.user;
      const { status, isGettingAll, search, page, size } = args;
      const { data, total } = await team.getTeams(
        isAdmin ? undefined : id,
        status,
        !!isGettingAll,
        page,
        size,
        search,
      );
      return { data, total };
    } catch (error) {
      throw error;
    }
  },
};
