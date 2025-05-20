import { faker } from '@faker-js/faker';

import { AppDataSource } from '../data-source';
import { Transaction, TransactionType } from '../entities/transaction';
import { User } from '../entities/user';

async function seed() {
    try {
        await AppDataSource.initialize();
        console.log('Connected to database');

        // Create 1000 users in a single batch
        const users = Array.from({ length: 1000 }, () => {
            const user = new User();
            user.name = faker.person.fullName();
            user.email = faker.internet.email();
            user.balance = 0;
            user.createdAt = faker.date.past({ years: 1 });
            return user;
        });
        
        const savedUsers = await AppDataSource.manager.save(users);
        console.log('Created 1000 users');

        // Create all transactions in batches
        const allTransactions: Transaction[] = [];
        
        for (const user of savedUsers) {
            const numTransactions = faker.number.int({ min: 0, max: 50 });
            let totalBalance = 0;

            // First transaction is always a deposit
            const initialDeposit = faker.number.float({ min: 20, max: 1000, fractionDigits: 2 });
            const deposit = new Transaction();
            deposit.amount = initialDeposit;
            deposit.user = user;
            deposit.userId = user.id;
            deposit.type = TransactionType.DEPOSIT;
            deposit.createdAt = faker.date.between({
                from: user.createdAt,
                to: new Date(user.createdAt.getTime() + 60 * 60 * 1000),
            });
            allTransactions.push(deposit);
            totalBalance += initialDeposit;

            // Generate random transactions
            for (let i = 1; i < numTransactions; i++) {
                const isDebit = faker.number.float({ min: 0, max: 1 }) < 0.7;
                
                if (isDebit) {
                    const isSmallDebit = faker.number.float({ min: 0, max: 1 }) < 0.9;
                    const debitAmount = isSmallDebit
                        ? faker.number.float({ min: 1, max: 50, fractionDigits: 2 })
                        : faker.number.float({ min: 51, max: 200, fractionDigits: 2 });

                    if (totalBalance >= debitAmount) {
                        const transaction = new Transaction();
                        transaction.amount = -debitAmount;
                        transaction.user = user;
                        transaction.userId = user.id;
                        transaction.type = faker.number.float({ min: 0, max: 1 }) < 0.8 
                            ? TransactionType.BET 
                            : TransactionType.WITHDRAW;
                        transaction.createdAt = faker.date.between({
                            from: deposit.createdAt,
                            to: new Date(),
                        });
                        allTransactions.push(transaction);
                        totalBalance += transaction.amount;
                    }
                } else {
                    const depositAmount = faker.number.float({ min: 10, max: 500, fractionDigits: 2 });
                    const transaction = new Transaction();
                    transaction.amount = depositAmount;
                    transaction.user = user;
                    transaction.userId = user.id;
                    transaction.type = faker.number.float({ min: 0, max: 1 }) < 0.7
                        ? TransactionType.WIN
                        : TransactionType.DEPOSIT;
                    transaction.createdAt = faker.date.between({
                        from: user.createdAt,
                        to: new Date(),
                    });
                    allTransactions.push(transaction);
                    totalBalance += depositAmount;
                }
            }

            // Update user balance
            user.balance = totalBalance;
        }

        // Save all transactions in batches of 1000
        const batchSize = 1000;
        for (let i = 0; i < allTransactions.length; i += batchSize) {
            const batch = allTransactions.slice(i, i + batchSize);
            await AppDataSource.manager.save(batch);
        }

        // Update all users in a single batch
        await AppDataSource.manager.save(savedUsers);

        console.log('Created transactions for all users');
        await AppDataSource.destroy();
        console.log('Database connection closed');
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

seed();