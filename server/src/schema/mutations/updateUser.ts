import { RequestWithUserInfo } from '../../types';
import { GraphQLString, GraphQLList } from 'graphql';

import { UserType } from '../types';
import { user } from '../../services';
import { updateUserType } from '../../types';

export default {
  type: UserType,
  args: {
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    gender: { type: GraphQLString },
    workplace: { type: GraphQLString },
    userStatus: { type: GraphQLString },
    school: { type: GraphQLString },
    introduction: { type: GraphQLString },
    phoneNumbers: { type: new GraphQLList(GraphQLString) },
    photos: { type: new GraphQLList(GraphQLString) },
    talents: { type: GraphQLString },
    interests: { type: GraphQLString },
    updatedAt: { type: GraphQLString },
  },
  resolve: async (_, args: updateUserType, request: RequestWithUserInfo) => {
    const { id } = request.user;
    return await user.updateUser(id, args);
  },
};
