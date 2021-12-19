import { profile } from '../../services';
import { RequestWithUserInfo } from './../../types';
import { GraphQLObjectType, GraphQLString, GraphQLBoolean, GraphQLInt, GraphQLList } from 'graphql';
import { MemberType, ProfileType } from '.';
import { User } from '@prisma/client';

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
    profile: {
      type: ProfileType,
      args: {
        userId: { type: GraphQLInt },
      },
      resolve: async (_: User, args, request: RequestWithUserInfo) => {
        return await profile.getUserProfile(_?.id);
      },
    },
  }),
});

export default UserType;
