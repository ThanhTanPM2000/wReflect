import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type AssessorOnAssessment {
    id: ID
    assessmentOnCriteriaId: String
    assessorId: String
    concerningMemberId: String
    point: String
    comment: String
    assessor: Member
    concerningMember: Member
    assessmentOnCriteria: AssessmentOnCriteria
  }
`;

export default typeDefs;
