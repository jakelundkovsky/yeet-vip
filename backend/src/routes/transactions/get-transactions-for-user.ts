import { Router } from 'express';

import { AppDataSource } from '../../data-source';
import { Transaction } from '../../entities/transaction';

const router = Router();

router.get('/user/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({
                transactions: [],
                error: 'User ID is required'
            });
        }

        const transactionRepository = AppDataSource.getRepository(Transaction);
        const transactions = await transactionRepository.find({
            where: { userId },
            order: { createdAt: 'DESC' }
        });

        return res.json({
            transactions,
            error: null
        });
    } catch (error) {
        console.error('Error fetching transactions:', error);
        return res.status(500).json({
            transactions: [],
            error: 'Internal server error'
        });
    }
});

export default router; 