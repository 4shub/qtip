import { Request } from 'express';
import { QTIP_AWS_S3_TOP_LEVEL_FOLDER } from '../constants';

export const createConvertImagePathToLocalFileName = (baseUrl: string) => (
    filePath: string
): string =>
    `/${QTIP_AWS_S3_TOP_LEVEL_FOLDER || ''}${baseUrl}${filePath
        .split('/')
        .pop()}`;

export const parseTitle = (content: string): string => {
    const title = content.split('\n', 1)[0];

    const unescapeChar = (str: string): string => {
        // temp: need to make a regex that removes escape characters
        return str.replace(/\\</g, '<');
    }

    return unescapeChar(title.replace(/#/g, ''));
};
