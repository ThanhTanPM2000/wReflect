import { addMemberToTeamType } from '../types';
import logger from '../logger';
import prisma from '../prisma';
import { create } from 'lodash';

export const getListMembers = async (teamId: number) => {
  try {
    const members = await prisma.member.findMany({
      where: {
        teamId,
      },
    });
    return members;
  } catch (error) {
    logger.error('Error at getListMembers Service');
    throw error;
  }
};

export const addMemberToTeam = async (assignedBy: string, data: addMemberToTeamType) => {
  try {
    const team = prisma.team.findFirst({
      where: {
        ownerEmail: {
          has: assignedBy,
        },
        id: data.teamId,
      },
    });

    if (!team) throw new Error(`You are not the owner of Team ${data.teamId}`);

    let member = await prisma.member.findUnique({
      where: {
        userId_teamId: {
          ...data,
        },
      },
    });

    if (member) throw new Error(`This member already joined in Team`);

    member = await prisma.member.create({
      data: {
        assignedBy,
        ...data,
      },
    });

    // const member = await prisma.member.upsert({
    //   where: {
    //     userId_teamId: {
    //       ...data,
    //     },
    //   },
    //   update: {
    //     assignedBy,
    //   },
    //   create: {
    //     ...data,
    //     assignedBy,
    //   },
    // });

    return member;
  } catch (error) {
    logger.error('Error at addMemberToTeam');
    throw error;
  }
};

// export const setRoleMember = (data: addMemberToTeamType) => {

// };
