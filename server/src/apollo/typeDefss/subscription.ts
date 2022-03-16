import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type statusRequest {
    success: Boolean
  }

  type Subscription {
    updateListTeams(meId: ID!): statusRequest
    updateBoard(meId: ID!): Board
    deleteBoard(meId: ID!): Board
    convertColumn(meId: ID!): Column
    updateOpinion(meId: ID!): Opinion

    updateGetHealthCheckData(boardId: String!, meId: ID!): getHealthCheck
  }
`;

export default typeDefs;
