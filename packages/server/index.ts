import 'reflect-metadata';
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import pollRoutes from './routes/poll.routes';
import voteRoutes from './routes/vote.routes';
import { AppDataSource } from './configs/database';
import { Env } from './configs/env';

const app = express();
app.use(express.json());
app.use(cors());

app.use('/health', (_, res) => {
  res.status(200).json({ message: 'OK' });
});

app.use('/polls', pollRoutes);
app.use('/votes', voteRoutes);

const PORT = Env.PORT;
app.listen(PORT, () => {
  AppDataSource.initialize()
    .then(() => {
      console.log('Database connected');
    })
    .catch((error) => {
      console.error('Database connection error:', error);
    });

  console.log(`Server running on http://localhost:${PORT}`);
});
