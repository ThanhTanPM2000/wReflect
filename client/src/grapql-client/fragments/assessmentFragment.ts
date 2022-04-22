import { ASSESSMENT_ON_CRITERIA_FIELDS } from './assessmentOnCriteriaFragment';
import { gql } from '@apollo/client';
import { MEMBER_FIELDS } from './memberFragment';
export const ASSESSMENT_FIELDS = gql`
  ${MEMBER_FIELDS}
  ${ASSESSMENT_ON_CRITERIA_FIELDS}
  fragment AssessmentFields on Assessment {
    id
    name
    startDate
    endDate
    teamId
    creatorId
    creator {
      ...MemberFields
    }
    status
    assessmentOnCriteriaList {
      ...AssessmentOnCriteriaFields
    }
  }
`;
