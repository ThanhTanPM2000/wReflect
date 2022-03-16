import { ApolloError } from 'apollo-server-errors';
import { StatusCodes } from 'http-status-codes';

const NotFound = (messageErr?: string): never => {
  throw new ApolloError(messageErr || 'Data not found or not allowed to access', `${StatusCodes.NOT_FOUND}`);
};

const UnAuthorized = (mesageErr?: string): never => {
  throw new ApolloError(mesageErr || 'Unauthorized user', `${StatusCodes.UNAUTHORIZED}`);
};

const Forbidden = (messageErr?: string): never => {
  throw new ApolloError(messageErr || 'You dont have permission for this mutation', `${StatusCodes.FORBIDDEN}`);
};

export default { NotFound, Forbidden, UnAuthorized };
