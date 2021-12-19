import prisma from '../prisma';
import logger from '../logger';

export const findOrCreateUserByEmail = async (email: string, picture: string, name, nickname: string) => {
  try {
    const user = await prisma.user.upsert({
      where: { email },
      update: {
        email,
        profile: {
          update: {
            nickname,
            name,
            picture,
            userStatus: 'ONLINE',
          },
        },
      },
      create: {
        email,
        profile: {
          create: {
            name,
            picture,
            userStatus: 'ONLINE',
            nickname,
          },
        },
      },
      include: {
        profile: true,
        members: true,
      },
    });
    return user;
  } catch (error) {
    logger.info('Error in findOrCreateUserByEmail');
    throw error;
  }
};

export const getListUsers = async (search = '', isGettingAll = false, page = 1, size = 10) => {
  try {
    const data = await prisma.user.findMany({
      where: {
        email: {
          contains: search,
          mode: 'insensitive',
        },
      },
      ...(!isGettingAll && { skip: (page - 1) * size }),
      ...(!isGettingAll && { take: size }),
      include: {
        members: true,
        profile: true,
      },
      skip: (page - 1) * size,
      take: size,
      orderBy: {
        createdAt: 'asc',
      },
    });

    const total = await prisma.user.count({
      where: {
        email: {
          contains: search,
          mode: 'insensitive',
        },
      },
    });

    return {
      data,
      total,
    };
  } catch (error) {
    logger.error('Error in getListUsers service');
    throw error;
  }
};

export const getUserById = async (email?: string) => {
  try {
    if (!email) return null;
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        members: true,
        profile: true,
      },
    });

    if (!user) throw new Error('User not found in system');

    return user;
  } catch (error) {
    logger.error('Error in getUserById service');
    throw error;
  }
};

export const updateUser = async (userId: number, args: any) => {
  try {
    const user = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        profile: {
          update: {
            picture: args?.picture,
          },
        },
      },
    });

    if (!user) throw new Error('You dont have permission or user not found');

    return user;
  } catch (error) {
    logger.error('Error in updateUser service');
    throw error;
  }
};
