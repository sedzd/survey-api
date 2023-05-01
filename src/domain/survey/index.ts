import {
    CreateDateColumn,
    Entity,
    UpdateDateColumn,
    PrimaryColumn,
    PrimaryGeneratedColumn,
    Column,
    BaseEntity,
    OneToMany
} from 'typeorm';

import { toISO8601 } from '../transformers';
import { Answer } from '../answer';

@Entity()
export class Survey extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    @PrimaryColumn('uuid')
    id: string;

    @Column()
    question: string;

    @OneToMany(() => Answer, (answer) => answer.survey)
    answers: Answer[];

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
