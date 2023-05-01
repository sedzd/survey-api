import { SurveyController } from './controllers/survey';
import { RootController } from './controllers/root';

export interface Initialize {
    surveyController: SurveyController;
    rootController: RootController;
}
