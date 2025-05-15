import { Router, Request, Response } from 'express';
import { AppDataSource } from '../../data-source';
import { Transaction } from '../../entities/transaction';

const router = Router();

router.get('/:userId/transactions', async (req, res) => {
    try {
        const { userId } = req.params;
        const transactionRepository = AppDataSource.getRepository(Transaction);
        
        const transactions = await transactionRepository.find({
            where: { userId },
            order: { createdAt: 'DESC' }
        });

        res.json({ transactions });
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router; 