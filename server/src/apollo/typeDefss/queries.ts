import { gql } from 'apollo-server-express';
const typeDefs = gql`
  input TeamsInput {
    status: String @constraint(pattern: "^(DOING|DONE)$")
    isGettingAll: Boolean
    search: String
    page: Int
    size: Int
  }

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

  type Query {
    teams(input: TeamsInput): Teams
    getTeamIds: [getTeamIds]
    team(teamId: String!): Team
    user(userId: String!): User
    members(teamId: String!): [Member]
    boards(teamId: String!): [Board]
    board(boardId: String): Board
  }
`;

export default typeDefs;
