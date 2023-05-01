import 'reflect-metadata';

import { AnswerRepository } from './libs/typeorm/answer';
import { UserAnswerRepository } from './libs/typeorm/user-answer';

import { SurveyController } from 'src/controllers/survey';
import { RootController } from 'src/controllers/root';
import { SurveyService } from 'src/services/survey';
import { Initialize } from 'src/init-type';
import { connect } from 'src/db-connect';
import { DbDataSource } from 'src/data-source';
import { SurveyRepository } from 'src/libs/typeorm/survey';

export async function init(): Promise<Initialize> {
    const db = DbDataSource.instance;

    await connect(db);

    const surveyRepo = new SurveyRepository();
    const answerRepo = new AnswerRepository();
    const userAnswerRepo = new UserAnswerRepository();

    const surveyService = new SurveyService(surveyRepo, answerRepo, userAnswerRepo);

    const surveyController = new SurveyController(surveyService);
    const rootController = new RootController();

    return {
        surveyController,
        rootController
    };
}
