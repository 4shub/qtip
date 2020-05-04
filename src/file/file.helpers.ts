import { Request } from 'express';
import { QTIP_TOP_LEVEL_FOLDER } from '../constants';

export const createConvertImagePathToLocalFileName = (baseUrl: string) => (
    filePath: string
): string => `/${QTIP_TOP_LEVEL_FOLDER || ''}${baseUrl}/${filePath.split('/').pop()}`;
