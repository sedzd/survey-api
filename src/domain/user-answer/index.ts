import {
    CreateDateColumn,
    Entity,
    UpdateDateColumn,
    PrimaryColumn,
    PrimaryGeneratedColumn,
    Column,
    BaseEntity,
    ManyToOne
} from 'typeorm';

import { toISO8601 } from '../transformers';
import { Survey } from '../survey';
import { Answer } from '../answer';

@Entity()
export class UserAnswer extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    @PrimaryColumn('uuid')
    id: string;

    @Column({ name: 'user_id' })
    userId: string;

    @ManyToOne(() => Survey)
    survey: Survey;

    @ManyToOne(() => Answer, (answer) => answer.userAnswers)
    answer: Answer;

    @CreateDateColumn({
        type: 'timestamptz',
        default: () => 'CURRENT_TIMESTAMP',
        transformer: toISO8601
    })
    created: Date;

    @UpdateDateColumn({
        type: 'timestamptz',
        default: () => 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP',
        transformer: toISO8601
    })
    updated: Date;
}
