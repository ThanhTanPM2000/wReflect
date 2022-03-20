import { gql } from 'apollo-server-express';
const typeDefs = gql`
  type Teams {
    data: [Team]
    total: Int
    page: Int
    size: Int
  }

  type getTeamIds {
    id: String
    name: String
    picture: String
    boards: [Board]
  }

  type getHealthCheck {
    memberAnswers: [MemberAnswer]
    memberComments: [MemberComment]
    healthCheck: HealthCheck
  }

  type Query {
    teams(status: String, isGettingAll: Boolean, search: String, page: Int, size: Int): Teams
    getTeamIds: [getTeamIds]
    team(teamId: String!): Team
    user(userId: String!): User
    members(teamId: String!): [Member]
    boards(teamId: String!): [Board]
    board(boardId: String): Board

    getHealthCheck(teamId: String, boardId: String): getHealthCheck
  }
`;

export default typeDefs;
