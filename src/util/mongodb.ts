import { MongoClient, Db } from 'mongodb';
import { DATABASE_NAME, DATABASE_URI } from '../constants';

const DB = (function() {
    const databaseName: string = DATABASE_NAME;
    const url: string = DATABASE_URI;
    let database: any = null;
    let client: any = null;

    return {
        load: () => {
            if (database) {
                return database;
            }

            return {
                connect: async (weak?: boolean) => {
                    if (client) {
                        throw 'Connection has already been established';
                    }

                    try {
                        client = await MongoClient.connect(`${url}/${databaseName}`, {
                            useNewUrlParser: true,
                            useUnifiedTopology: true,
                        });

                        if (process.env.NODE_ENV !== 'testing') {
                            console.log(
                                'Connected to MongoDB Instance at %s',
                                url
                            );
                        }

                        database = client.db(databaseName);

                        if (weak) {
                            const wdb = database;
                            database = null;
                            client = null;
                            return wdb;
                        }

                        return DB.load();
                    } catch (err) {
                        throw err.stack;
                    }
                },
            };
        },
        getClient: () => client,
        close: () => {
            client.close();
            console.log(
                'Closing DB connection');
            client = null;
            database = null;
        },
    };
})();

export default DB;
