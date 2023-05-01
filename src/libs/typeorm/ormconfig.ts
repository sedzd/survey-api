import { DataSourceOptions } from 'typeorm';

import { entities } from 'src/libs/typeorm/entities';
import { migrations } from 'src/libs/typeorm/migrations';
import { AppConfig } from 'src/config';

const username = AppConfig.db.isMigration ? AppConfig.db.migration.user : AppConfig.db.user;
const password = AppConfig.db.isMigration ? AppConfig.db.migration.password : AppConfig.db.password;

export const OrmConfig: DataSourceOptions = {
    synchronize: false,
    logging: AppConfig.nodeEnv !== 'production' && AppConfig.nodeEnv !== 'test',
    entities,
    migrations,
    subscribers: [],

    type: 'postgres',

    installExtensions: false,
    extra: {
        connectionTimeoutMillis: 10_000,
        idleTimeoutMillis: 60_000,
        statement_timeout: 360_000
    },
    replication: {
        master: {
            database: AppConfig.db.database,
            host: AppConfig.db.host,
            port: AppConfig.db.port,
            username,
            password
        },
        slaves: [
            {
                database: AppConfig.db.database,
                host: AppConfig.db.readonly.host,
                port: AppConfig.db.readonly.port,
                username: AppConfig.db.readonly.user,
                password: AppConfig.db.readonly.password
            }
        ]
    }
};
