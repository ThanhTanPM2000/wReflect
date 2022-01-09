import { Opinion, Column } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';
import { ApolloError } from 'apollo-server-errors';
import prisma from '../prisma';
import {
  combineOpinionType,
  createOpinionType,
  orderOpinionType,
  removeOpinionType,
  updateOpinionType,
} from '../apollo/typeDefss/opinionTypeDefs';

export const getListOpinions = (columnId: string) => {
  const opinions = prisma.opinion.findMany({
    where: {
      columnId,
    },
    orderBy: {
      position: 'asc',
    },
  });

  return opinions;
};

export const getOpinion = async (opinionId: string) => {
  const opinion = await prisma.opinion.findUnique({
    where: {
      id: opinionId,
    },
  });
  return opinion;
};

export const createOpinion = async (meId: string, args: createOpinionType) => {
  const board = await prisma.board.findFirst({
    where: {
      isLocked: false,
      id: args.boardId,
      team: {
        members: {
          some: {
            userId: meId,
          },
        },
      },
    },
  });

  if (!board)
    throw new ApolloError('You dont have permission to do that or data not found', `${StatusCodes.FORBIDDEN}`);

  const max = await prisma.opinion.aggregate({
    where: {
      columnId: args.columnId,
    },
    _max: {
      position: true,
    },
  });

  const updatePositionOpinion = args.isCreateBottom
    ? undefined
    : {
        updateMany: {
          where: {
            position: {
              gte: 0,
            },
          },
          data: {
            position: {
              increment: 1,
            },
          },
        },
      };

  const column = await prisma.column.update({
    where: {
      id: args.columnId,
    },
    data: {
      opinions: {
        ...updatePositionOpinion,
        create: {
          text: args.text,
          isAction: args.isAction,
          authorId: meId,
          updatedBy: meId,
          position:
            (max?._max?.position || max?._max?.position == 0) && args.isCreateBottom ? max._max.position + 1 : 0,
        },
      },
    },
    include: {
      opinions: {
        orderBy: {
          position: 'asc',
        },
      },
    },
  });

  if (!column) throw new ApolloError('Data not found', `${StatusCodes.NOT_FOUND}`);
  return column;
};

export const updateOpinion = async (meId: string, args: updateOpinionType) => {
  const opinion = await prisma.opinion.updateMany({
    where: {
      id: args.opinionId,
      OR: [
        {
          authorId: meId,
        },
        {
          column: {
            board: {
              team: {
                members: {
                  some: {
                    isOwner: true,
                    userId: meId,
                  },
                },
              },
            },
          },
        },
      ],
    },
    data: {
      text: args?.text,
      upVote: args?.upVote,
      isBookmarked: args?.isBookmarked,
      isAction: args?.isAction,
      responsible: args?.responsible,
      color: args?.color,
      status: args?.status,
    },
  });
  if (!opinion) throw new ApolloError('Data not found', `${StatusCodes.NOT_FOUND}`);
  return 'success';
};

export const removeOpinion = async (meId: string, args: removeOpinionType) => {
  const opinion = await prisma.opinion.deleteMany({
    where: {
      OR: [
        {
          column: {
            board: {
              team: {
                members: {
                  some: {
                    userId: meId,
                    isOwner: true,
                  },
                },
              },
            },
          },
          id: args.opinionId,
        },
        {
          authorId: meId,
          id: args.opinionId,
        },
      ],
    },
  });

  if (!opinion) throw new ApolloError('You dont have permission or data not found', `${StatusCodes.FORBIDDEN}`);
  return opinion;
};

export const orderOpinion = async (meId: string, args: orderOpinionType) => {
  args.destination.droppableId === args.source.droppableId
    ? args.source.index == args.destination.index
      ? undefined
      : await prisma.column.update({
          where: {
            id: args.destination.droppableId,
          },
          data: {
            opinions: {
              updateMany: [
                {
                  where: {
                    position: args.destination.index,
                  },
                  data: {
                    position: args.source.index,
                  },
                },
                {
                  where: {
                    id: args.draggableId,
                  },
                  data: { position: args.destination.index },
                },
              ],
            },
          },
        })
    : await prisma.$transaction([
        prisma.column.update({
          where: {
            id: args.source.droppableId,
          },
          data: {
            opinions: {
              disconnect: {
                id: args.draggableId,
              },
              updateMany: {
                where: {
                  position: {
                    gt: args.source.index,
                  },
                },
                data: {
                  position: {
                    decrement: 1,
                  },
                },
              },
            },
          },
        }),
        prisma.column.update({
          where: {
            id: args.destination.droppableId,
          },
          data: {
            opinions: {
              connect: {
                id: args.draggableId,
              },
              updateMany: [
                {
                  where: {
                    position: {
                      gte: args.destination.index,
                    },
                  },
                  data: {
                    position: {
                      increment: 1,
                    },
                  },
                },
                {
                  where: {
                    id: args.draggableId,
                  },
                  data: {
                    position: args.destination.index,
                  },
                },
              ],
            },
          },
        }),
      ]);
  return 'success';
};

export const combineOpinion = async (meId: string, args: combineOpinionType) => {
  const currentOpinion = await prisma.opinion.findFirst({
    where: {
      id: args.draggableId,
    },
    include: {
      remarks: true,
    },
  });

  if (!currentOpinion) throw new ApolloError('Data not found', `${StatusCodes.NOT_FOUND}`);

  await prisma.$transaction([
    prisma.column.update({
      where: {
        id: args.combine.droppableId,
      },
      data: {
        opinions: {
          update: {
            where: {
              id: args.combine.draggableId,
            },
            data: {
              text: args.text,
              mergedAuthors: {
                push: currentOpinion.authorId,
              },
              remarks: {
                connect: currentOpinion.remarks.map((remark) => {
                  return { id: remark.id };
                }),
              },
              upVote: {
                push: currentOpinion.upVote,
              },
            },
          },
        },
      },
    }),
    prisma.column.update({
      where: {
        id: args.source.droppableId,
      },
      data: {
        opinions: {
          updateMany: {
            where: {
              position: {
                gt: args.source.index,
              },
            },
            data: {
              position: {
                decrement: 1,
              },
            },
          },
          delete: {
            id: args.draggableId,
          },
        },
      },
    }),
  ]);
  return 'sucess';
};
