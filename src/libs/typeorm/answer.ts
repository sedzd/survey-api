import { Repository } from 'typeorm';

import { DbDataSource } from 'src/data-source';
import { Answer } from 'src/domain/answer';

export class AnswerRepository extends Repository<Answer> {
    constructor() {
        super(Answer, DbDataSource.instance.createEntityManager());
    }
}
