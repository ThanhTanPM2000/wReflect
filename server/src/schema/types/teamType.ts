import { RequestWithUserInfo } from '../../types';
import { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLList, GraphQLBoolean } from 'graphql';
import MemberType from './memberType';
import { member } from '../../services';
import { Team } from '@prisma/client';

const TeamType = new GraphQLObjectType({
  name: 'Team',
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    ownerEmail: { type: new GraphQLList(GraphQLString) },
    createdAt: { type: GraphQLString },
    startDate: { type: GraphQLString },
    endDate: { type: GraphQLString },
    picture: { type: GraphQLString },
    numOfMember: { type: GraphQLInt },
    isPublic: { type: GraphQLBoolean },
    description: { type: GraphQLString },
    status: { type: GraphQLString },
    members: {
      type: new GraphQLList(MemberType),
      resolve: async (_: Team, args, request: RequestWithUserInfo) => {
        try {
          const members = await member.getListMembers(_.id);
          return members;
        } catch (error) {
          throw error;
        }
      },
    },
  }),
});

export default TeamType;
