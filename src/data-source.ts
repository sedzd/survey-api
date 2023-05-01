import { DataSource } from 'typeorm';

import { OrmConfig } from 'src/libs/typeorm/ormconfig';

export class DbDataSource {
    static ds: DataSource;

    constructor() {
        throw new Error('Use DataSource.instance');
    }

    static get instance(): DataSource {
        if (!DbDataSource.ds) {
            DbDataSource.ds = new DataSource(OrmConfig);
        }
        return DbDataSource.ds;
    }
}
