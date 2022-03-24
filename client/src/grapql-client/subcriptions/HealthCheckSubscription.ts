import { MEMBER_FIELDS } from './../fragments/memberFragment';
import { gql } from '@apollo/client';
import { HealthCheck, MemberAnswer, MemberComment } from '../../types';

export type reopenHealthCheckResult = {
  updateGetHealthCheckData: {
    getHealthCheck: {
      memberAnswers: [MemberAnswer];
      memberComments: [MemberComment];
      healthCheck: HealthCheck;
    };
  };
};

export type reopenHealthCheckVars = {
  boardId: string;
  meId: string;
};

export const updateGetHealthCheckData = gql`
  ${MEMBER_FIELDS}
  subscription UpdateGetHealthCheckData($meId: ID!, $boardId: String!) {
    updateGetHealthCheckData(meId: $meId, boardId: $boardId) {
      memberAnswers {
        id
        templateId
        updatedAt
        createdAt
        healthCheckId
        memberId
        member {
          ...MemberFields
        }
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
        memberId
        questionId
        text
        member {
          ...MemberFields
        }
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
