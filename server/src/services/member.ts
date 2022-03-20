import { addMemberToTeamType, setRoleMemberType } from '../types';
import logger from '../logger';
import prisma from '../prisma';
import _, { update } from 'lodash';

import { sendMail } from './nodemailer';
import { User } from '.prisma/client';
import config from '../config';
import { ApolloError } from 'apollo-server-errors';
import { StatusCodes } from 'http-status-codes';

export const getListMembers = async (teamId?: string, userId?: string) => {
  const members = await prisma.member.findMany({
    where: {
      teamId,
      userId,
    },
    orderBy: {
      isOwner: 'desc',
    },
  });

  return members;
};

export const getMember = async (memberId?: string) => {
  const member = await prisma.member.findUnique({
    where: {
      id: memberId,
    },
  });

  if (!member) throw new ApolloError('Data not found', `${StatusCodes.NOT_FOUND}`);
  return member;
};

export const addMembersToTeam = async (meId: string, args: addMemberToTeamType) => {
  const team = await prisma.team.findFirst({
    where: {
      id: args.teamId,
      members: {
        some: {
          isOwner: {
            equals: true,
          },
          userId: meId,
        },
      },
    },
  });

  if (!team) throw new ApolloError(`You are not the owner of this Team`, `${StatusCodes.FORBIDDEN}`);

  const currentUsers: User[] = await prisma.user.findMany({
    where: {
      email: {
        in: args.emailUsers,
      },
    },
  });
  const currentMailsUser = currentUsers.map((user) => user.email);

  const success = [] as string[];
  const warnings = [] as string[];
  const errors = [] as string[];
  const newEmail = _.filter(args.emailUsers, (email) => !currentMailsUser.includes(email));
  if (newEmail.length > 0) {
    for (let idx = 0; idx < newEmail.length; idx++) {
      const email = newEmail[idx];
      try {
        sendMail(email, `Invite to team ${args.teamId}`, `Someone invite you to team ${team.name} - ${args.teamId}`);
        warnings.push(`We have sent email invite to ${email}`);

        await prisma.user.create({
          data: {
            email: email,
            members: {
              create: {
                teamId: args.teamId,
                invitedBy: meId,
                isPendingInvitation: true,
              },
            },
            nickname: 'Pending Invitation',
            picture: `${config.SERVER_URL}/uploads/avatarDefault.png`,
          },
        });
      } catch (error) {
        errors.push(`Something failed with ${email}`);
      }
    }
  }

  if (currentUsers.length > 0) {
    for (let idx = 0; idx < currentUsers.length; idx++) {
      try {
        const member = await prisma.member.findUnique({
          where: {
            userId_teamId: {
              teamId: args.teamId,
              userId: currentUsers[idx].id,
            },
          },
        });
        if (member) {
          errors.push(`${currentUsers[idx].email} already exists in this team`);
        } else {
          await prisma.member.create({
            data: {
              invitedBy: meId,
              userId: currentUsers[idx].id,
              teamId: args?.teamId,
            },
          });
          success.push(`${currentUsers[idx]?.email} added in this team`);
        }
      } catch (error) {
        errors.push(`Something failed with ${currentUsers[idx]?.email}`);
      }
    }
  }
  const updatedTeam = await prisma.team.findUnique({
    where: {
      id: args.teamId,
    },
    include: {
      members: true,
    },
  });

  return {
    team: updatedTeam,
    success,
    warnings,
    errors,
  };
};

export const removeMember = async (meId: string, memberId: string) => {
  const member = await prisma.member.deleteMany({
    where: {
      id: memberId,
      team: {
        members: {
          some: {
            isOwner: true,
            userId: meId,
          },
        },
      },
    },
  });

  if (!member || member?.count == 0) throw new ApolloError(`You are not the owner of Team`, `${StatusCodes.FORBIDDEN}`);

  return member;
};

export const changeRoleMember = async (meId: string, data: setRoleMemberType) => {
  const team = await prisma.team.findFirst({
    where: {
      id: data.teamId,
      members: {
        some: {
          userId: meId,
          isOwner: {
            equals: true,
          },
        },
      },
    },
    include: { members: true },
  });

  if (!team) throw new ApolloError(`You are not the owner of Team ${data.teamId}`, `${StatusCodes.FORBIDDEN}`);

  if (team.members.filter((member) => member.isOwner).length <= 1 && !data.isOwner)
    throw new ApolloError(`Owner at least one in the team`, `${StatusCodes.METHOD_NOT_ALLOWED}`);

  const member = await prisma.member.update({
    where: {
      id: data.memberId,
    },
    data: {
      isOwner: data.isOwner,
    },
    include: {
      team: true,
      user: true,
    },
  });

  return member;
};
