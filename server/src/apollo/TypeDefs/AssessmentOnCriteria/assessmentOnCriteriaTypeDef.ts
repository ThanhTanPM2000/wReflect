import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type AssessmentOnCriteria {
    id: ID
    assessmentId: String
    criteriaId: String
    createdAt: String
    createdBy: String
    assessment: Assessment
    criteria: Criteria
    assessorOnAssessments: [AssessorOnAssessment]
  }
`;

export default typeDefs;
