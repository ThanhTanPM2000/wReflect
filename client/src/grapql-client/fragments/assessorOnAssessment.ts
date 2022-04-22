import { MEMBER_FIELDS } from './memberFragment';
import { gql } from '@apollo/client';
export const ASSESSOR_ON_ASSESSMENT = gql`
  ${MEMBER_FIELDS}
  fragment AssessorOnAssessmentFields on AssessorOnAssessment {
    id
    assessorId
    concerningMemberId
    assessmentOnCriteriaId
    point
    comment
    assessor {
      ...MemberFields
    }
    concerningMember {
      ...MemberFields
    }
  }
`;
