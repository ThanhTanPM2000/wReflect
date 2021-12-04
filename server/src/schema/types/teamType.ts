import { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLList } from 'graphql';
import MemberType from './memberType';
import { member } from '../../services';

const TeamType = new GraphQLObjectType({
  name: 'Team',
  fields: {
    id: { type: GraphQLInt },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    startDate: { type: GraphQLString },
    endDate: { type: GraphQLString },
    status: { type: GraphQLString },
    picture: { type: GraphQLString },
    numOfMember: { type: GraphQLInt },
    total: { type: GraphQLInt },
    members: {
      type: new GraphQLList(MemberType),
      resolve: async () => {
        return await member.getListMembers();
      },
    },
  },
});

export default TeamType;
