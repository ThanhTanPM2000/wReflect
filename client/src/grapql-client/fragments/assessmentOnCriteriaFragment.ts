import { ASSESSOR_ON_ASSESSMENT } from './assessorOnAssessment';
import { CRITERIA_FIELDS } from './criteriaFragment';
import { gql } from '@apollo/client';
export const ASSESSMENT_ON_CRITERIA_FIELDS = gql`
  ${CRITERIA_FIELDS}
  ${ASSESSOR_ON_ASSESSMENT}
  fragment AssessmentOnCriteriaFields on AssessmentOnCriteria {
    id
    assessmentId
    criteriaId
    createdAt
    createdBy
    criteria {
      ...CriteriaFields
    }
    assessorOnAssessments {
      ...AssessorOnAssessmentFields
    }
  }
`;
