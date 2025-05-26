import dotenv from 'dotenv';
import express from 'express';
import voteRoutes from './routes/vote.routes';

dotenv.config();

const app = express();
app.use(express.json());

app.use('/vote', voteRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
