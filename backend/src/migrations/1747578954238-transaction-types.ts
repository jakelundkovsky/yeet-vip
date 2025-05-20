import { MigrationInterface, QueryRunner } from "typeorm";

export class TransactionTypes1747578954238 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "transactions" ADD COLUMN "type" TEXT NOT NULL;
        `);
    }

    public async down(): Promise<void> {
        // no-op
    }
}
