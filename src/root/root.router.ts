import express from 'express';
import * as controller from './root.controller';
import * as fileController from '../file/file.controller';
import { authenticateUser } from '../middleware';

const root = express();

root.get('*', controller.getAnyFile);
root.post('*', authenticateUser, fileController.postFile);
root.put('*', authenticateUser, fileController.putFile);

root.delete('*', authenticateUser, fileController.deleteFile);

export default root;
