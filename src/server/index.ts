import DB from './util/mongodb';
import { QTIP_AUTH_TOKEN } from './constants';

if (!QTIP_AUTH_TOKEN) {
    throw 'QTIP_AUTH_TOKEN not provided';
}

(async () => {
    const database = DB.load();

    // connect to db
    await database.connect();

    require('./server');
})();
