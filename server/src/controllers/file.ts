import { RequestWithUserInfo, SanitizedUser } from '../types';
import { Response } from 'express';
import StatusCodes from 'http-status-codes';
import path from 'path';
import config from '../config';

export const uploadFile = (req: RequestWithUserInfo & { file: any }, res: Response) => {
  try {
    console.log(req.file);
    res.send(`${config.SERVER_URL}/uploads/${req.file.filename}`);
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).send();
  }
};
