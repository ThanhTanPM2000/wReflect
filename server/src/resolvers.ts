import { RequestWithUserInfo } from './types';
import { user, team } from './services';

export const users = async (_, args, request: RequestWithUserInfo) => {
  const { isAdmin } = request.user;
  if (!isAdmin) throw new Error('User dont have permission');
  const { isGettingAll, search, page, size } = args;
  const { data, total } = await user.getListUsers(search, !!isGettingAll, page, size);
  return { data, total };
};

export const teams = async (args, request: RequestWithUserInfo) => {
  const { id, isAdmin } = request.user;
  const { status, isGettingAll, search, page, size } = args;
  const { data, total } = await team.getListTeams(isAdmin ? undefined : id, status, !!isGettingAll, page, size, search);
  return { data, total };
};

export const createTeam = async (args, request: RequestWithUserInfo) => {
  const { email, id } = request.user;
  return await team.createTeam(email, id, args);
};
