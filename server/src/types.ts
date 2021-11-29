import { Request } from 'express';

export type SanitizedUser = {
  id: number;
  email: string;
  isAdmin: boolean;
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