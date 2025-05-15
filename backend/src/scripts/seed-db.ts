import { faker } from "@faker-js/faker"

import { AppDataSource } from "../data-source";
import { Transaction } from "../entities/transaction"
import { User } from "../entities/user"

async function seed() {
    try {
        await AppDataSource.initialize()
        console.log("Connected to database")

        // Create 1000 users
        const users = await Promise.all(
            Array.from({ length: 1000 }, async () => {
                const user = new User()
                user.name = faker.person.fullName()
                user.email = faker.internet.email()
                user.balance = 0
                return await AppDataSource.manager.save(user)
            })
        )

        console.log("Created 1000 users")

        // Create transactions for each user
        for (const user of users) {
            const numTransactions = faker.number.int({ min: 0, max: 50 })
            let totalBalance = 0
            
            // First transaction is always a deposit
            const initialDeposit = faker.number.float({ min: 20, max: 1000, fractionDigits: 2 })
            const deposit = new Transaction()
            deposit.amount = initialDeposit
            deposit.user = user
            deposit.userId = user.id
            await AppDataSource.manager.save(deposit)
            totalBalance += initialDeposit

            // Generate random number of small transactions
            for (let i = 1; i < numTransactions; i++) {
                const transaction = new Transaction()
                // 70% chance of debit, 30% chance of deposit
                const isDebit = faker.number.float({ min: 0, max: 1 }) < 0.7
                
                if (isDebit) {
                    // 90% chance of small debit, 10% chance of larger debit
                    const isSmallDebit = faker.number.float({ min: 0, max: 1 }) < 0.9
                    const debitAmount = isSmallDebit 
                        ? faker.number.float({ min: 1, max: 50, fractionDigits: 2 })
                        : faker.number.float({ min: 51, max: 200, fractionDigits: 2 })
                    
                    // Only create debit transaction if user has sufficient balance
                    if (totalBalance >= debitAmount) {
                        transaction.amount = -debitAmount
                        transaction.user = user
                        transaction.userId = user.id
                        await AppDataSource.manager.save(transaction)
                        totalBalance += transaction.amount
                    }
                } else {
                    // Generate deposit amount
                    const depositAmount = faker.number.float({ min: 10, max: 500, fractionDigits: 2 })
                    transaction.amount = depositAmount
                    transaction.user = user
                    transaction.userId = user.id
                    await AppDataSource.manager.save(transaction)
                    totalBalance += depositAmount
                }
            }

            // Update user balance with remaining amount
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