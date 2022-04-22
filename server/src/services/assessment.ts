import logger from '../logger';
import {
  filterOfGetAssessmentList,
  getAssessmentArgs,
  getAssessmentListType,
  sortType,
  createAssessmentType,
  submitDoPersonalReflection,
} from '../apollo/TypeDefs/Assessment/assessmentTypes';
import error from './../errorsManagement';
import prisma from './../prisma';
import { checkIsMemberOfTeam, checkIsMemberOwningTeam } from './essential';
import _ from 'lodash';
import fs from 'fs';

export const createAssessment = async (meId: string, args: createAssessmentType) => {
  // const memberOfTeam = await checkIsMemberOfTeam(args?.teamId, meId);
  const memberOwnedTeam = await checkIsMemberOwningTeam(args?.teamId, meId);

  const status = new Date(args?.startDate) < new Date() ? 'Planned' : 'Doing';
  const list: { assessorId: string; concerningMemberId: string; point?: number; comment?: string }[] = [];
  args?.memberIds?.forEach((memberId) => {
    args?.memberIds?.forEach((y) => {
      list?.push({
        assessorId: memberId,
        concerningMemberId: y,
        comment: '',
      });
    });
  });

  const creatingCriteria = args?.criteriaList?.map((criteria) => {
    return {
      criteriaId: criteria,
      createdBy: memberOwnedTeam?.id,
      assessorOnAssessments: {
        create: list,
      },
    };
  });

  const b = _?.cloneDeep(creatingCriteria);
  fs.writeFile('test.txt', JSON.stringify(b), (err) => {
    if (err) {
      console.error(err);
      return;
    }
    //file written successfully
  });

  // const assessment1 = await prisma.assessment.upsert({
  //   where: {
  //     id: args?.assessmentId,
  //   },
  //   update: {
  //     name: args?.nameAssessment,
  //     endDate: args?.endDate,
  //     // assessmentOnCriteriaList: {},
  //   },
  //   create: {
  //     teamId: args?.teamId,
  //     name: args?.nameAssessment,
  //     startDate: args?.startDate,
  //     endDate: args?.endDate,
  //     creatorId: memberOwnedTeam?.id,
  //     status: status,
  //     assessmentOnCriteriaList: {
  //       create: [...creatingCriteria],
  //     },
  //   },
  // });

  const assessment = await prisma.assessment.create({
    data: {
      teamId: args?.teamId,
      name: args?.nameAssessment,
      startDate: args?.startDate,
      endDate: args?.endDate,
      creatorId: memberOwnedTeam?.id,
      status: status,
      assessmentOnCriteriaList: {
        create: [...creatingCriteria],
      },
    },
  });

  if (!assessment) return error.NotFound();
  return assessment;
};

export const getListAssessment = async (
  meId: string,
  args: getAssessmentListType = {
    teamId: '',
    orderBy: filterOfGetAssessmentList.DATE,
    sort: sortType.ASC,
    isGettingAll: false,
    search: undefined,
    offSet: 8,
    limit: 8,
  },
) => {
  await checkIsMemberOfTeam(args?.teamId, meId);
  const orderBy =
    args?.orderBy == filterOfGetAssessmentList.NAME
      ? {
          name: args?.sort,
        }
      : args?.orderBy == filterOfGetAssessmentList.DATE
      ? {
          date: args?.sort,
        }
      : args?.orderBy == filterOfGetAssessmentList.STATUS
      ? {
          status: args?.sort,
        }
      : undefined;

  const where = args?.search && {
    OR: [
      {
        name: {
          contains: args?.search,
        },
      },
    ],
  };

  const assessments = await prisma.assessment.findMany({
    where: {
      teamId: args?.teamId,
      ...where,
    },
    ...(!args?.isGettingAll && { skip: args?.offSet }),
    ...(!args?.isGettingAll && { take: args?.limit }),
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      creator: true,
      assessmentOnCriteriaList: {
        include: {
          criteria: true,
        },
      },
    },
  });

  const total = await prisma.assessment.count({
    where: {
      teamId: args?.teamId,
      ...where,
    },
  });

  return {
    data: assessments,
    total,
    page: args?.offSet / args?.limit,
    size: args?.limit,
  };
};

export const getAssessment = async (meId: string, args: getAssessmentArgs) => {
  const memberOfTeam = await checkIsMemberOfTeam(args?.teamId, meId);

  const assessment = await prisma.assessment.findUnique({
    where: {
      id: args?.assessmentId,
    },
    include: {
      assessmentOnCriteriaList: {
        include: {
          criteria: true,
          assessorOnAssessments: {
            include: {
              assessor: true,
            },
            where: {
              assessorId: memberOfTeam?.id,
            },
          },
        },
      },
    },
  });

  if (!assessment) return error.NotFound('Assessment Not Found!');

  return assessment;
};

export const getListAssessmentOnCriteriaList = async (assessmentId: string) => {
  const assessmentOnCriteriaList = await prisma.assessmentOnCriteria.findMany({
    where: {
      assessmentId,
    },
  });

  return assessmentOnCriteriaList;
};

type test = {
  where: {
    id: string;
  };
  data: {
    assessorOnAssessments: {
      upsert: {
        where: {
          id: string;
        };
        update: {
          point: number;
          comment: string;
        };
        create: {
          assessorId: string;
          concerningMemberId: string;
          point: number;
          comment: string;
        };
      };
    };
  };
}[];

export const submitDoPersonal = async (meId: string, args: submitDoPersonalReflection) => {
  const memberOfTeam = await checkIsMemberOfTeam(args?.teamId, meId);

  const update: test = [];
  await Promise.all(
    args?.memberAnswer?.map((answer) => {
      answer?.data?.map((x) => {
        update.push({
          where: {
            id: x?.assessmentOnCriteriaId,
          },
          data: {
            assessorOnAssessments: {
              upsert: {
                where: {
                  id: x?.assessmentOnCriteriaId,
                },
                update: {
                  point: x?.point,
                  comment: x?.comment || '',
                },
                create: {
                  assessorId: memberOfTeam?.id,
                  concerningMemberId: answer?.concerningMemberId,
                  point: x?.point,
                  comment: x?.comment || '',
                },
              },
            },
          },
        });
      });
    }),
  );
  const b = _?.cloneDeep(update);
  fs.writeFile('test.txt', `${b?.map((x) => JSON.stringify(x))}`, (err) => {
    if (err) {
      console.error(err);
      return;
    }
    //file written successfully
  });

  const assessment = await prisma.assessment.update({
    where: {
      id: args?.assessmentId,
    },
    data: {
      assessmentOnCriteriaList: {
        update: [...update],
      },
    },
  });

  console.log(assessment);
  return assessment;
};
