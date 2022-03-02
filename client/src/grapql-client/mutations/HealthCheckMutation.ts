import { HealthCheck } from './../../types';
import { gql } from '@apollo/client';
import { MemberAnswer, MemberComment, StatusHealthCheck } from '../../types';

export type startSurveyResult = {
  startSurveyHealthCheck: {
    getHealthCheck: {
      memberAnswers: [MemberAnswer];
      memberComments: [MemberComment];
      healthCheck: HealthCheck;
    };
  };
};

export type startSurveyVars = {
  teamId: string;
  boardId: string;
  isAnonymous: boolean;
  isCustom: boolean;
  templateId: string;
  status: StatusHealthCheck;
};

export const startSurvey = gql`
  mutation Mutation(
    $teamId: String!
    $boardId: String!
    $isAnonymous: Boolean!
    $isCustom: Boolean!
    $templateId: String!
    $status: StatusHealthCheck!
  ) {
    startSurveyHealthCheck(
      teamId: $teamId
      boardId: $boardId
      isAnonymous: $isAnonymous
      isCustom: $isCustom
      templateId: $templateId
      status: $status
    ) {
      memberAnswers {
        id
        templateId
        updatedAt
        userId
        createdAt
        healthCheckId
        answers {
          questionId
          value
        }
      }
      memberComments {
        id
        templateId
        healthCheckId
        createdAt
        updatedAt
        userId
        questionId
        text
      }
      healthCheck {
        id
        teamId
        boardId
        templateId
        createdAt
        createdBy
        updatedAt
        updatedBy
        isAnonymous
        isCustom
      }
    }
  }
`;
