import { ASSESSMENT_FIELDS } from './../fragments/assessmentFragment';
import { TEAM_FIELDS } from './../fragments/teamFragment';
import { gql } from '@apollo/client';
import { Assessment } from '../../types';

export type createAssessmentResult = {
  createAssessment: Assessment;
};

export type createAssessmentVars = {
  teamId: string;
  nameAssessment: string;
  startDate: string;
  endDate: string;
  criteriaList: string[];
  memberIds: string[];
};

export const createAssessment = gql`
  ${ASSESSMENT_FIELDS}
  mutation createAssessment(
    $teamId: String!
    $nameAssessment: String!
    $startDate: String!
    $endDate: String!
    $criteriaList: [String!]!
    $memberIds: [String]!
  ) {
    createAssessment(
      teamId: $teamId
      nameAssessment: $nameAssessment
      startDate: $startDate
      endDate: $endDate
      criteriaList: $criteriaList
      memberIds: $memberIds
    ) {
      ...AssessmentFields
    }
  }
`;

export type submitDoPersonalResult = {
  doPersonalReflection: Assessment;
};

export type submitDoPersonalVars = {
  teamId: string;
  assessmentId: string;
  assessorId: string;
  memberAnswer: {
    isDone: boolean;
    concerningMemberId: string;
    data: {
      assessmentOnCriteriaId: string;
      point: number;
      comment?: string;
    }[];
  }[];
};

export const submitDoPersonalReflection = gql`
  ${ASSESSMENT_FIELDS}
  mutation DoPersonalReflection(
    $teamId: String!
    $assessmentId: String!
    $assessorId: String!
    $memberAnswer: [memberAnswer]
  ) {
    doPersonalReflection(
      teamId: $teamId
      assessmentId: $assessmentId
      assessorId: $assessorId
      memberAnswer: $memberAnswer
    ) {
      ...AssessmentFields
    }
  }
`;
