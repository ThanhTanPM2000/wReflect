import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type Column {
    id: ID
    color: String
    title: String
    position: Int
    isActive: Boolean
    opinions: [Opinion]
    boardId: String
    board: Board
  }
`;

export default typeDefs;
