import { errorType } from './constant/errorsConstant';

export const getErrorCode = (errorName) => {
  return errorType(errorName);
};
