export type SurveyResponse = {
    id: string;
    question: string;
    answers: { id: string; answer: string }[];
    created: Date;
    updated: Date;
};

export type UserAnswerResponse = {
    id: string;
    userId: string;
    survey: {
        id: string;
        question: string;
    };
    UserAnswer: { id: string; answer: string };
    created: Date;
    updated: Date;
};

export type SurveyRequest = { answers: string[]; question: string };
export type AnswerRequest = {
    userId: string;
    surveyId: string;
    answerId: string;
};
