import { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLList } from 'graphql';
import { user } from '../../services';
import { UserType } from '.';

const ProfileType = new GraphQLObjectType({
  name: 'UserProfile',
  fields: () => ({
    id: { type: GraphQLString },
    userId: { type: GraphQLString },
    name: { type: GraphQLString },
    nickname: { type: GraphQLString },
    picture: { type: GraphQLString },
    workplace: { type: GraphQLString },
    address: { type: GraphQLString },
    school: { type: GraphQLString },
    introduction: { type: GraphQLString },
    talents: { type: GraphQLString },
    interests: { type: GraphQLString },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString },
    gender: { type: GraphQLString },
    user: {
      type: UserType,
      resolve: async (_) => {
        return await user.getUser(_.userId);
      },
    },
  }),
});

export default ProfileType;
