import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';

import { AppDataSource } from './data-source';
import usersRouter from './routes/users';

// load environment variables
dotenv.config();

// initialize express app
const app = express();
const PORT = process.env.PORT || 3001;

// middleware
app.use(cors());
app.use(express.json());

// initialize TypeORM
AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err);
  });

// mount user routes
app.use('/api/users', usersRouter);

// start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
