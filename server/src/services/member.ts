import { addMemberToTeamType, setRoleMemberType, getListMembersType, removeMemberType } from '../types';
import logger from '../logger';
import prisma from '../prisma';
import _ from 'lodash';

import { sendMail } from './nodemailer/sentMail';
import { Member, User } from '.prisma/client';
import config from '../config';
import { errorName } from '../constant/errorsConstant';

export const getListMembers = async (teamId?: string, userId?: string) => {
  try {
    const members = await prisma.member.findMany({
      where: {
        teamId,
        userId,
      },
    });

    return members;
  } catch (error) {
    logger.error('Error at getListMembers Service');
    throw error;
  }
};

export const addMembersToTeam = async (invitedBy: string, data: addMemberToTeamType) => {
  try {
    const team = await prisma.team.findFirst({
      where: {
        ownerEmail: {
          has: invitedBy,
        },
        id: data.teamId,
      },
    });

    if (!team) throw new Error(`You are not the owner of Team ${data.teamId}`);

    const currentUsers: User[] = await prisma.user.findMany({
      where: {
        email: {
          in: data.emailUsers,
        },
      },
    });

    const currentMailsUser = currentUsers.map((user) => user.email);

    const success = [] as string[];
    const errors = [] as string[];
    const newEmail = _.filter(data.emailUsers, (email) => !currentMailsUser.includes(email));
    if (newEmail.length > 0) {
      await Promise.all(
        newEmail.map(async (email) => {
          try {
            sendMail(email, `Invite to team ${data.teamId}`, `Someone invite you to team ${team.name} - ${team.id}`);
            success.push(`We have sent email invite to ${email}`);

            await prisma.user.create({
              data: {
                email: email,
                members: {
                  create: {
                    teamId: team.id,
                    invitedBy,
                    isPendingInvitation: true,
                  },
                },
                profile: {
                  create: {
                    picture: `${config.SERVER_URL}/uploads/avatarDefault.png`,
                    nickname: 'Unknown',
                    name: 'Unknown',
                  },
                },
              },
            });
          } catch (error) {
            errors.push(`Something failed with ${email}`);
          }
        }),
      );
    }
    if (currentUsers.length > 0) {
      for (let idx = 0; idx < currentUsers.length; idx++) {
        try {
          const member = await prisma.member.findUnique({
            where: {
              userId_teamId: {
                teamId: data.teamId,
                userId: currentUsers[idx].id,
              },
            },
          });
          if (member) {
            errors.push(`${currentUsers[idx].email} already exists in this team`);
          } else {
            await prisma.member.create({
              data: {
                invitedBy,
                userId: currentUsers[idx].id,
                teamId: data?.teamId,
              },
            });
            prisma.team.update({
              where: {
                id: team.id,
              },
              data: {
                numOfMember: {
                  increment: 1,
                },
              },
            });
            success.push(`${currentUsers[idx]?.email} added in this team`);
          }
        } catch (error) {
          errors.push(`Something failed with ${currentUsers[idx]?.email}`);
        }
      }
    }

    return {
      success,
      errors,
    };
  } catch (error) {
    logger.error('Error at addMemberToTeam');
    throw error;
  }
};

export const removeMember = async (ownerEmail: string, memberId: string) => {
  try {
    const member = await prisma.member.deleteMany({
      where: {
        id: memberId,
        team: {
          ownerEmail: {
            has: ownerEmail,
          },
        },
      },
    });
    if (!member) throw new Error(`You are not the owner of Team`);
    return member;
  } catch (error) {}
};

export const setRoleMember = async (ownerEmail: string, data: setRoleMemberType) => {
  try {
    const team = await prisma.team.findFirst({
      where: {
        ownerEmail: {
          has: ownerEmail,
        },
        id: data.teamId,
      },
    });

    if (!team) throw new Error(`You are not the owner of Team ${data.teamId}`);

    const member = await prisma.member.update({
      where: {
        userId_teamId: {
          teamId: data.teamId,
          userId: data.userId,
        },
      },
      data: {
        isOwner: data.isOwner,
      },
      include: {
        team: true,
        user: true,
      },
    });

    // const index = team.ownerEmail.indexOf(member?.user?.email);
    // if (index > -1) {
    //   team.ownerEmail.splice(index, 1);
    // }

    const updateTeam = data.isOwner
      ? {
          ownerEmail: {
            push: member?.user?.email,
          },
        }
      : {
          ownerEmail: team.ownerEmail,
        };

    await prisma.team.update({
      where: {
        id: data.teamId,
      },
      data: {
        ...updateTeam,
      },
    });

    if (!member) throw new Error('Bad request');
    return member;
  } catch (error) {
    logger.error('Error at setRoleMember');
    throw error;
  }
};
