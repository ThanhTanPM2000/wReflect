import { Request } from 'express';

export type SanitizedUser = {
  id: number;
  email: string;
  isAdmin: boolean;
  picture: string | null;
};

export interface RequestWithUserInfo extends Request {
  user: SanitizedUser;
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
  description?: string;
  picture?: string;
};

export type updateTeamType = {
  id: number;
  name?: string;
  ownerEmail?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
  picture?: string;
  description?: string;
};
