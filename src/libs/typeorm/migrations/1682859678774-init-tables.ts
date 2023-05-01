import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitTables1682859678774 implements MigrationInterface {
    name = 'InitTables1682859678774';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "user_answer" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" character varying NOT NULL, "created" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "surveyId" uuid, "answerId" uuid, CONSTRAINT "PK_37b32f666e59572775b1b020fb5" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `CREATE TABLE "answer" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "answer_text" character varying NOT NULL, "created" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "surveyId" uuid, CONSTRAINT "PK_9232db17b63fb1e94f97e5c224f" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `CREATE TABLE "survey" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "question" character varying NOT NULL, "created" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_f0da32b9181e9c02ecf0be11ed3" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `ALTER TABLE "user_answer" ADD CONSTRAINT "FK_d48a1d954b62931d2424731b636" FOREIGN KEY ("surveyId") REFERENCES "survey"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "user_answer" ADD CONSTRAINT "FK_1940f9d25a60d83036e5f752093" FOREIGN KEY ("answerId") REFERENCES "answer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "answer" ADD CONSTRAINT "FK_83d1e1e4a874dbb7c76cd69803f" FOREIGN KEY ("surveyId") REFERENCES "survey"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "answer" DROP CONSTRAINT "FK_83d1e1e4a874dbb7c76cd69803f"`);
        await queryRunner.query(`ALTER TABLE "user_answer" DROP CONSTRAINT "FK_1940f9d25a60d83036e5f752093"`);
        await queryRunner.query(`ALTER TABLE "user_answer" DROP CONSTRAINT "FK_d48a1d954b62931d2424731b636"`);
        await queryRunner.query(`DROP TABLE "survey"`);
        await queryRunner.query(`DROP TABLE "answer"`);
        await queryRunner.query(`DROP TABLE "user_answer"`);
    }
}
