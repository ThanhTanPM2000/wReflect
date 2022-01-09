import { StatusCodes } from 'http-status-codes';
import { ApolloError } from 'apollo-server-errors';
import { createRemarkType, removeRemarkType } from './../apollo/typeDefss/remarkTypeDefs';
import prisma from '../prisma';

export const getListRemarks = (opinionId: string) => {
  const opinions = prisma.remark.findMany({
    where: {
      opinionId,
    },
  });
  return opinions;
};

export const createRemark = async (meId: string, args: createRemarkType) => {
  const opinion = await prisma.opinion.findFirst({
    where: {
      id: args.opinionId,
      column: {
        board: {
          team: {
            members: {
              some: {
                userId: meId,
              },
            },
          },
        },
      },
    },
  });

  if (!opinion) throw new ApolloError('Data not found or you dont have permission', `${StatusCodes.FORBIDDEN}`);

  const remark = await prisma.remark.create({
    data: {
      text: args.text,
      authorId: meId,
      opinionId: args.opinionId,
    },
  });

  if (!remark) throw new ApolloError('Data not found', `${StatusCodes.NOT_FOUND}`);

  return remark;
};

export const removeRemark = async (meId: string, args: removeRemarkType) => {
  const remark = await prisma.remark.deleteMany({
    where: {
      id: args.remarkId,
      opinion: {
        column: {
          board: {
            team: {
              members: {
                some: {
                  userId: meId,
                },
              },
            },
          },
        },
      },
    },
  });
  
};
