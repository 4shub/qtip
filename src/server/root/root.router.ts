import express from 'express';
import * as controller from './root.controller';
import * as fileController from '../file/file.controller';
import { authenticateUser } from '../middleware';
import { uploadMiddleware } from '../file/file.middleware';

const root = express.Router();

root.get('*', controller.getAnyFile);

root.post('/___image', authenticateUser, uploadMiddleware, fileController.uploadImage);
root.post('*', authenticateUser, fileController.postFile);
root.put('*', authenticateUser, fileController.putFile);

root.delete('*', authenticateUser, fileController.deleteFile);

export default root;
