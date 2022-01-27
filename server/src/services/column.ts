import prisma from '../prisma';

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
