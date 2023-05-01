import { NextFunction, Request, Response, Router } from 'express';

import { validateSchema } from './middlewares/schema-validator';
import { answerSchema, createSurveySchema, getResultSchema } from './middlewares/schema-validator/schema/survey';

import { SurveyService } from 'src/services/survey';

export class SurveyController {
    private router: Router;

    constructor(private readonly surveySvc: SurveyService) {
        this.router = Router();
        this.router
            .post('/', validateSchema(createSurveySchema), this.create.bind(this))
            .post('/:id/answer', validateSchema(answerSchema), this.answer.bind(this))
            .get('/:id/results', validateSchema(getResultSchema), this.getResults.bind(this));
    }

    getRouter(): Router {
        return this.router;
    }

    async create(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const { question, answers } = req.body;

            const survey = await this.surveySvc.create({ question, answers });

            return res.status(200).json(survey);
        } catch (err) {
            return next(err);
        }
    }

    async answer(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const { userId, answerId } = req.body;
            const { id: surveyId } = req.params;

            const survey = await this.surveySvc.answer({ userId, surveyId, answerId });

            return res.status(200).json(survey);
        } catch (err) {
            return next(err);
        }
    }

    async getResults(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const { id } = req.params;
            const survey = await this.surveySvc.getResults(id);

            return res.status(200).json(survey);
        } catch (err) {
            return next(err);
        }
    }
}
