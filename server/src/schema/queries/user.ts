import { GraphQLString, GraphQLNonNull } from 'graphql';
import { UserType } from '../types';
import { user } from '../../services';

export default {
  type: UserType,
  args: {
    email: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: async (_, args: { email: string }) => {
    return await user.getUserById(args?.email || undefined);
  },
};
