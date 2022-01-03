import { StatusCodes } from 'http-status-codes';
import { ApolloError } from 'apollo-server-errors';
import prisma from '../prisma';
import { createOpinionType, removeOpinionType } from '../apollo/typeDefss/opinionTypeDefs';

export const getListOpinions = (columnId: string) => {
  const opinions = prisma.opinion.findMany({
    where: {
      columnId,
    },
  });

  return opinions;
};

export const getOpinion = async (opinionId: string) => {
  const opinion = await prisma.opinion.findUnique({
    where: {
      id: opinionId,
    },
  });
  return opinion;
};

export const createOpinion = async (meId: string, args: createOpinionType) => {
  const board = await prisma.board.findFirst({
    where: {
      isLocked: false,
      id: args.boardId,
      team: {
        members: {
          some: {
            userId: meId,
          },
        },
      },
    },
  });

  if (!board)
    throw new ApolloError('You dont have permission to do that or data not found', `${StatusCodes.FORBIDDEN}`);

  const opinion = await prisma.opinion.create({
    data: {
      columnId: args.columnId,
      text: args.text,
      isAction: args.isAction,
      authorId: meId,
      updatedBy: meId,
    },
  });

  if (!opinion) throw new ApolloError('Data not found', `${StatusCodes.NOT_FOUND}`);
  return opinion;
};

export const removeOpinion = async (meId: string, args: removeOpinionType) => {
  const opinion = await prisma.opinion.deleteMany({
    where: {
      OR: [
        {
          column: {
            board: {
              team: {
                members: {
                  some: {
                    userId: meId,
                    isOwner: true,
                  },
                },
              },
            },
          },
          id: args.opinionId,
        },
        {
          authorId: meId,
          id: args.opinionId,
        },
      ],
    },
  });

  if (!opinion) throw new ApolloError('You dont have permission or data not found', `${StatusCodes.FORBIDDEN}`);
  return opinion;
};
