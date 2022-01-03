import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type Team {
    id: ID
    name: String
    ownerUserIds: [String]
    createdAt: String
    startDate: String
    endDate: String
    picture: String
    numOfMember: Int
    isPublic: Boolean
    status: TeamStatus
    description: String
    members: [Member]
    boards: [Board]
  }

  enum TeamStatus {
    DOING
    DONE
  }
`;

export default typeDefs;
