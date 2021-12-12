import { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLList } from 'graphql';

const ProfileType = new GraphQLObjectType({
  name: 'UserProfile',
  fields: () => ({
    id: { type: GraphQLInt },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    gender: { type: GraphQLString },
    workplace: { type: GraphQLString },
    userStatus: { type: GraphQLString },
    school: { type: GraphQLString },
    introduction: { type: GraphQLString },
    userId: { type: GraphQLInt },
    talents: { type: GraphQLString },
    interests: { type: GraphQLString },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString },
    phoneNumbers: { type: new GraphQLList(GraphQLString) },
    photos: { type: new GraphQLList(GraphQLString) },
  }),
});

export default ProfileType;
