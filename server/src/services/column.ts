import { Forbidden } from './../errorsManagement';
import prisma from '../prisma';
import { isOwnedTeam } from './essential';

export const getListColumns = (boardId: string) => {
  const columns = prisma.column.findMany({
    where: {
      boardId,
    },
    orderBy: {
      position: 'asc',
    },
  });
  return columns;
};

export const getColumn = async (columnId: string) => {
  const column = await prisma.column.findUnique({
    where: {
      id: columnId,
    },
  });
  return column;
};

export const convert = async (teamId: string, boardId: string, columnId: string, userId: string, isAction: boolean) => {
  await isOwnedTeam(teamId, userId);
  const column = await prisma.column.update({
    where: {
      id: columnId,
    },
    data: {
      opinions: {
        updateMany: {
          where: {
            columnId,
          },
          data: {
            isAction,
          },
        },
      },
    },
  });

  return column;
};

export const emptyColumn = async (teamId: string, boardId: string, columnId: string, userId: string) => {
  await isOwnedTeam(teamId, userId);
  const column = await prisma.column.update({
    where: {
      id: columnId,
    },
    data: {
      opinions: {
        deleteMany: {
          columnId,
        },
      },
    },
  });

  return column;
};
