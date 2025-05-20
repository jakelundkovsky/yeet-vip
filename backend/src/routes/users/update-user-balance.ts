import { Router, Request, Response } from 'express';

import { AppDataSource } from '../../data-source';
import { Transaction, TransactionType } from '../../entities/transaction';
import { User } from '../../entities/user';

const router = Router();

router.post('/:userId/update-balance', async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const { amount } = req.body;

        if (!amount) {
            return res.status(400).json({ error: 'Amount is required' });
        }

        const userRepository = AppDataSource.getRepository(User);
        const transactionRepository = AppDataSource.getRepository(Transaction);

        const user = await userRepository.findOne({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const newBalance = Number(user.balance) + Number(amount);
        if (newBalance < 0) {
            return res.status(400).json({ 
                error: 'Insufficient funds',
                currentBalance: user.balance,
                requestedDebit: Math.abs(amount)
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

        const action = amount > 0 ? 'Credited' : 'Debited';
        res.json({ 
            message: `${action} ${Math.abs(amount)} to user ${userId}`,
            newBalance: user.balance,
            transaction
        });
        return;
    } catch (error) {
        console.error('Error processing transaction:', error);
        res.status(500).json({ error: 'Internal server error' });
        return;
    }
});

export default router; 