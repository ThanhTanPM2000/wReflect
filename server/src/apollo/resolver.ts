import { updateOpinion } from './../services/opinion';
import { createRemarkType, removeRemarkType } from './typeDefss/remarkTypeDefs';
import { RequestWithUserInfo } from './../types';
import { member, team, user, board, column, opinion, remark } from '../services';
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
import { updateBoardType } from './typeDefss/boardTypeDefs';

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
      return await team.getTeam(args.teamId, isAdmin ? undefined : id);
    },
    user: async (_, args) => {
      return await user.getUser(args.userId);
    },

    boards: async (_, args, { req }: { req: RequestWithUserInfo }) => {
      return await board.getListBoardOfTeam(req, args.teamId);
    },

    board: async (_, args, { req }: { req: RequestWithUserInfo }) => {
      const myBoard = await board.getBoard(req, args.boardId);
      return myBoard;
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
    changeTeamAccess: async (_, args, { req }: { req: RequestWithUserInfo }) => {
      const { teamId, isPublic } = args;
      return await team.changeTeamAccess(req, teamId, isPublic);
    },

    updateBoard: async (_, args: updateBoardType, { req }: { req: RequestWithUserInfo }) => {
      const myBoard = await board.updateBoard(req, args);
      pubsub.publish('UPDATE_BOARD', {
        updateBoard: myBoard,
      });
      return myBoard;
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
      return await member.removeMember(meId, args.memberId);
    },
    changeRoleMember: async (_, args, { req }: { req: RequestWithUserInfo }) => {
      const { id: meId } = req?.user;
      return await member.changeRoleMember(meId, args);
    },

    createOpinion: async (_, args: createOpinionType, { req }: { req: RequestWithUserInfo }) => {
      const data = await opinion.createOpinion(req, args);
      pubsub.publish('UPDATE_BOARD', {
        updateBoard: data?.board,
      });
      return data?.board;
    },
    updateOpinion: async (_, args: updateOpinionType, { req }: { req: RequestWithUserInfo }) => {
      const myOpinion = await opinion.updateOpinion(req, args);
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
    updateBoard: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(['UPDATE_BOARD', 'ORDER_OPINION']),
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
      const boards = await board.getListBoardOfTeam(req, _.id);
      return boards;
    },
    members: async (_) => {
      const members = await member.getListMembers(_.id);
      return members;
    },
  },
  Board: {
    team: async (_, args, { req }: { req: RequestWithUserInfo }) => {
      const { id: meId, isAdmin } = req.user;
      const myTeam = await team.getTeam(_.teamId, isAdmin ? undefined : meId);
      return myTeam;
    },
    columns: async (_) => {
      const columns = await column.getListColumns(_.id);
      return columns;
    },
  },
  Column: {
    board: async (_, args, { req }: { req: RequestWithUserInfo }) => {
      const myBoard = await board.getBoard(req, _?.boarId);
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
