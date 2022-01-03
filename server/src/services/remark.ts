import prisma from '../prisma';

export const getListRemarks = (opinionId: string) => {
  const opinions = prisma.remark.findMany({
    where: {
      opinionId,
    },
  });
  return opinions;
};
