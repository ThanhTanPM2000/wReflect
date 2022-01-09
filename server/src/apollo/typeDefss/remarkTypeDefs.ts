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
    author: User
  }
`;

export type createRemarkType = {
  opinionId: string;
  text: string;
};

export type removeRemarkType = {
  remarkId: string;
};

export default typeDefs;
