import { StatusCodes } from 'http-status-codes';
import { ApolloError } from 'apollo-server-errors';
import prisma from '../prisma';
import { orderOpinionType } from '../apollo/typeDefss/opinionTypeDefs';

export const getListBoardOfTeam = async (meId: string, teamId: string) => {
  const boards = await prisma.board.findMany({
    where: {
      teamId,
      team: {
        OR: [
          {
            members: {
              some: {
                userId: meId,
              },
            },
          },
          {
            isPublic: true,
          },
        ],
      },
    },
  });

  return boards;
};

export const getBoard = async (meId: string, boardId: string) => {
  const board = await prisma.board.findFirst({
    where: {
      id: boardId,
      team: {
        OR: [
          {
            members: {
              some: {
                userId: meId,
              },
            },
          },
          {
            isPublic: true,
          },
        ],
      },
    },
  });

  if (!board) throw new ApolloError('You dont have permission, or data not found', `${StatusCodes.FORBIDDEN}`);

  return board;
};

export const orderOpinionInBoard = async (meId: string, args: orderOpinionType) => {


  const board = await prisma.board.updateMany({
    where: {
      isLocked: false,
      columns: {
        some: {
          id: args.source.droppableId,
          opinions: {
            some: {
              id: args.draggableId,
              authorId: meId,
            },
          },
        },
      },
    },
    data: {
    },
  });
};
