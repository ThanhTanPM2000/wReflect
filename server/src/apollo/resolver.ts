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

const resolvers = {
  Query: {
    getTeamIds: async (_, args, { req }: { req: RequestWithUserInfo }) => {
      const { id, isAdmin } = req?.user;
      const result = await team.getTeams(true, 1, 8, '', undefined, isAdmin ? undefined : id);
      const sanitizedTeams = result.data.map((team) => ({
        id: team.id,
        name: team.name,
        picture: team.picture,
        boards: team.boards,
      }));
      return sanitizedTeams;
    },
    teams: async (_, args, { req }: { req: RequestWithUserInfo }) => {
      const { id, isAdmin } = req?.user;
      const { status, isGettingAll, search, page, size } = args?.input;
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
      const { id: meId } = req.user;
      return await board.getListBoardOfTeam(meId, args.teamId);
    },

    board: async (_, args, { req }: { req: RequestWithUserInfo }) => {
      const { id: meId } = req.user;
      return await board.getBoard(meId, args.boardId);
    },
  },
  Mutation: {
    createTeam: async (_, args, { req }: { req: RequestWithUserInfo }) => {
      const { id: meId } = req?.user;
      const myTeam = await team.createTeam(meId, args);
      pubsub.publish('CREATE_TEAM', {
        createdTeam: myTeam,
      });

      return myTeam;
    },
    updateTeam: async (_, args, { req }: { req: RequestWithUserInfo }) => {
      const { id: meId } = req?.user;
      return await team.updateTeam(meId, args);
    },
    deleteTeam: async (_, args, { req }: { req: RequestWithUserInfo }) => {
      const { id: meId } = req?.user;
      return await team.deleteTeam(meId, args?.teamId);
    },
    changeTeamAccess: async (_, args, { req }: { req: RequestWithUserInfo }) => {
      const { id: meId } = req?.user;
      const { teamId, isPublic } = args;
      return await team.changeTeamAccess(meId, teamId, isPublic);
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
      const { id: meId } = req?.user;
      const data = await opinion.createOpinion(meId, args);
      pubsub.publish('UPDATE_BOARD', {
        updateBoard: data?.board,
      });
      return data?.board;
    },
    updateOpinion: async (_, args: updateOpinionType, { req }: { req: RequestWithUserInfo }) => {
      const { id: meId } = req?.user;
      const myOpinion = await opinion.updateOpinion(meId, args);
      pubsub.publish('UPDATE_OPINION', {
        updateOpinion: myOpinion,
      });
      return myOpinion;
    },
    removeOpinion: async (_, args: removeOpinionType, { req }: { req: RequestWithUserInfo }) => {
      const { id: meId } = req?.user;
      const board = await opinion.removeOpinion(meId, args);
      pubsub.publish('UPDATE_BOARD', {
        updateBoard: board,
      });
      return board;
    },
    orderOpinion: async (_, args: orderOpinionType, { req }: { req: RequestWithUserInfo }) => {
      const { id: meId } = req?.user;
      const board = await opinion.orderOpinion(meId, args);
      console.log(board);
      pubsub.publish('UPDATE_BOARD', {
        updateBoard: board,
      });
      return board;
    },
    combineOpinion: async (_, args: combineOpinionType, { req }: { req: RequestWithUserInfo }) => {
      const { id: meId } = req?.user;
      const board = await opinion.combineOpinion(meId, args);
      pubsub.publish('UPDATE_BOARD', {
        updateBoard: board,
      });
      return board;
    },

    createRemark: async (_, args: createRemarkType, { req }: { req: RequestWithUserInfo }) => {
      const { id: meId } = req?.user;
      await remark.createRemark(meId, args);
    },
    removeRemark: async (_, args: removeRemarkType, { req }: { req: RequestWithUserInfo }) => {
      const { id: meId } = req?.user;
      await remark.removeRemark(meId, args);
    },
  },
  Subscription: {
    updateBoard: {
      subscribe: withFilter(
        () => pubsub.asyncIterator('UPDATE_BOARD'),
        (_, args) => {
          return true;
          // return !!_?.updateBoard?.team?.members?.find((member) => member?.userId == args?.meId);
        },
      ),
    },
    updateOpinion: {
      subscribe: withFilter(
        () => pubsub.asyncIterator('UPDATE_OPINION'),
        (_, args) => {
          console.log(_?.updateOpinion?.id === args?.opinionId);
          return _?.updateOpinion.id === args?.opinionId;
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
      const { id: meId } = req.user;
      const boards = await board.getListBoardOfTeam(meId, _.id);
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
      const { id: meId } = req.user;
      const myBoard = await board.getBoard(meId, _?.boarId);
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
    author: async (_, args) => {
      return await user.getUser(_.authorId);
    },
  },
  Remark: {
    opinion: async (_) => {
      const myOpinion = await opinion.getOpinion(_?.opinionId);
      return myOpinion;
    },
    author: async (_) => {
      return await user.getUser(_.authorId);
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
