import { RequestWithUserInfo } from '../types';
import fs from 'fs';
import { Response } from 'express';
import StatusCodes from 'http-status-codes';
import config from '../config';
import multer from 'multer';

const storage = multer.diskStorage({
  destination: function (req: RequestWithUserInfo, file, cb) {
    const { profile } = req.user;
    const dir = `./public/uploads/${profile?.nickname}`;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const pathtest = dir;
    cb(null, pathtest);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

export const upload = multer({ storage }).single('photo');

export const uploadFile = (req: RequestWithUserInfo & { file: any }, res: Response) => {
  try {
    const { profile } = req.user;
    console.log(req.file);
    res.send(`${config.SERVER_URL}/uploads/${profile?.nickname}/${req.file.filename}`);
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).send();
  }
};
