import { DataSource } from 'typeorm';
import { PostgresDriver } from 'typeorm/driver/postgres/PostgresDriver';
import { Pool } from 'pg';

import { logger } from 'src/libs/logger/logger';
import { sleep } from 'src/libs/sleep';

// Handles unstable/intermittent connection lost to DB
function connectionGuard(connection: DataSource) {
    // Access underlying pg driver
    if (connection.driver instanceof PostgresDriver) {
        const pool = connection.driver.master as Pool;

        // Add handler on pool error event
        pool.on('error', async (err) => {
            logger.error(err, 'Connection pool erring out, Reconnecting...');
            try {
                await connection.destroy();
            } catch (innerErr) {
                logger.error(innerErr, 'Failed to close connection');
            }
            while (!connection.isInitialized) {
                try {
                    await connection.initialize(); // eslint-disable-line
                    logger.info('Reconnected DB');
                } catch (error) {
                    logger.error(error, 'Reconnect Error');
                }

                if (!connection.isInitialized) {
                    // Throttle retry
                    await sleep(500); // eslint-disable-line
                }
            }
        });
    }
}

// 1. Wait for db to come online and connect
// 2. On connection instability, able to reconnect
// 3. The app should never die due to connection issue
export async function connect(ds: DataSource): Promise<void> {
    let isInitialized = false;
    ds.initialize();
    logger.info('Connecting to DB...');
    while (!isInitialized) {
        try {
            isInitialized = ds.isInitialized;
        } catch (error) {
            logger.error(error, 'createConnection Error');
        }

        if (!isInitialized) {
            // Throttle retry
            await sleep(500); // eslint-disable-line
        }
    }

    logger.info('Connected to DB 🔌');
    connectionGuard(ds);
}
