import prisma from '../prisma';
import logger from '../logger';

export const findOrCreateUserByEmail = async (email: string) => {
  try {
    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        email,
        name: 'anonymous',
      },
    });
    return user;
  } catch (error) {
    logger.info('Error in findOrCreateUserByEmail');
    throw error;
  }
};
