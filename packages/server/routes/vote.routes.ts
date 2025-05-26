import { Router } from 'express';
import { voteController } from '@/controllers/vote.controller';
import { validate } from '@/middlewares/validate.middleware';
import { castVoteSchema, getMyVoteStatusSchema } from '@/validators/vote.validator';
import { authCivil } from '@/middlewares/auth.middleware';

const router = Router();

router.post('/:id/vote', authCivil, validate(castVoteSchema), voteController.castVote);
router.get('/:id/vote', authCivil, validate(getMyVoteStatusSchema, 'query'), voteController.getMyVoteStatus);

export default router;
