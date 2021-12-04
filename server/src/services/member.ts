import prisma from '../prisma';

export const getListMembers = async () => {
  try {
    const members = await prisma.member.findMany();
    return members;
  } catch (error) {
    throw error;
  }
};
