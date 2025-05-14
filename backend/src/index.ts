import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { AppDataSource } from './data-source';
import { User } from './entities/user';

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
        const users = await userRepository.find();
        res.json({ users });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// list users endpoint
app.get('/api/users/:userId/transactions', (req, res) => {
    // todo: pagination
    // todo: sort (amount, balance, createdAt)

    res.json({ transactions: [
        {
            id: 1,
            amount: 100,
            userId: 1,
            createdAt: new Date(),
        },
        {
            id: 2,
            amount: 200,
            userId: 1,
            createdAt: new Date(),
        },
        {
            id: 3,
            amount: 300,
            userId: 1,
            createdAt: new Date(),
        },
        {
            id: 4,
            amount: 400,
            userId: 1,
            createdAt: new Date(),
        },
    ]});
  });

app.post('/api/users/:userId/credit', (req, res) => {
    // todo: credit
    // todo: debit

    // todo: ensure creating new transaction
    // todo: ensure balance cannot go below 0
    
    const { userId } = req.params;
    const { amount } = req.body;
    res.json({ message: `Credited ${amount} to user ${userId}` });
});

// start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
