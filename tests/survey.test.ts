import { SurveyService } from 'src/services/survey';
import { SurveyRepository } from 'src/libs/typeorm/survey';
import { AnswerRepository } from 'src/libs/typeorm/answer';
import { UserAnswerRepository } from 'src/libs/typeorm/user-answer';

describe('SurveyService', () => {
    const surveyRepositoryMock = new (SurveyRepository as jest.Mocked<typeof SurveyRepository>)();
    const answerRepositoryMock = new (AnswerRepository as jest.Mocked<typeof AnswerRepository>)();
    const userAnswerRepositoryMock = new (UserAnswerRepository as jest.Mocked<typeof UserAnswerRepository>)();
    const surveyService = new SurveyService(surveyRepositoryMock, answerRepositoryMock, userAnswerRepositoryMock);

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('create', () => {
        it('should create a survey', async () => {
            const surveyRequest = {
                question: 'What is your favorite color?',
                answers: ['Blue', 'Green', 'Red', 'Yellow']
            };

            jest.spyOn(surveyRepositoryMock.manager, 'transaction').mockImplementation(() => null);

            await surveyService.create(surveyRequest);

            expect(surveyRepositoryMock.manager.transaction).toHaveBeenCalledOnce();
        });
    });
    describe('answer', () => {
        it('should answer a survey', async () => {
            const answerRequest = {
                userId: '12345',
                surveyId: '1',
                answerId: '2'
            };

            const survey = {
                id: '1',
                question: 'What is your favorite color?'
            };

            const answer = {
                id: '2',
                answerText: 'Green',
                survey
            };

            const userAnswer = {
                id: '1',
                userId: '12345',
                survey,
                answer
            };

            userAnswerRepositoryMock.findOneBy = jest.fn().mockResolvedValue(null);
            answerRepositoryMock.findOneByOrFail = jest.fn().mockResolvedValue(answer);
            surveyRepositoryMock.findOneByOrFail = jest.fn().mockResolvedValue(survey);
            userAnswerRepositoryMock.create = jest.fn().mockReturnValue({ save: () => userAnswer });

            const result = await surveyService.answer(answerRequest);

            expect(result).toEqual({
                id: '1',
                userId: '12345',
                survey: {
                    id: '1',
                    question: 'What is your favorite color?'
                },
                UserAnswer: {
                    id: '2',
                    answer: 'Green'
                }
            });

            expect(userAnswerRepositoryMock.findOneBy).toHaveBeenCalledWith({
                survey: { id: answerRequest.surveyId },
                userId: answerRequest.userId
            });
            expect(answerRepositoryMock.findOneByOrFail).toHaveBeenCalledWith({
                id: answerRequest.answerId,
                survey: { id: answerRequest.surveyId }
            });
            expect(surveyRepositoryMock.findOneByOrFail).toHaveBeenCalledWith({ id: answerRequest.surveyId });
            expect(userAnswerRepositoryMock.create).toHaveBeenCalledWith({
                userId: answerRequest.userId,
                survey,
                answer
            });
        });
    });

    describe('getResults', () => {
        it('should return survey results', async () => {
            const surveyId = '1';

            const results = [
                {
                    answerId: '2',
                    answer: 'Green',
                    count: '2',
                    userIds: ['123473', '12347312']
                },
                {
                    answerId: '1',
                    answer: 'Blue',
                    count: '5',
                    userIds: ['12345', '123', '12347', '12346', '1234']
                }
            ];

            userAnswerRepositoryMock.createQueryBuilder = jest.fn().mockReturnValue({
                select: jest.fn().mockReturnThis(),
                addSelect: jest.fn().mockReturnThis(),
                leftJoin: jest.fn().mockReturnThis(),
                where: jest.fn().mockReturnThis(),
                groupBy: jest.fn().mockReturnThis(),
                addGroupBy: jest.fn().mockReturnThis(),
                orderBy: jest.fn().mockReturnThis(),
                getRawMany: jest.fn().mockResolvedValue(results)
            });

            const result = await surveyService.getResults(surveyId);

            expect(result).toEqual(results);
            expect(userAnswerRepositoryMock.createQueryBuilder).toHaveBeenCalledWith('user_answer');
        });
    });
});
