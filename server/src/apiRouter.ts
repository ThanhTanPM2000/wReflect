import { Router } from 'express';

import { auth, user } from './controllers';
import { uploadFile, upload } from './controllers/file';
import path from 'path';
import multer from 'multer';

// export const uploadImage = uploads.fields([{ name: 'image-file', maxCount: 1 }]);
const apiRouter = (): Router => {
  const router = Router();

  router.post('/login', auth.login);
  router.post('/logout', auth.logout);
  router.post('/upload', upload, uploadFile);

  router.get('/me', user.me);

  return router;
};

export default apiRouter;
