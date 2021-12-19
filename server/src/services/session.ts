import { v4 as uuidv4 } from 'uuid';
import { addMinutes } from 'date-fns';

import prisma from '../prisma';
import config from '../config';
import logger from '../logger';
import { SanitizedUser } from '../types';
import { User, UserProfile } from '@prisma/client';

export const createSession = async (userId: number, sessionDurationMinutes: number) => {
  const session = await prisma.session.create({
    data: {
      userId,
      expiresAt: addMinutes(new Date(), sessionDurationMinutes),
      token: uuidv4(),
      data: '',
    },
  });
  return session;
};

export const checkAndExtendSession = async (
  email: string,
  token: string,
): Promise<(User & { profile: UserProfile | null }) | null> => {
  try {
    const user = await prisma.user.findFirst({
      where: { email },
      include: {
        profile: true,
      },
    });
    if (!user) return null;
    const now = new Date();
    const session = await prisma.session.findFirst({ where: { userId: user.id, token, expiresAt: { gte: now } } });
    if (!session) return null;
    const newExpiredAt = addMinutes(now, config.SESSION_DURATION_MINUTES);
    await prisma.session.update({
      where: {
        id: user.id,
      },
      data: { expiresAt: newExpiredAt },
    });
    return {
      ...user,
    };
  } catch (error) {
    if (error instanceof Error) logger.error(error.message);
    throw error;
  }
};

export const endSession = async (userId: number, token: string) => {
  try {
    await prisma.$transaction([
      prisma.session.updateMany({ where: { userId, token }, data: { expiresAt: new Date() } }),
      prisma.userProfile.update({ where: { userId }, data: { userStatus: 'OFFLINE' } }),
    ]);
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error.message);
    }
  }
};
