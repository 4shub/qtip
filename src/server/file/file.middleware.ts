import aws from 'aws-sdk';
import multer from 'multer';
import multerS3 from 'multer-s3';
import { AWS_S3_BUCKET, AWS_S3_ENDPOINT } from '../constants';
import { Request } from 'express';
import { createConvertImagePathToLocalFileName } from './file.helpers';

const spacesEndpoint = new aws.Endpoint(AWS_S3_ENDPOINT);

const s3 = new aws.S3({
    endpoint: (spacesEndpoint as unknown) as string,
});

export const uploadMiddleware = multer({
    storage: multerS3({
        s3: s3,
        bucket: AWS_S3_BUCKET,
        acl: 'public-read',
        key: function (req: Request, file, cb: (v: any, b: string) => void) {
            const fileName = createConvertImagePathToLocalFileName(req.body.path)(
                file.originalname
            ).substr(1);

            cb(null, fileName);
        },
    }),
}).single('file');
