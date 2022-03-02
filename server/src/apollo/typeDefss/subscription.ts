import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type Subscription {
    updateBoard(meId: ID!): Board
    deleteBoard(meId: ID!): Board
    convertColumn(meId: ID!): Column
    updateOpinion(meId: ID!): Opinion
  }
`;

export default typeDefs;
