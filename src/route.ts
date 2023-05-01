import { Application } from 'express';

import { init } from 'src/init';
export async function setupRoutes(app: Application) {
    const { surveyController, rootController } = await init();

    app.use('/', rootController.getRouter());
    app.use('/surveys', surveyController.getRouter());
}
