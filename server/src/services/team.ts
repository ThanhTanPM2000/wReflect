import { addMembersToTeam } from './member';
import { StatusCodes } from 'http-status-codes';
import config from '../config';
import prisma from './../prisma';
import { createTeamType, RequestWithUserInfo, updateTeamType } from '../types';
import { Team, TeamStatus } from '@prisma/client';
import { errorName } from '../constant/errorsConstant';
import { ForbiddenError, ApolloError } from 'apollo-server-errors';

export const getTeams = async (
  isGettingAll = false,
  page = 1,
  size = 8,
  search = '',
  status?: TeamStatus,
  userId?: string,
) => {
  const where = userId
    ? {
        members: {
          some: {
            userId,
          },
        },
      }
    : undefined;

  const data = await prisma.team.findMany({
    where: {
      ...where,
      AND: [
        {
          name: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          status: status,
        },
      ],
    },
    ...(!isGettingAll && { skip: (page - 1) * size }),
    ...(!isGettingAll && { take: size }),
    orderBy: { createdAt: 'desc' },

    include: {
      boards: true,
    },
  });

  const total = await prisma.team.count({
    where: {
      ...where,
      AND: [
        {
          name: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          status: status,
        },
      ],
    },
  });

  return {
    data,
    total,
    page,
    size,
  };
};

export const getTeam = async (teamId: string, userId?: string) => {
  const where = userId
    ? {
        OR: [
          {
            isPublic: true,
          },
          {
            members: {
              some: {
                userId,
              },
            },
          },
        ],
      }
    : undefined;

  const team = await prisma.team.findFirst({
    where: {
      ...where,
      id: teamId,
    },
  });

  return team;
};

export const createTeam = async (req: RequestWithUserInfo, data: createTeamType) => {
  const { id: meId } = req.user;

  const startDate = data.startDate ? new Date(data.startDate) : new Date();
  const endDate = data.endDate ? new Date(data.endDate) : new Date();

  const team = await prisma.team.create({
    data: {
      picture: `${config.SERVER_URL}/uploads/teamDefault.png`,
      ...data,
      startDate,
      endDate,
      ownerId: meId,
      boards: {
        create: {
          createdBy: meId,
          title: 'Default Board',
          columns: {
            createMany: {
              data: [
                {
                  title: 'Went Well',
                  isActive: true,
                  position: 1,
                },
                {
                  title: 'To Improve',
                  isActive: true,
                  position: 2,
                },
                {
                  title: 'Action Items',
                  isActive: true,
                  position: 3,
                },
                {
                  title: '',
                  isActive: false,
                  position: 4,
                },
                {
                  title: '',
                  isActive: false,
                  position: 5,
                },
              ],
            },
          },
        },
      },
      members: {
        create: {
          isOwner: true,
          userId: meId,
        },
      },
    },
    include: {
      boards: true,
    },
  });

  return team;
};

export const updateTeam = async (req: RequestWithUserInfo, data: updateTeamType): Promise<Team> => {
  const { id: meId } = req?.user;
  const startDate = data.startDate ? new Date(data.startDate) : undefined;
  const endDate = data.endDate ? new Date(data.endDate) : undefined;

  const team = await prisma.team.updateMany({
    where: {
      id: data.id,
      members: {
        some: {
          userId: meId,
          isOwner: true,
        },
      },
    },
    data: {
      name: data.name,
      description: data.description,
      isPublic: data.isPublic,
      picture: data.picture,
      startDate,
      endDate,
    },
  });

  if (!team[0]) throw new Error(errorName.FORBIDDEN);

  return team[0];
};

export const changeTeamAccess = async (req: RequestWithUserInfo, teamId: string, isPublic: boolean) => {
  const { id: meId } = req?.user;
  const team = await prisma.team.updateMany({
    where: {
      id: teamId,
      members: {
        some: {
          userId: meId,
          isOwner: true,
        },
      },
    },
    data: {
      isPublic: isPublic,
    },
  });

  if (!team) throw new ApolloError("You don't have permission for this request", `${StatusCodes.FORBIDDEN}`);
  return team;
};

export const deleteTeam = async (req: RequestWithUserInfo, teamId: string) => {
  const { id: meId } = req?.user;
  const batchPayload = await prisma.team.deleteMany({
    where: {
      id: teamId,
      members: {
        some: {
          userId: meId,
          isOwner: true,
        },
      },
    },
  });

  if (!batchPayload) throw new ForbiddenError(`You are not the owner of Team ${teamId}`);
  return batchPayload;
};

// export const createBoard = async (req: RequestWithUserInfo, teamId: string) => {
//   const {id: }
// }

// export const updateAction = async (teamId: string,userId: string, boardId: string, ) => {
//   const team = await prisma.team.update({
//     where: {
//       id: teamId
//     },
//     data: {
//       boards: {
//         update: {
//           where: {
//             id: boardId,
//           },
//           data: {
//             update: {
//               col
//             }
//           }
//         }
//       }
//     }
//   })
// }
