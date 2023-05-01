import express, { Application } from 'express';
import httpContext from 'express-http-context';
import compression from 'compression';
import helmet from 'helmet';
import httpLogger from 'pino-http';

import { setupRoutes } from './route';
import { handleDbError } from './controllers/middlewares/db-error';

import { logger } from 'src/libs/logger/logger';
import { AppConfig } from 'src/config';
import { errorHandler } from 'src/controllers/middlewares/handle-error-code';

export async function createApp(): Promise<Application> {
    const app = express();
    app.set('port', AppConfig.servicePort);
    app.use(helmet());
    app.use(compression());
    app.use(express.json({ limit: '5mb', type: 'application/json' }));
    app.use(express.urlencoded({ extended: true }));
    app.use(httpLogger({ logger }));

    app.use(httpContext.middleware);

    await setupRoutes(app);
    app.use(handleDbError(), errorHandler());

    return app;
}
