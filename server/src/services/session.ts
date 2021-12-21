import { v4 as uuidv4 } from 'uuid';
import { addMinutes } from 'date-fns';

import prisma from '../prisma';
import config from '../config';
import logger from '../logger';
import { User, UserProfile } from '@prisma/client';

export const createSession = async (userId: string, sessionDurationMinutes: number) => {
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
        userId_token: {
          userId: user.id,
          token,
        },
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

export const endSession = async (userId: string, token: string) => {
  try {
    prisma.session.update({
      where: {
        userId_token: {
          userId,
          token,
        },
      },
      data: {
        user: {
          update: {
            userStatus: 'OFFLINE',
          },
        },
        expiresAt: new Date(),
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error.message);
    }
  }
};
