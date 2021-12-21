import config from '../config';
import logger from '../logger';
import prisma from './../prisma';
import { createTeamType, updateTeamType } from '../types';
import { Team, TeamStatus } from '.prisma/client';
import { errorName } from '../constant/errorsConstant';

export const getTeams = async (
  userId?: string,
  status?: TeamStatus,
  isGettingAll = false,
  page = 1,
  size = 8,
  search = '',
) => {
  try {
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
            status: {
              equals: status,
            },
          },
        ],
      },
      ...(!isGettingAll && { skip: (page - 1) * size }),
      ...(!isGettingAll && { take: size }),
      orderBy: { createdAt: 'desc' },
    });

    const total = await prisma.team.count({
      where: {
        ...where,
        name: {
          contains: search,
          mode: 'insensitive',
        },
      },
    });

    return {
      data,
      total,
    };
  } catch (error) {
    logger.error('Error in getListTeams service');
    throw error;
  }
};

export const getTeam = async (teamId: string, userId?: string) => {
  try {
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
  } catch (error) {
    logger.error('Error in findTeam service');
    throw error;
  }
};

export const createTeam = async (email: string, userId: string, data: createTeamType) => {
  try {
    const startDate = data.startDate ? new Date(data.startDate) : new Date();
    const endDate = data.endDate ? new Date(data.endDate) : new Date();

    const newTeam = await prisma.team.create({
      data: {
        picture: `${config.SERVER_URL}/uploads/teamDefault.png`,
        ...data,
        startDate,
        endDate,
        ownerEmail: [email],
        members: {
          create: {
            isOwner: true,
            userId,
          },
        },
      },
    });

    return newTeam;
  } catch (error) {
    logger.error('Error in createTeam');
    throw error;
  }
};

export const updateTeam = async (email: string, data: updateTeamType): Promise<Team> => {
  try {
    const startDate = data.startDate ? new Date(data.startDate) : undefined;
    const endDate = data.endDate ? new Date(data.endDate) : undefined;

    const team = await prisma.team.updateMany({
      where: {
        ownerEmail: {
          has: email,
        },
        id: data.id,
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
  } catch (error) {
    logger.error('Error in updateTeam service');
    throw error;
  }
};

export const deleteTeam = async (ownerEmail: string, teamId: string) => {
  try {
    return await prisma.team.delete({
      where: {
        id: teamId,
      },
    });
  } catch (error) {
    logger.error('Error in deleteTeam service');
    throw error;
  }
};

export const isOwnerTeam = async (email: string, teamId: string) => {
  const team = await prisma.team.findFirst({
    where: {
      id: teamId,
      ownerEmail: {
        has: email,
      },
    },
  });
  return team ? true : false;
};
