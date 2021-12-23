import { StatusCodes } from 'http-status-codes';
import config from '../config';
import { Response } from 'express';
import { ForbiddenError, ApolloError } from 'apollo-server-errors';
import { RequestWithUserInfo } from './../types';
import { member, team, user, session } from '../services';

import * as validators from '../controllers/validators/user';
import { User, UserProfile } from '@prisma/client';
import { setCookie } from '../helpers';
import { ZodError } from 'zod';
import logger from '../logger';

const clearCookies = (res: Response) => {
  setCookie('email', '', 0, res);
  setCookie('token', '', 0, res);
  return res.send();
};

const resolvers = {
  Query: {
    // me: async (_, args, { req, res }: { req: RequestWithUserInfo; res: Response }) => {
    //   try {
    //     const { cookies } = validators.me(req);
    //     // const { cookies } = req;
    //     const email = cookies?.email;
    //     const token = cookies?.token;
    //     // /me is unauthenticated and is the first api call from the dashboard
    //     // we want to clean dashboard cookies and let it know it is logged out to render the right view
    //     let sanitizedUser: (User & { profile: UserProfile | null }) | null;
    //     if (!email || !token) {
    //       return clearCookies(res);
    //     } else {
    //       sanitizedUser = await session.checkAndExtendSession(email, token);
    //       if (!sanitizedUser) {
    //         return clearCookies(res);
    //       }
    //     }

    //     const oneDayInMilliseconds = config.SESSION_DURATION_MINUTES * 60 * 1000;
    //     // TODO: Refactor cookie adding and remove to one place
    //     setCookie('email', email, oneDayInMilliseconds, res);
    //     setCookie('token', token, oneDayInMilliseconds, res);

    //     // return res.send(sanitizedUser);
    //     return sanitizedUser;
    //   } catch (err) {
    //     if (err instanceof ZodError) {
    //       return res.status(StatusCodes.BAD_REQUEST).send(err.errors);
    //     }
    //     logger.info(err);
    //     return res.status(StatusCodes.BAD_REQUEST).send();
    //   }
    // },
    teams: async (_, args, { req }: { req: RequestWithUserInfo }) => {
      const { id, isAdmin } = req?.user;
      const { status, isGettingAll, search, page, size } = args?.input;
      const result = await team.getTeams(isAdmin ? undefined : id, status, !!isGettingAll, page, size, search);
      return result;
    },
    team: async (_, args, { req }: { req: RequestWithUserInfo }) => {
      const { id, isAdmin } = req?.user;
      return await team.getTeam(args.teamId, isAdmin ? undefined : id);
    },
    user: async (_, args) => {
      return await user.getUser(args.userId);
    },
    users: async (_, args, { req }: { req: RequestWithUserInfo }) => {
      const { isAdmin } = req?.user;
      const { isGettingAll, search, page, size } = args;
      if (!isAdmin) throw new ForbiddenError('You must admin role to access this request');
      const users = await user.getListUsers(search, !!isGettingAll, page, size);
      return users;
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
  },
  User: {
    members: async (_) => {
      const members = await member.getListMembers(_.id);
      return members;
    },
  },
  Team: {
    members: async (_) => {
      const members = await member.getListMembers(_.id);
      return members;
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
