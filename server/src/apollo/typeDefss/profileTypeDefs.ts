import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type Profile {
    id: ID!
    userId: String!
    name: String!
    nickname: String!
    picture: String!
    workplace: String
    address: String
    school: String
    introduction: String
    talent: String
    interest: String
    createdAt: String!
    updatedAt: String!
    gender: Gender
    user: User
  }

  enum Gender {
    UNSPECIFIED
    MALE
    FEMALE
  }
`;

export default typeDefs;
