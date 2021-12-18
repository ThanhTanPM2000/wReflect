import { getListTeams } from './services/team';
import { Request } from 'express';
import { User, UserProfile } from '@prisma/client';

export type SanitizedUser = {
  id: number;
  email: string;
  isAdmin: boolean;
  picture: string;
  status: string;
};

export interface RequestWithUserInfo extends Request {
  user: User & { profile: UserProfile | null };
}

export type UserStatus = 'NotInitiated' | 'Initiated' | 'Completed';
export enum UserStatusEnum {
  NotInitiated = 'NotInitiated',
  Initiated = 'Initiated',
  Completed = 'Completed',
}

export const apiPaths = ['/api', '/graphql'];

export type createTeamType = {
  name: string;
  startDate: string;
  endDate: string;
  isPublish: boolean;
  description?: string;
  picture?: string;
};

export type updateTeamType = {
  id: number;
  name?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
  isPublish?: boolean;
  picture?: string;
  description?: string;
};

export type updateProfileType = {
  introduction?: string;
  talents?: string[];
  interests?: string[];
  name?: string;
};

export type addMemberToTeamType = {
  emailUsers: string[];
  teamId: number;
};

export type removeMemberType = {
  email: string;
  teamId: number;
};

export type setRoleMemberType = {
  email: string;
  teamId: number;
  isOwner: boolean;
};

export type getListDataType = {
  status?: string;
  isGettingAll?: boolean;
  search?: string;
  page?: number;
  size?: number;
};

export type getListMembersType = {
  teamId: number;
};

export type updateUserType = {
  firstName?: string;
  lastName?: string;
  gender?: string;
  workplace?: string;
  userStatus?: string;
  school?: string;
  introduction?: string;
  phoneNumbers?: string[];
  photos?: string[];
  talents?: string;
  interests?: string;
};
