import { StatusCodes } from 'http-status-codes';
import config from '../config';
import prisma from './../prisma';
import { createTeamType, updateTeamType } from '../types';
import { Team, TeamStatus, Board, Column, Remark, Opinion, OpinionStatus } from '@prisma/client';
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

  if (!team) throw new ApolloError(`Team not found`, `${StatusCodes.NOT_FOUND}`);

  return team;
};

export const createTeam = async (meId: string, data: createTeamType) => {
  const startDate = data.startDate ? new Date(data.startDate) : new Date();
  const endDate = data.endDate ? new Date(data.endDate) : new Date();

  const team = await prisma.team.create({
    data: {
      picture: `${config.SERVER_URL}/uploads/teamDefault.png`,
      ...data,
      startDate,
      endDate,
      boards: {
        create: {
          createdBy: meId,
          title: 'Default Board',
          columns: {
            createMany: {
              data: [
                {
                  title: 'Went Well',
                },
                {
                  title: 'To Improve',
                },
                {
                  title: 'Action Items',
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
  });

  return team;
};

export const updateTeam = async (meId: string, data: updateTeamType): Promise<Team> => {
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
      // isPublic: data.isPublic,
      isPublic: data.isPublic,
      picture: data.picture,
      startDate,
      endDate,
    },
  });

  if (!team[0]) throw new Error(errorName.FORBIDDEN);

  return team[0];
};

export const changeTeamAccess = async (meId: string, teamId: string, isPublic: boolean) => {
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

export const deleteTeam = async (meId: string, teamId: string) => {
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
