import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// load environment variables
dotenv.config();

// initialize express app
const app = express();
const PORT = process.env.PORT || 3001;

// middleware
app.use(cors());
app.use(express.json());

// hello world endpoint
app.get('/api', (req, res) => {
  res.json({ message: 'Hello World from Yeet Casino API!' });
});

// list users endpoint
app.get('/api/users', (req, res) => {
    // todo: pagination
    // todo: sort (username, balance, createdAt)

    res.json({ users: [
        {
            id: 1,
            name: 'John Doe',
            email: 'john.doe@example.com',
            role: 'admin',
            createdAt: new Date(),
        },
        {
            id: 2,
            name: 'Jane Doe',
            email: 'jane.doe@example.com',
            role: 'user',
            createdAt: new Date(),
        },
        {
            id: 3,
            name: 'John Smith',
            email: 'john.smith@example.com',
            role: 'user',
            createdAt: new Date(),
        },
        {
            id: 4,
            name: 'Jane Smith',
            email: 'jane.smith@example.com',
            role: 'user',
            createdAt: new Date(),
        },
    ]});
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
