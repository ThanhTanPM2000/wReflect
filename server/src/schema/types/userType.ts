import { GraphQLObjectType, GraphQLString, GraphQLBoolean, GraphQLInt, GraphQLList } from 'graphql';
import { MemberType, ProfileType } from '.';

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLInt },
    name: { type: GraphQLString },
    nickname: { type: GraphQLString },
    email: { type: GraphQLString },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString },
    isAdmin: { type: GraphQLBoolean },
    status: { type: GraphQLString },
    members: { type: new GraphQLList(MemberType) },
    picture: { type: GraphQLString },
    profile: { type: ProfileType },
  }),
});

export default UserType;
