import prisma from '../prisma';
import logger from '../logger';

export const findOrCreateUserByEmail = async (email: string, picture?: string) => {
  try {
    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        email,
        name: 'anonymous',
        picture,
      },
    });
    return user;
  } catch (error) {
    logger.info('Error in findOrCreateUserByEmail');
    throw error;
  }
};

export const getUserById = async (userId: number) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    return user;
  } catch (error) {
    logger.info('Error in getUserById service');
    throw error;
  }
};

type UpdateUserAttributes = {
  name: String;
  picture: String;
};

export const updateUser = async (userId: number, attributes: UpdateUserAttributes) => {};
