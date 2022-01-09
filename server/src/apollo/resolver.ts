import { createRemarkType, removeRemarkType } from './typeDefss/remarkTypeDefs';
import { ForbiddenError } from 'apollo-server-errors';
import { RequestWithUserInfo } from './../types';
import { member, team, user, board, column, opinion, remark } from '../services';
import {
  createOpinionType,
  removeOpinionType,
  orderOpinionType,
  combineOpinionType,
  updateOpinionType,
} from './typeDefss/opinionTypeDefs';

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
      return await team.createTeam(meId, args);
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
      return await member.addMembersToTeam(meId, args);
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
      return await opinion.createOpinion(meId, args);
    },
    updateOpinion: async (_, args: updateOpinionType, { req }: { req: RequestWithUserInfo }) => {
      const { id: meId } = req?.user;
      return await opinion.updateOpinion(meId, args);
    },
    removeOpinion: async (_, args: removeOpinionType, { req }: { req: RequestWithUserInfo }) => {
      const { id: meId } = req?.user;
      return await opinion.removeOpinion(meId, args);
    },
    orderOpinion: async (_, args: orderOpinionType, { req }: { req: RequestWithUserInfo }) => {
      const { id: meId } = req?.user;
      return await opinion.orderOpinion(meId, args);
    },
    combineOpinion: async (_, args: combineOpinionType, { req }: { req: RequestWithUserInfo }) => {
      const { id: meId } = req?.user;
      return await opinion.combineOpinion(meId, args);
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
