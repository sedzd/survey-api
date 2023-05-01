import { Repository } from 'typeorm';

import { Survey } from 'src/domain/survey';
import { DbDataSource } from 'src/data-source';

export class SurveyRepository extends Repository<Survey> {
    constructor() {
        super(Survey, DbDataSource.instance.createEntityManager());
    }
}
