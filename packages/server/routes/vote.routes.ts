import { Router } from 'express';
import { voteController } from '@/controllers/vote.controller';

const router = Router();

router.post('/', voteController.vote);

export default router;
