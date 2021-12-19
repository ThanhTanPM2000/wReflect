import { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLList } from 'graphql';

const ProfileType = new GraphQLObjectType({
  name: 'UserProfile',
  fields: () => ({
    id: { type: GraphQLInt },
    name: { type: GraphQLString },
    nickname: { type: GraphQLString },
    gender: { type: GraphQLString },
    workplace: { type: GraphQLString },
    picture: { type: GraphQLString },
    userStatus: { type: GraphQLString },
    address: { type: GraphQLString },
    school: { type: GraphQLString },
    introduction: { type: GraphQLString },
    userId: { type: GraphQLInt },
    talents: { type: GraphQLString },
    interests: { type: GraphQLString },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString },
    phoneNumbers: { type: GraphQLString },
  }),
});

export default ProfileType;
