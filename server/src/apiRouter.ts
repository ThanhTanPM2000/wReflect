import { Router } from 'express';

import { auth, user } from './controllers';
import { uploadFile } from './controllers/file';
import path from 'path';
import multer from 'multer';

// export const uploadImage = uploads.fields([{ name: 'image-file', maxCount: 1 }]);
const apiRouter = (): Router => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const pathtest = './public/uploads';
      cb(null, pathtest);
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  });

  const upload = multer({ storage });

  const router = Router();

  router.post('/login', auth.login);
  router.post('/logout', auth.logout);
  router.post('/upload', upload.single('photo'), uploadFile);

  router.get('/me', user.me);

  return router;
};

export default apiRouter;
