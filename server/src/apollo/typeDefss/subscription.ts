import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type Subscription {
    updateBoard(meId: ID!): Board
    updateOpinion(opinionId: ID!): Opinion
  }
`;

export default typeDefs;
