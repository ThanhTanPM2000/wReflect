import { gql } from 'apollo-server-express';

const typeDefs = gql`
  enum UserStatus {
    ONLINE
    OFFLINE
  }

  type User {
    id: ID!
    email: String
    createdAt: String
    updatedAt: String
    isAdmin: String
    userStatus: UserStatus
    nickname: String
    picture: String!
    workplace: String
    address: String
    school: String
    introduction: String
    talent: String
    interest: String
    gender: Gender
    members: [Member]
    teams: [Team]
    opinions: [Opinion]
    remark: [Remark]
    memberAnswers: [MemberAnswer]
    memberComments: [MemberComment]
  }
`;

export default typeDefs;
