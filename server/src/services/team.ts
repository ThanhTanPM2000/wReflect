import logger from '../logger';
import prisma from './../prisma';
import { createTeamType, updateTeamType } from '../types';
import { Team } from '.prisma/client';
import { includes } from 'lodash';

export const getListTeams = async (userId?: number, isGettingAll = false, page = 1, size = 10, search = '') => {
  try {
    const where = {
      members: {
        every: {
          userId,
        },
      },
      AND: {
        name: {
          contains: search,
        },
      },
    };

    const data = await prisma.team.findMany({
      where: { ...where },
      ...(!isGettingAll && { skip: (page - 1) * size }),
      ...(!isGettingAll && { take: size }),
      include: {
        members: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const total = await prisma.team.count({
      where: { ...where },
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

export const findTeam = async (userId: number, teamId: number) => {
  try {
    const team = await prisma.team.findFirst({
      where: {
        id: teamId,
        members: {
          some: {
            userId,
          },
        },
      },
    });

    return team;
  } catch (error) {
    logger.error('Error in findTeam service');
    throw error;
  }
};

export const createTeam = async (ownerEmail: string, data: createTeamType) => {
  try {
    const startDate = data.startDate ? new Date(+data.startDate) : new Date();
    const endDate = data.endDate ? new Date(+data.endDate) : new Date();

    const newTeam = await prisma.team.create({
      data: { ...data, startDate, endDate, ownerEmail: [ownerEmail] },
    });
    return newTeam;
  } catch (error) {
    logger.error('Error in createTeam');
    throw error;
  }
};

export const updateTeam = async (data: updateTeamType): Promise<Team | null> => {
  try {
    const newTeam = prisma.team.update({
      where: { id: data.id },
      data: {
        ...data,
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
