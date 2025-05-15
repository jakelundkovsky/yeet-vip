import { Router, Request, Response } from 'express';
import { AppDataSource } from '../../data-source';
import { User } from '../../entities/user';
import { Transaction } from '../../entities/transaction';

const router = Router();

router.post('/:userId/credit', async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const { amount } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({ error: 'Amount must be greater than 0' });
        }

        const userRepository = AppDataSource.getRepository(User);
        const transactionRepository = AppDataSource.getRepository(Transaction);

        const user = await userRepository.findOne({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Update user balance
        user.balance = Number(user.balance) + Number(amount);
        await userRepository.save(user);

        // Create transaction record
        const transaction = transactionRepository.create({
            userId,
            amount,
        });
        await transactionRepository.save(transaction);

        res.json({ 
            message: `Credited ${amount} to user ${userId}`,
            newBalance: user.balance,
            transaction
        });
    } catch (error) {
        console.error('Error crediting user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router; 