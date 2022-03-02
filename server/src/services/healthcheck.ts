import { HealthCheck, MemberAnswer } from '@prisma/client';
import { startSurveyArgs } from './../apollo/typeDefss/healthCheckTypeDefs';
import prisma from '../prisma';

export const getHealthCheck = async (teamId: string, boardId: string) => {
  const healthCheck = await prisma.healthCheck.findFirst({
    where: {
      teamId,
      boardId,
    },
    include: {
      memberAnswers: true,
      memberComments: true,
    },
  });

  return {
    healthCheck: healthCheck || null,
    memberAnswers: healthCheck?.memberAnswers || [],
    memberComments: healthCheck?.memberComments || [],
  };
};

export const createHealthCheck = async (userId: string, args: startSurveyArgs) => {
  const healthCheck = await prisma.healthCheck.create({
    data: {
      teamId: args.teamId,
      boardId: args.boardId,
      templateId: args.templateId,
      createdBy: userId,
      isAnonymous: args.isAnonymous,
      isCustom: args.isCustom,
      status: args.status,
    },
    include: {
      memberAnswers: true,
      memberComments: true,
    },
  });

  return {
    healthCheck: healthCheck || null,
    memberAnswers: healthCheck?.memberAnswers || [],
    memberComments: healthCheck?.memberComments || [],
    __typeName: 'getHealthCheck',
  };
};
