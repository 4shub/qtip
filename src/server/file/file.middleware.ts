import aws from 'aws-sdk';
import multer from 'multer';
import multerS3 from 'multer-s3';
import { Request } from 'express';
import {
    AWS_S3_BUCKET,
    AWS_S3_ENDPOINT,
} from '../constants';
import { createConvertImagePathToLocalFileName } from './file.helpers';

export const initUploadMiddleware = () => {
    const spacesEndpoint = new aws.Endpoint(AWS_S3_ENDPOINT);

    const s3 = new aws.S3({
        endpoint: (spacesEndpoint as unknown) as string,
    });

    return multer({
        storage: multerS3({
            s3: s3,
            bucket: AWS_S3_BUCKET,
            acl: 'public-read',
            key: function (
                req: Request,
                file,
                cb: (v: any, b: string) => void
            ) {
                const fileName = createConvertImagePathToLocalFileName(
                    req.body.path
                )(file.originalname).substr(1);

                cb(null, fileName);
            },
        }),
    }).single('file');
};
