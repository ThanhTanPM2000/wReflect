import error from './../errorsManagement';
import { Opinion } from '@prisma/client';
import { RequestWithUserInfo } from './../types';
import { StatusCodes } from 'http-status-codes';
import { ApolloError } from 'apollo-server-errors';
import { createRemarkType, removeRemarkType } from './../apollo/typeDefss/remarkTypeDefs';
import prisma from '../prisma';
import { board, user } from '.';

export const getListRemarks = (opinionId: string) => {
  const opinions = prisma.remark.findMany({
    where: {
      opinionId,
    },
  });
  return opinions;
};

export const createRemark = async (req: RequestWithUserInfo, args: createRemarkType) => {
  const { id: meId } = req.user;

  const currentUser = await user.getUser(meId);
  if (!currentUser) {
    return error.NotFound();
  }

  const board = await prisma.board.findFirst({
    where: {
      id: args.boardId,
      teamId: args.teamId,
      team: {
        members: {
          some: {
            userId: meId,
          },
        },
      },
      columns: {
        some: {
          opinions: {
            some: {
              id: args.opinionId,
            },
          },
        },
      },
    },
  });

  if (!board) return error.NotFound();

  const memberId = currentUser.members.find((member) => member.teamId === args.teamId)?.id;
  if (!memberId) return error.Forbidden();

  const opinion = await prisma.opinion.update({
    where: {
      id: args.opinionId,
    },
    data: {
      remarks: {
        create: {
          text: args.text,
          authorId: meId,
          memberId: memberId,
        },
      },
    },
  });

  return opinion;
};

export const removeRemark = async (req: RequestWithUserInfo, args: removeRemarkType) => {
  const { id: meId } = req?.user;

  const board = await prisma.board.findFirst({
    where: {
      id: args.boardId,
      teamId: args.teamId,
      team: {
        members: {
          some: {
            userId: meId,
          },
        },
      },
      columns: {
        some: {
          opinions: {
            some: {
              id: args.opinionId,
            },
          },
        },
      },
    },
  });

  if (!board) return error.NotFound();

  const opinion = await prisma.opinion.update({
    where: {
      id: args.opinionId,
    },
    data: {
      remarks: {
        delete: {
          id: args?.remarkId,
        },
      },
    },
  });

  return opinion;
};
