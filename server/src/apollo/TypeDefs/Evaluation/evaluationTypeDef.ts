import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type Evaluation {
    id: ID
    name: String
    assessorId: String
    isSubmit: Boolean
    assessmentId: String
    assessor: Member
    results: [Result]
  }
`;

export default typeDefs;
