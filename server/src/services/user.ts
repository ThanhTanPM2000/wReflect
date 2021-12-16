import prisma from '../prisma';
import logger from '../logger';
import { updateUserType } from '../types';

export const findOrCreateUserByEmail = async (email: string, picture: string, nickname: string) => {
  try {
    const user = await prisma.user.upsert({
      where: { email },
      update: {
        email,
        picture,
        nickname,
      },
      create: {
        email,
        picture,
        nickname,
        profile: {
          create: {
            firstName: 'firstName',
            lastName: 'lastName',
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

export const getUserById = async (userId: number) => {
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

    if (!user) throw new Error('User not found in system');

    return user;
  } catch (error) {
    logger.info('Error in getUserById service');
    throw error;
  }
};

export const updateUser = async (userId: number, args: updateUserType) => {
  try {
    const currentTime = new Date(Date.now());
    const user = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        profile: {
          update: {
            ...args,
            updatedAt: currentTime,
          },
        },
      },
      include: {
        profile: true,
      },
    });

    if (!user) throw new Error('You dont have permission or user not found');

    return user;
  } catch (error) {}
};
