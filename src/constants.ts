export const ENVIRONMENT = process.env.NODE_ENV;

export const DATABASE_NAME =
    ENVIRONMENT === 'testing' ? 'qtip-testing' : 'qtip';

export const DATABASE_URI =
    process.env.MONGODB_URI || 'mongodb://localhost:27017';

export const QTIP_AUTH_TOKEN = process.env.QTIP_AUTH_TOKEN;