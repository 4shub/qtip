export const ENVIRONMENT = process.env.NODE_ENV;

export const DATABASE_NAME =
    ENVIRONMENT === 'testing' ? 'qtip-testing' : 'qtip';

export const DATABASE_URI =
           // heroku
           process.env.MONGO_URI ||
           process.env.MONGODB_URI ||
           'mongodb://localhost:27017';

export const QTIP_AUTH_TOKEN = process.env.QTIP_AUTH_TOKEN;

export const AWS_S3_ENDPOINT: string = process.env
    .QTIP_AWS_S3_ENDPOINT as string;

export const AWS_S3_BUCKET: string = process.env.QTIP_AWS_S3_BUCKET as string;

export const ALLOW_IMAGE_UPLOADS = AWS_S3_ENDPOINT && AWS_S3_BUCKET;

export const AWS_IMAGE_PATH = `https://${AWS_S3_ENDPOINT}/${AWS_S3_BUCKET}`;

export const QTIP_AWS_S3_TOP_LEVEL_FOLDER: string = process.env
    .QTIP_AWS_S3_TOP_LEVEL_FOLDER as string;

export const QTIP_FILE_SYSTEM_NAME: string =
    (process.env.QTIP_FILE_SYSTEM_NAME as string) || 'qtip';
