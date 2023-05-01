import 'source-map-support/register';
import './module-alias';

import gracefulShutdown from 'http-graceful-shutdown';

import { logger } from 'src/libs/logger/logger';
import { createApp } from 'src/app';

const logAndExitProcess = (exitCode: number) => {
    logger.info(
        {
            exit_code_number: exitCode
        },
        'Exiting process'
    );
    process.exit(exitCode);
};

const setupProcessEventListeners = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    process.on('unhandledRejection', (reason: any) => {
        logger.warn({ reason_object: reason }, 'encountered unhandled rejection');
        logAndExitProcess(1);
    });

    process.on('uncaughtException', (err: Error) => {
        logger.error(err, 'encountered uncaught exception');
        logAndExitProcess(1);
    });

    process.on('warning', (warning: Error) => {
        logger.warn(
            {
                warning_object: warning
            },
            'encountered warning'
        );
    });
};

(async () => {
    try {
        const app = await createApp();
        const server = app.listen(app.get('port'), () => {
            logger.info(
                {
                    port_number: app.get('port'),
                    env: app.get('env')
                },
                'Started express server 🚀'
            );
        });

        gracefulShutdown(server);
        setupProcessEventListeners();
    } catch (err) {
        logger.error(err, 'error caught in server.ts');
    }
})();
