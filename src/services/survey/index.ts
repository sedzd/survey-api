import { AnswerRequest, SurveyRequest, SurveyResponse, UserAnswerResponse } from './type';

import { StandardError } from 'src/domain/standard-error';
import { Answer } from 'src/domain/answer';
import { Survey } from 'src/domain/survey';
import { AnswerRepository } from 'src/libs/typeorm/answer';
import { SurveyRepository } from 'src/libs/typeorm/survey';
import { UserAnswerRepository } from 'src/libs/typeorm/user-answer';
import { ErrorCodes } from 'src/domain/errors';
import { UserAnswer } from 'src/domain/user-answer';

export class SurveyService {
    public constructor(
        private readonly surveyRepo: SurveyRepository,
        private readonly answerRepo: AnswerRepository,
        private readonly userAnswerRepo: UserAnswerRepository
    ) {}

    public async create({ answers, question }: SurveyRequest): Promise<SurveyResponse> {
        return this.surveyRepo.manager.transaction(async (em) => {
            const survey = new Survey();
            survey.question = question;
            const savedSurvey = await em.save(Survey, survey);
            const answerList = answers.map((a) => {
                const answer = new Answer();
                answer.answerText = a;
                answer.survey = survey;
                return answer;
            });
            const savedAnswers = (await em.save(Answer, answerList)).map(({ id, answerText }) => ({
                id,
                answer: answerText
            }));
            return SurveyService.formatSurveyResponse(savedSurvey, savedAnswers);
        });
    }

    public async answer({ userId, surveyId, answerId }: AnswerRequest): Promise<UserAnswerResponse> {
        const userAnswer = await this.userAnswerRepo.findOneBy({ survey: { id: surveyId }, userId });
        if (userAnswer) {
            throw new StandardError(ErrorCodes.DUPLICATE_ERROR, 'User already answered this survey');
        }
        const answer = await this.answerRepo.findOneByOrFail({ id: answerId, survey: { id: surveyId } });
        const survey = await this.surveyRepo.findOneByOrFail({ id: surveyId });

        const userAnswerEntity = this.userAnswerRepo.create({ userId, survey, answer });

        return SurveyService.formatUserAnswerResponse(await userAnswerEntity.save());
    }

    public async getResults(surveyId: string): Promise<unknown> {
        const results = await this.userAnswerRepo
            .createQueryBuilder('user_answer')
            .select('answer.id', 'answerId')
            .addSelect('answer.answer_text', 'answer')
            .addSelect('COUNT(user_answer.id)', 'count')
            .addSelect('ARRAY_AGG(user_answer.user_id)', 'userIds')
            .leftJoin('user_answer.answer', 'answer')
            .where('user_answer.surveyId = :surveyId', { surveyId })
            .groupBy('answer.id')
            .addGroupBy('answer.answer_text')
            .orderBy('answer.id')
            .getRawMany();
        return results;
    }

    public static formatUserAnswerResponse(ua: UserAnswer): UserAnswerResponse {
        return {
            id: ua.id,
            userId: ua.userId,
            survey: {
                id: ua.survey.id,
                question: ua.survey.question
            },
            UserAnswer: {
                id: ua.answer.id,
                answer: ua.answer.answerText
            },
            created: ua.created,
            updated: ua.updated
        };
    }

    public static formatSurveyResponse(survey: Survey, answers: { id: string; answer: string }[]): SurveyResponse {
        return {
            id: survey.id,
            question: survey.question,
            answers: answers,
            created: survey.created,
            updated: survey.updated
        };
    }
}
