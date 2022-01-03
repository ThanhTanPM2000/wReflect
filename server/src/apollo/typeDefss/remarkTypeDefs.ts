import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type Remark {
    id: ID
    authorId: String
    opinionId: String
    text: String
    createdAt: String
    updatedAt: String
    opinion: Opinion
  }
`;

export default typeDefs;
