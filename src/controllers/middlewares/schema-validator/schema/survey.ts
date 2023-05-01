import { array, string } from 'yup';

import { Path } from '../type';

export const createSurveySchema = {
    [Path.BODY]: {
        question: string().lowercase().trim().required(),
        answers: array()
            .of(string().lowercase().trim())
            .test(
                'unique',
                '${path} must be unique values',
                (list) => list.length === new Set(list.map((a: unknown) => a)).size
            )
            .required()
    }
};

export const answerSchema = {
    [Path.PARAMS]: {
        id: string().uuid().required()
    },
    [Path.BODY]: {
        userId: string().lowercase().trim().required(),
        answerId: string().uuid().required()
    }
};

export const getResultSchema = {
    [Path.PARAMS]: {
        id: string().uuid().required()
    }
};
