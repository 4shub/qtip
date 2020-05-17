export const ENVIRONMENT = process.env.NODE_ENV;

const [HEROKU_DEFAULT_DATABASE_URI, HEROKU_DATABASE_NAME] = (() => {
    if (process.env.IS_HEROKU) {
        const matches = (process.env.MONGO_URI as string).match(/(.*)\/(.*)/);

        return [matches && matches[1], matches && matches[2]];
    }

    return [null, null];
})();

export const DATABASE_NAME =
    HEROKU_DATABASE_NAME ||
    (ENVIRONMENT === 'testing' ? 'qtip-testing' : 'qtip');

console.log('a', DATABASE_NAME);

export const DATABASE_URI =
    process.env.MONGODB_URI ||
    HEROKU_DEFAULT_DATABASE_URI ||
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

export const PORT = process.env.PORT || 4225;
