import { member, profile } from '../../services';
import { RequestWithUserInfo } from './../../types';
import { GraphQLObjectType, GraphQLString, GraphQLBoolean, GraphQLInt, GraphQLList } from 'graphql';
import { MemberType, ProfileType } from '.';
import { User } from '@prisma/client';

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLString },
    email: { type: GraphQLString },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString },
    isAdmin: { type: GraphQLBoolean },
    userStatus: { type: GraphQLString },
    profile: {
      type: ProfileType,
      args: {
        userId: { type: GraphQLInt },
      },
      resolve: async (_: User) => {
        return await profile.getUserProfile(_.id);
      },
    },
    members: {
      type: new GraphQLList(MemberType),
      resolve: async (_: User) => {
        return await member.getListMembers(undefined, _.id);
      },
    },
  }),
});

export default UserType;
