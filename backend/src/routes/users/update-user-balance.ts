import { Router, Request, Response } from 'express';

import { AppDataSource } from '../../data-source';
import { Transaction, TransactionType } from '../../entities/transaction';
import { User } from '../../entities/user';

const router = Router();

router.put('/:userId/balance', async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const { amount } = req.body;

        if (!amount) {
            return res.status(400).json({
                newBalance: null,
                transactionId: null,
                error: 'Amount is required',
            });
        } else if (!userId) {
            return res.status(400).json({
                newBalance: null,
                transactionId: null,
                error: 'User ID is required',
            });
        }

        // Note: Must update user balance and create transaction record in the same DB transaction
        // -- to prevent drift. In production, we'd likely want to run periodic reconciliation
        // -- for redundancy
        const result = await AppDataSource.transaction(async (transactionalEntityManager) => {
            const userRepository = transactionalEntityManager.getRepository(User);
            const transactionRepository = transactionalEntityManager.getRepository(Transaction);

            const user = await userRepository.findOne({ where: { id: userId } });
            if (!user) {
                throw new Error('User not found');
            }

            // prevent javascript floating point precision issues
            const newBalance = Number((Number(user.balance) + Number(amount)).toFixed(2));
            
            if (newBalance < 0) {
                throw new Error('Insufficient funds');
            }

            // Update user balance
            user.balance = newBalance;
            await userRepository.save(user);

            // Create transaction record
            const transaction = transactionRepository.create({
                userId,
                amount,
                type: TransactionType.ADMIN_ADJUST
            });
            await transactionRepository.save(transaction);

            return { user, transaction };
        });

        return res.json({ 
            newBalance: result.user.balance,
            transactionId: result.transaction.id,
            error: null
        });
    } catch (error) {
        console.error('Error processing transaction:', error);
        const errorMessage = error instanceof Error ? error.message : 'Internal server error';
        const statusCode = errorMessage === 'User not found' ? 404 : 
                          errorMessage === 'Insufficient funds' ? 400 : 500;
        
        return res.status(statusCode).json({
            newBalance: null,
            transactionId: null,
            error: errorMessage
        });
    }
});

export default router; 