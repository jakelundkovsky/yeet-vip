import { MigrationInterface, QueryRunner } from "typeorm";

export class UsersTable1747223500925 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "users" (
                id UUID PRIMARY KEY,
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                balance DECIMAL NOT NULL DEFAULT 0,
                created_at TIMESTAMP NOT NULL DEFAULT now(),
                updated_at TIMESTAMP NOT NULL DEFAULT now()
            )
        `);            
    }

    public async down(): Promise<void> {
        // no-op
    }

}
