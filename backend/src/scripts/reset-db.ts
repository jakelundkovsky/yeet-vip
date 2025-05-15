import { AppDataSource } from "../data-source";

async function reset() {
    try {
        await AppDataSource.initialize();
        console.log("Connected to database");

        // Delete all records
        await AppDataSource.query('DELETE FROM transactions');
        await AppDataSource.query('DELETE FROM users');
        console.log("Tables cleared successfully");

        await AppDataSource.destroy();
        console.log("Database reset complete");
    } catch (error) {
        console.error("Error resetting database:", error);
        process.exit(1);
    }
}

reset(); 