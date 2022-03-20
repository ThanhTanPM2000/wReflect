import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type User {
    id: ID!
    email: String
    createdAt: String
    updatedAt: String
    isAdmin: String
    userStatus: String
    members: [Member]
    profile: Profile
    name: String!
    nickname: String!
    picture: String!
  }
`;

export default typeDefs;
