import cors from 'cors';
import { config } from 'dotenv';
import express, { json } from 'express';

import { AppDataSource } from './data-source';
import usersRouter from './routes/users';

// load environment variables
config();

// initialize express app
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

// health check endpoint
app.get('/health', async (_, res) => {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
    // Test database connection
    await AppDataSource.query('SELECT 1');
    res.status(200).json({ status: 'healthy' });
  } catch (error: any) {
    res.status(500).json({ status: 'unhealthy', error: error.message });
  }
});

// mount user routes
app.use('/api/users', usersRouter);

// start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
