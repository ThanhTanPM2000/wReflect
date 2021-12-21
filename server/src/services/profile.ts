import prisma from '../prisma';
import logger from '../logger';

export const getUserProfile = async (userId: string) => {
  try {
    const userProfile = await prisma.userProfile.findUnique({
      where: {
        userId,
      },
      include: { user: true },
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
