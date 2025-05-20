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

        const userRepository = AppDataSource.getRepository(User);
        const transactionRepository = AppDataSource.getRepository(Transaction);

        const user = await userRepository.findOne({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({
                newBalance: null,
                transactionId: null,
                error: 'User not found',
            });
        }

        const newBalance = Number(user.balance) + Number(amount);
        if (newBalance < 0) {
            return res.status(400).json({ 
                newBalance: null,
                transactionId: null,
                error: 'Insufficient funds',
            });
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

        return res.json({ 
            newBalance: user.balance,
            transactionId: transaction.id,
            error: null
        });
    } catch (error) {
        console.error('Error processing transaction:', error);
        return res.status(500).json({
            newBalance: null,
            transactionId: null,
            error: 'Internal server error'
        });
    }
});

export default router; 