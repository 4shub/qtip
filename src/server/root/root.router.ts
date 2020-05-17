import express from 'express';
import * as controller from './root.controller';
import * as fileController from '../file/file.controller';
import { authenticateUser } from '../middleware';
import { initUploadMiddleware } from '../file/file.middleware';
import { ALLOW_IMAGE_UPLOADS } from '../constants';

const root = express.Router();

root.get('*', controller.getAnyFile);

if (ALLOW_IMAGE_UPLOADS) {
    root.post(
        '/___image',
        authenticateUser,
        initUploadMiddleware(),
        fileController.uploadImage
    );
}

root.post('*', authenticateUser, fileController.postFile);
root.put('*', authenticateUser, fileController.putFile);

root.delete('*', authenticateUser, fileController.deleteFile);

export default root;
