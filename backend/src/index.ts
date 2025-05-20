import cors from 'cors';
import { config } from 'dotenv';
import express, { json } from 'express';

import { AppDataSource } from './data-source';
import transactionsRouter from './routes/transactions';
import usersRouter from './routes/users';

// load environment variables
config();

const app = express();
const PORT = process.env['PORT'] || 3001;

// middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(json());

app.get('/health', async (_, res) => {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
    await AppDataSource.query('SELECT 1');
    res.status(200).json({ status: 'healthy' });
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

app.use('/api/users', usersRouter);
app.use('/api/transactions', transactionsRouter);

// start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
