import config from '../config';
import logger from '../logger';
import prisma from './../prisma';
import { createTeamType, RequestWithUserInfo, updateTeamType } from '../types';
import { Team, TeamStatus } from '.prisma/client';

export const getListTeams = async (
  email?: string,
  status?: TeamStatus,
  isGettingAll = false,
  page = 1,
  size = 8,
  search = '',
) => {
  try {
    const where = email
      ? {
          members: {
            some: {
              email,
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

export const findTeam = async (teamId: number, email?: string) => {
  try {
    const where = email
      ? {
          id: teamId,
          members: {
            some: {
              email,
            },
          },
        }
      : undefined;
    const team = await prisma.team.findFirst({
      where: {
        ...where,
      },
    });

    return team;
  } catch (error) {
    logger.error('Error in findTeam service');
    throw error;
  }
};

export const createTeam = async (email: string, userId: number, data: createTeamType) => {
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
            email,
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

export const updateTeam = async (email: string, data: updateTeamType): Promise<Team | null> => {
  try {
    const team = await prisma.team.findFirst({
      where: {
        ownerEmail: {
          has: email,
        },
        id: data.id,
      },
    });

    if (!team) throw new Error(`You are not the owner of Team ${data.id}`);

    const startDate = data.startDate ? new Date(data.startDate) : undefined;
    const endDate = data.endDate ? new Date(data.endDate) : undefined;

    const newTeam = await prisma.team.update({
      where: {
        id: data.id,
      },
      data: {
        name: data.name,
        description: data.description,
        // status: data.status,
        isPublish: data.isPublish,
        picture: data.picture,
        startDate,
        endDate,
        ownerEmail: [email],
      },
    });

    return newTeam;
  } catch (error) {
    logger.error('Error in updateTeam service');
    throw error;
  }
};

export const deleteTeam = async (ownerEmail: string, teamId: number) => {
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

export const isOwnerTeam = async (email: string, teamId: number) => {
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
