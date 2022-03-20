import { ApolloError } from 'apollo-server-errors';
import { StatusCodes } from 'http-status-codes';

export const NotFound = () => {
  throw new ApolloError('Data not found or not allowed to access', `${StatusCodes.NOT_FOUND}`);
};

export const Forbidden = () => {
  throw new ApolloError('You dont have permission for this mutation', `${StatusCodes.FORBIDDEN}`);
};
