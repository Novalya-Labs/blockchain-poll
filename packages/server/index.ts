import dotenv from 'dotenv';
import express from 'express';
import pollRoutes from './routes/poll.routes';
import voteRoutes from './routes/vote.routes';
import { AppDataSource } from './configs/database';

dotenv.config();

const app = express();
app.use(express.json());

app.use('/poll', pollRoutes);
app.use('/vote', voteRoutes);

const PORT = process.env.PORT || 3000;
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
