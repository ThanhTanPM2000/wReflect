import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type Member {
    id: ID!
    userId: String!
    teamId: String!
    isOwner: Boolean!
    isPendingInvitation: Boolean!
    isGuess: Boolean!
    invitedBy: String
    joinedAt: String!
    role: String
    user: User
    team: Team

    opinions: [Opinion]
    remarks: [Remark]
  }
`;

export default typeDefs;
