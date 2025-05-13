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

// start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
