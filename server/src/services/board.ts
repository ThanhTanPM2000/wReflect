import { RequestWithUserInfo } from './../types';
import { updateBoardType } from './../apollo/typeDefss/boardTypeDefs';
import { StatusCodes } from 'http-status-codes';
import { ApolloError } from 'apollo-server-errors';
import prisma from '../prisma';
import _, { now } from 'lodash';
import { NotFound } from '../errorsManagement';

export const getListBoardOfTeam = async (req: RequestWithUserInfo, teamId: string) => {
  const { id } = req?.user;
  const boards = await prisma.board.findMany({
    where: {
      teamId,
      team: {
        OR: [
          {
            members: {
              some: {
                userId: id,
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

export const getBoard = async (req: RequestWithUserInfo, boardId: string) => {
  const { id: meId } = req.user;
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
    include: {
      columns: {
        include: {
          opinions: {
            include: {
              remarks: true,
              author: true,
            },
          },
        },
      },
      team: {
        include: {
          members: {
            include: {
              user: {
                include: {
                  profile: true,
                },
              },
            },
          },
        },
      },
    },
  });

  !board && NotFound();

  return board;
};

export const updateBoard = async (req: RequestWithUserInfo, args: updateBoardType) => {
  const { id: meId } = req?.user;

  const team = await prisma.team.findFirst({
    where: {
      id: args.teamId,
      ownerId: meId,
    },
  });

  // if (!team) throw new ApolloError('You dont have permission, or data not found', `${StatusCodes.FORBIDDEN}`);
  !team && NotFound();

  const board = await prisma.board.update({
    where: {
      id: args.boardId,
    },
    data: {
      isPublic: args?.isPublic,
      isLocked: args?.isLocked,
      disableDownVote: args?.disableDownVote,
      disableUpVote: args?.disableUpVote,
      isAnonymous: args?.isAnonymous,
      votesLimit: args?.votesLimit,
      title: args?.title,
      timerInProgress: args?.timerInProgress,
      type: args?.type,
      currentPhase: args?.currentPhase,
      endTime: args?.endTime ? new Date(+args.endTime) : new Date(),
    },
    include: {
      columns: {
        include: {
          opinions: {
            include: {
              remarks: true,
            },
          },
        },
      },
      team: {
        include: {
          members: {
            include: {
              user: {
                include: {
                  profile: true,
                },
              },
            },
          },
        },
      },
    },
  });

  return board;
};
