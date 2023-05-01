import { Repository } from 'typeorm';

import { DbDataSource } from 'src/data-source';
import { UserAnswer } from 'src/domain/user-answer';

export class UserAnswerRepository extends Repository<UserAnswer> {
    constructor() {
        super(UserAnswer, DbDataSource.instance.createEntityManager());
    }
}
