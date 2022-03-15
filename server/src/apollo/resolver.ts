import { answerHealthCheckArgs, startSurveyArgs, reopenHealthCheckArgs } from './typeDefss/healthCheckTypeDefs';
import { createRemarkType, removeRemarkType } from './typeDefss/remarkTypeDefs';
import { RequestWithUserInfo } from './../types';
import { member, team, user, board, column, opinion, remark, healthCheck, criteria } from '../services';
import { withFilter } from 'graphql-subscriptions';

import {
  createOpinionType,
  removeOpinionType,
  orderOpinionType,
  combineOpinionType,
  updateOpinionType,
} from './typeDefss/opinionTypeDefs';
import { pubsub } from '../pubSub';
import logger from '../logger';
import { updateBoardType, createBoardType, deleteBoardType } from './typeDefss/boardTypeDefs';
import { prisma, Answer } from '@prisma/client';
import { string } from 'zod';

const resolvers = {
  Query: {
    teams: async (_, args, { req }: { req: RequestWithUserInfo }) => {
      const { id, isAdmin } = req?.user;
      const { status, isGettingAll, search, page, size } = args;
      const result = await team.getTeams(!!isGettingAll, page, size, search, status, isAdmin ? undefined : id);
      return result;
    },
    team: async (_, args, { req }: { req: RequestWithUserInfo }) => {
      const { id, isAdmin } = req?.user;
      const myTeam = await team.getTeam(args.teamId, isAdmin ? undefined : id);
      return myTeam;
    },
    user: async (_, args) => {
      return await user.getUser(args.userId);
    },

    boards: async (_, args, { req }: { req: RequestWithUserInfo }) => {
      const { id: meId, isAdmin } = req?.user || {};
      return await board.getListBoardOfTeam(args.teamId, isAdmin ? undefined : meId);
    },

    board: async (_, args, { req }: { req: RequestWithUserInfo }) => {
      const { id: meId } = req?.user || {};
      const myBoard = await board.getBoard(args.boardId, meId);
      return myBoard;
    },

    getHealthCheck: async (_, args, { req }: { req: RequestWithUserInfo }) => {
      const { id: meId } = req?.user || {};
      const result = await healthCheck.getHealthCheck(args?.teamId, args?.boardId);
      return result;
    },

    criteriaList: async (_, args, { req }: { req: RequestWithUserInfo }) => {
      const criteriaList = await criteria.getListCriteria();
      return criteriaList;
    },
  },
  Mutation: {
    createTeam: async (_, args, { req }: { req: RequestWithUserInfo }) => {
      const myTeam = await team.createTeam(req, args);
      pubsub.publish('CREATE_TEAM', {
        createdTeam: myTeam,
      });

      return myTeam;
    },
    updateTeam: async (_, args, { req }: { req: RequestWithUserInfo }) => {
      return await team.updateTeam(req, args);
    },
    deleteTeam: async (_, args, { req }: { req: RequestWithUserInfo }) => {
      return await team.deleteTeam(req, args?.teamId);
    },

    startSurveyHealthCheck: async (_, args: startSurveyArgs, { req }: { req: RequestWithUserInfo }) => {
      const { id: meId } = req?.user;
      const creatingHealthCheck = await healthCheck.createHealthCheck(meId, args);
      pubsub.publish('START_SURVEY', {
        updateGetHealthCheckData: creatingHealthCheck,
      });
      return creatingHealthCheck;
    },
    answerHealthCheck: async (_, args: answerHealthCheckArgs, { req }: { req: RequestWithUserInfo }) => {
      const { id: meId } = req?.user;
      const setAnswerToHealthCheck = await healthCheck.setAnswerHealthCheck(meId, args);
      pubsub.publish('ANSWER_HEALTH', {
        updateGetHealthCheckData: setAnswerToHealthCheck,
      });
      return setAnswerToHealthCheck;
    },
    reopenHealthCheck: async (_, args: reopenHealthCheckArgs, { req }: { req: RequestWithUserInfo }) => {
      const { id: meId } = req?.user;
      const deletingHealthCheck = await healthCheck.reopenHealthCheck(meId, args);
      pubsub.publish('REOPEN_HEALTH', {
        updateGetHealthCheckData: deletingHealthCheck,
      });
      return deletingHealthCheck;
    },

    changeTeamAccess: async (_, args, { req }: { req: RequestWithUserInfo }) => {
      const { teamId, isPublic } = args;
      return await team.changeTeamAccess(req, teamId, isPublic);
    },
    // usingCurrentBoard: async (_, args, {req}: {req: RequestWithUserInfo}) => {
    //   return await team.changeCurrentBoard
    // },
    createBoard: async (_, args: createBoardType, { req }: { req: RequestWithUserInfo }) => {
      const myBoard = await board.createBoard(req, args);
      pubsub.publish('CREATE_BOARD', {
        updateBoard: myBoard,
      });
      return myBoard;
    },
    updateBoard: async (_, args: updateBoardType, { req }: { req: RequestWithUserInfo }) => {
      const myBoard = await board.updateBoard(req, args);
      pubsub.publish('UPDATE_BOARD', {
        updateBoard: myBoard,
      });
      return myBoard;
    },
    deleteBoard: async (_, args: deleteBoardType, { req }: { req: RequestWithUserInfo }) => {
      const deletingBoard = await board.deleteBoard(req, args);
      pubsub.publish('DELETE_BOARD', {
        deleteBoard: deletingBoard,
      });
      return deletingBoard;
    },
    convertOpinionsInColumn: async (_, args, { req }: { req: RequestWithUserInfo }) => {
      const { id: meId } = req?.user || {};
      const convertingColumn = await column.convert(
        args.teamId,
        args.boardId,
        args.columnId,
        meId,
        args.action == 'ACTIONS' ? true : false,
      );
      pubsub.publish('CONVERT_COLUMN', {
        convertColumn: convertingColumn,
      });
      return convertingColumn;
    },
    emptyColumn: async (_, args, { req }: { req: RequestWithUserInfo }) => {
      const { id: meId } = req?.user || {};
      const emptingColumn = await column.emptyColumn(args.teamId, args.boardId, args.columnId, meId);
      return emptingColumn;
    },

    addMembers: async (_, args, { req }: { req: RequestWithUserInfo }) => {
      const { id: meId } = req?.user;
      const { team, success, errors, warnings } = await member.addMembersToTeam(meId, args);
      pubsub.publish('ADD_MEMBERS', {
        addMembers: team,
      });
      return {
        success,
        errors,
        warnings,
      };
    },
    removeMember: async (_, args, { req }: { req: RequestWithUserInfo }) => {
      const { id: meId } = req?.user;
      pubsub.publish('REMOVE_MEMBER', {
        addMembers: team,
      });
      return await member.removeMember(meId, args.memberId);
    },
    changeRoleMember: async (_, args, { req }: { req: RequestWithUserInfo }) => {
      const { id: meId } = req?.user;
      return await member.changeRoleMember(meId, args);
    },

    createOpinion: async (_, args: createOpinionType, { req }: { req: RequestWithUserInfo }) => {
      const data = await opinion.createOpinion(req, args);

      const array = ['test', 'test2'];
      const anotherArr = ['test3', 'test4'];
      anotherArr.push(...array);
      console.log(anotherArr);

      pubsub.publish('UPDATE_BOARD', {
        updateBoard: data?.board,
      });
      return data?.board;
    },
    updateOpinion: async (_, args: updateOpinionType, { req }: { req: RequestWithUserInfo }) => {
      const { id: meId } = req?.user;
      const myOpinion = await opinion.updateOpinion(args.teamId, meId, args);
      pubsub.publish('UPDATE_OPINION', {
        updateOpinion: { ...myOpinion },
      });
      return myOpinion;
    },
    removeOpinion: async (_, args: removeOpinionType, { req }: { req: RequestWithUserInfo }) => {
      const board = await opinion.removeOpinion(req, args);
      pubsub.publish('UPDATE_BOARD', {
        updateBoard: board,
      });
      return board;
    },
    orderOpinion: async (_, args: orderOpinionType, { req }: { req: RequestWithUserInfo }) => {
      const board = await opinion.orderOpinion(req, args);
      pubsub.publish('ORDER_OPINION', {
        updateBoard: board,
      });
      return board;
    },
    combineOpinion: async (_, args: combineOpinionType, { req }: { req: RequestWithUserInfo }) => {
      const board = await opinion.combineOpinion(req, args);
      pubsub.publish('UPDATE_BOARD', {
        updateBoard: board,
      });
      return board;
    },

    // updateAction: async (_, args, {req}: {req: RequestWithUserInfo} ) => {
    //   const newTeam = await team.updateAction();
    // },

    createRemark: async (_, args: createRemarkType, { req }: { req: RequestWithUserInfo }) => {
      const opinion = await remark.createRemark(req, args);
      pubsub.publish('UPDATE_OPINION', {
        updateOpinion: { ...opinion },
      });
      return opinion;
    },
    removeRemark: async (_, args: removeRemarkType, { req }: { req: RequestWithUserInfo }) => {
      const opinion = await remark.removeRemark(req, args);
      pubsub.publish('UPDATE_OPINION', {
        updateOpinion: { ...opinion },
      });
      return opinion;
    },
  },
  Subscription: {
    // createBoard: {
    //   subcribe: withFilter(
    //     () => pubsub.asyncIterator(['CREATE_BOARD']),
    //     (_, args) => {
    //       return true;
    //     },
    //   ),
    // },
    updateBoard: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(['CREATE_BOARD', 'UPDATE_BOARD', 'ORDER_OPINION']),
        (_, args) => {
          return true;
        },
      ),
    },
    deleteBoard: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(['DELETE_BOARD']),
        (_, args) => {
          return true;
        },
      ),
    },

    updateGetHealthCheckData: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(['START_SURVEY', 'ANSWER_HEALTH', 'REOPEN_HEALTH']),
        (_, args) => {
          return true;
        },
      ),
    },
    // updateMember: {
    //   subscribe: withFilter(
    //     () => pubsub.asyncIterator(['ADD_MEMBERS', 'REMOVE_MEMBER']),
    //     (_, args) => {
    //       return true;
    //     },
    //   ),
    // },

    convertColumn: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(['CONVERT_COLUMN']),
        (_, args) => {
          return true;
        },
      ),
    },

    updateOpinion: {
      subscribe: withFilter(
        () => pubsub.asyncIterator('UPDATE_OPINION'),
        (_, args) => {
          return true;
        },
      ),
    },
  },

  User: {
    members: async (_) => {
      const members = await member.getListMembers(_.id);
      return members;
    },
  },
  Team: {
    boards: async (_, args, { req }: { req: RequestWithUserInfo }) => {
      const { id: meId, isAdmin } = req?.user || {};
      const boards = await board.getListBoardOfTeam(_.id, req ? (isAdmin ? undefined : meId) : args.meId);
      return boards;
    },
    members: async (_) => {
      const members = await member.getListMembers(_.id);
      return members;
    },
  },
  Board: {
    team: async (_, args, { req }: { req: RequestWithUserInfo }) => {
      const { id: meId, isAdmin } = req?.user || {};
      const myTeam = await team.getTeam(_.teamId, req ? (isAdmin ? undefined : meId) : args.meId);
      return myTeam;
    },
    columns: async (_) => {
      const columns = await column.getListColumns(_.id);
      return columns;
    },
  },
  Column: {
    board: async (_, args, { req }: { req: RequestWithUserInfo }) => {
      const { id: meId, isAdmin } = req?.user || {};
      const myBoard = await board.getBoard(_?.boardId, req ? (isAdmin ? undefined : meId) : args.meId);
      return myBoard;
    },
    opinions: async (_) => {
      const opinions = await opinion.getListOpinions(_.id);
      return opinions;
    },
  },
  Opinion: {
    column: async (_) => {
      const myColumn = await column.getColumn(_?.columnId);
      return myColumn;
    },
    remarks: async (_) => {
      const remarks = await remark.getListRemarks(_?.id);
      return remarks;
    },
    author: async (_) => {
      return await user.getUser(_.authorId);
    },
    member: async (_) => {
      return await member.getMember(_.authorId);
    },
  },
  Remark: {
    opinion: async (_) => {
      const myOpinion = await opinion.getOpinion(_?.opinionId);
      return myOpinion;
    },
    author: async (_, args) => {
      return await user.getUser(_.authorId);
    },
    member: async (_) => {
      return await member.getMember(_.authorId);
    },
  },
  Member: {
    user: async (_) => {
      return await user.getUser(_.userId);
    },
    team: async (_, args, { req }: { req: RequestWithUserInfo }) => {
      const { id, isAdmin } = req?.user;
      return await team.getTeam(_.teamId, isAdmin ? undefined : id);
    },
  },
};

export default resolvers;
