import { errorName } from '../constant/errorsConstant';
import prisma from '../prisma';
import logger from '../logger';

export const findOrCreateUserByEmail = async (email: string, picture: string, name, nickname: string) => {
  try {
    const user = await prisma.user.upsert({
      where: { email },
      update: {
        email,
        userStatus: 'ONLINE',
        profile: {
          update: {
            nickname,
            name,
            picture,
          },
        },
      },
      create: {
        email,
        userStatus: 'ONLINE',
        profile: {
          create: {
            name,
            picture,
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

export const getUser = async (userId: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        members: true,
        profile: true,
      },
    });

    if (!user) throw new Error(errorName.NOTFOUND);

    return user;
  } catch (error) {
    logger.error('Error in getUserById service');
    throw error;
  }
};

export const updateUser = async (userId: string, args: any) => {
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

    if (!user) throw new Error(errorName.FORBIDDEN);

    return user;
  } catch (error) {
    logger.error('Error in updateUser service');
    throw error;
  }
};
