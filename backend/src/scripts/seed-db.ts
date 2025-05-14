import { User } from "../entities/user"
import { Transaction } from "../entities/transaction"
import { faker } from "@faker-js/faker"
import { AppDataSource } from "../data-source";

async function seed() {
    try {
        await AppDataSource.initialize()
        console.log("Connected to database")

        // Create 10 users
        const users = await Promise.all(
            Array.from({ length: 10 }, async () => {
                const user = new User()
                user.name = faker.person.fullName()
                user.email = faker.internet.email()
                user.balance = 0
                return await AppDataSource.manager.save(user)
            })
        )

        console.log("Created 10 users")

        // Create 1-10 transactions per user
        for (const user of users) {
            const numTransactions = faker.number.int({ min: 1, max: 10 })
            let totalBalance = 0
            
            for (let i = 0; i < numTransactions; i++) {
                const transaction = new Transaction()
                transaction.amount = faker.number.float({ min: 10, max: 1000, fractionDigits: 2 })
                transaction.user = user
                transaction.userId = user.id
                await AppDataSource.manager.save(transaction)
                totalBalance += transaction.amount
            }

            // Update user balance with sum of transactions
            user.balance = totalBalance
            await AppDataSource.manager.save(user)
        }

        console.log("Created transactions for all users")
        await AppDataSource.destroy()
        console.log("Database connection closed")
    } catch (error) {
        console.error("Error seeding database:", error)
        process.exit(1)
    }
}

seed() 