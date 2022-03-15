import prisma from './../prisma';
import { Forbidden } from '../errorsManagement';

export const isMembersOfTeam = async (teamId: string, userId: string) => {
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

  !team && Forbidden();
};

export const isAllowUpdateBoard = async (boardId: string, userId: string) => {
  const board = await prisma.board.findFirst({
    where: {
      isLocked: false,
      id: boardId,
      team: {
        members: {
          some: {
            userId,
          },
        },
      },
    },
  });

  !board && Forbidden();
};

export const isOwnedTeam = async (teamId: string, userId: string) => {
  const team = await prisma.team.findFirst({
    where: {
      id: teamId,
      members: {
        some: {
          userId,
          isOwner: true,
        },
      },
    },
  });

  !team && Forbidden();
};

export const isOwnedOpinion = async (opinionId: string, userId: string) => {
  const opinion = await prisma.opinion.findFirst({
    where: {
      id: opinionId,
      OR: [
        {
          responsible: {
            equals: 'not-assigned',
          },
          column: {
            board: {
              team: {
                members: {
                  some: {
                    userId,
                  },
                },
              },
            },
          },
        },
        {
          responsible: userId,
        },
        {
          column: {
            board: {
              team: {
                members: {
                  some: {
                    userId,
                    isOwner: true,
                  },
                },
              },
            },
          },
        },
      ],
    },
  });

  !opinion && Forbidden();
};
