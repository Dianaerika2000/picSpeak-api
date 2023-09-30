import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeType1696042984398 implements MigrationInterface {
    name = 'ChangeType1696042984398'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "type"`);
        await queryRunner.query(`DROP TYPE "public"."user_type_enum"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "type" character varying NOT NULL DEFAULT 'individual'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "type"`);
        await queryRunner.query(`CREATE TYPE "public"."user_type_enum" AS ENUM('individual', 'group')`);
        await queryRunner.query(`ALTER TABLE "user" ADD "type" "public"."user_type_enum" NOT NULL DEFAULT 'individual'`);
    }

}
