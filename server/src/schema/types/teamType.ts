import { RequestWithUserInfo } from '../../types';
import { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLList, GraphQLBoolean } from 'graphql';
import MemberType from './memberType';
import { member } from '../../services';

const TeamType = new GraphQLObjectType({
  name: 'Team',
  fields: () => ({
    id: { type: GraphQLInt },
    name: { type: GraphQLString },
    ownerEmail: { type: new GraphQLList(GraphQLString) },
    createdAt: { type: GraphQLString },
    startDate: { type: GraphQLString },
    endDate: { type: GraphQLString },
    status: { type: GraphQLString },
    picture: { type: GraphQLString },
    numOfMember: { type: GraphQLInt },
    isPublish: { type: GraphQLBoolean },
    description: { type: GraphQLString },
    members: {
      type: new GraphQLList(MemberType),
      args: {
        searchText: { type: GraphQLString },
      },
      resolve: async (_, args, request: RequestWithUserInfo) => {
        const { id, isAdmin } = request.user;
        const { searchText } = args;
        return await member.getListMembers({ teamId: _.id }, searchText, isAdmin ? undefined : id);
      },
    },
  }),
});

export default TeamType;
