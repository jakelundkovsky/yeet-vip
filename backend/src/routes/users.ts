import { Router, Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { User } from '../entities/user';
import { Transaction } from '../entities/transaction';

const router = Router();

// List users with pagination and sorting
router.get('/', async (req, res) => {
    try {
        const userRepository = AppDataSource.getRepository(User);
        
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const sortBy = String(req.query.sortBy || 'createdAt');
        const sortOrder = String(req.query.sortOrder || 'DESC').toUpperCase();
        
        // Validate sort parameters
        const allowedSortFields = ['name', 'email', 'balance', 'createdAt'];
        if (!allowedSortFields.includes(sortBy)) {
            return res.status(400).json({ error: 'Invalid sort field' });
        }
        if (!['ASC', 'DESC'].includes(sortOrder)) {
            return res.status(400).json({ error: 'Invalid sort order' });
        }

        const skip = (page - 1) * limit;
        const total = await userRepository.count();
        const users = await userRepository.find({
            skip,
            take: limit,
            order: { [sortBy]: sortOrder }
        });

        res.json({
            users,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalItems: total,
                itemsPerPage: limit
            }
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get single user
router.get('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOne({ where: { id: userId } });
        res.json({ user });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// List user transactions
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

// Credit user
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
