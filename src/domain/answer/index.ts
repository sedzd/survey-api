import {
    CreateDateColumn,
    Entity,
    UpdateDateColumn,
    PrimaryColumn,
    PrimaryGeneratedColumn,
    Column,
    BaseEntity,
    OneToMany,
    ManyToOne
} from 'typeorm';

import { toISO8601 } from '../transformers';
import { Survey } from '../survey';
import { UserAnswer } from '../user-answer';

@Entity()
export class Answer extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    @PrimaryColumn('uuid')
    id: string;

    @Column({ name: 'answer_text' })
    answerText: string;

    @ManyToOne(() => Survey, (survey) => survey.answers)
    survey: Survey;

    @OneToMany(() => UserAnswer, (userAnswer) => userAnswer.answer)
    userAnswers: UserAnswer[];

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
