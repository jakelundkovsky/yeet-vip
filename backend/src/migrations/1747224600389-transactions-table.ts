import { MigrationInterface, QueryRunner } from "typeorm";

export class TransactionsTable1747224600389 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "transactions" (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                amount DECIMAL NOT NULL,
                user_id UUID NOT NULL,
                created_at TIMESTAMP NOT NULL DEFAULT now(),
                updated_at TIMESTAMP NOT NULL DEFAULT now(),

                CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id)
            )
        `);
    }

    public async down(): Promise<void> {
        // no-op
    }
}
