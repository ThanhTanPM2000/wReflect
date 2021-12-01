import logger from '../logger';
import { number } from 'zod';
import Prisma from './../prisma';
import { Team } from '.prisma/client';

export const getListTeams = async (userId: number, isGettingAll = false, page = 1, size = 10, search = '') => {
  try {
    const teams = await Prisma.team.findMany({
      where: {
        members: {
          every: {
            userId,
          },
        },
      },
    });

    return teams;
  } catch (error) {
    logger.error('Error in getListTeams service');
    throw error;
  }
};

export const findTeam = async (userId: number, teamId: number) => {
  try {
    const team = await Prisma.team.findFirst({
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

export const updateTeam = async (team: Team): Promise<Team | null> => {
  try {
    const newTeam = Prisma.team.update({
      where: {
        id: team.id,
      },
      data: {
        name: team.name,
        picture: team.picture,
        status: team.status,
        description: team?.description,
        numOfMember: team?.numOfMember,
        startDate: team.startDate,
        endDate: team.endDate,
      },
    });
    return newTeam;
  } catch (error) {
    logger.error('Error in updateTeam service');
    throw error;
  }
};

export const deleteTeam = async (teamId: number) => {
  try {
    await Prisma.team.delete({
      where: {
        id: teamId,
      },
    });
    return true;
  } catch (error) {
    logger.error('Error in deleteTeam service');
    throw error;
  }
};
