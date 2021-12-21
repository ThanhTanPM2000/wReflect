import { GraphQLString, GraphQLNonNull } from 'graphql';
import { UserType } from '../types';
import { user } from '../../services';

export default {
  type: UserType,
  name: 'GetUser',
  args: {
    userId: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: async (_, args: { userId: string }) => {
    try {
      return await user.getUser(args.userId);
    } catch (error) {
      throw error;
    }
  },
};
