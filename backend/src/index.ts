import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { AppDataSource } from './data-source';
import { User } from './entities/user';
import { Transaction } from './entities/transaction';

// load environment variables
dotenv.config();

// initialize express app
const app = express();
const PORT = process.env.PORT || 3001;

// middleware
app.use(cors());
app.use(express.json());

// Initialize TypeORM
AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err);
  });

// hello world endpoint
app.get('/api', (req, res) => {
  res.json({ message: 'Hello World from Yeet Casino API!' });
});

// list users endpoint
app.get('/api/users', async (req, res) => {
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

// list user transactions endpoint
app.get('/api/users/:userId/transactions', async (req, res) => {
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


app.post('/api/users/:userId/credit', async (req: Request, res: Response) => {
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

// start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
