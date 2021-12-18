import prisma from '../prisma';
import logger from '../logger';
import { UserProfile } from '@prisma/client';

export const getUserProfile = async (userId: number) => {
  try {
    const userProfile = await prisma.userProfile.findUnique({
      where: {
        userId,
      },
      include: { User: true },
    });
    return userProfile;
  } catch (error) {
    logger.error('Error in getUserProfile service');
    throw error;
  }
};

// export const editProfile = (userId: number, data: UserProfile) => {
//   try {
//     const;
//   } catch (error) {
//     logger.error('Error in edit Profile');
//     throw error;
//   }
// };
