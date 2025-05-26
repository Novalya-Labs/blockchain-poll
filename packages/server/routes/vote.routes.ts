import { Router } from 'express';
import { voteController } from '@/controllers/vote.controller';
import { validate } from '@/middlewares/validate.middleware';
import { castVoteSchema, getMyVoteStatusSchema, getMyVoteStatusParamsSchema } from '@/validators/vote.validator';
import { authCivil } from '@/middlewares/auth.middleware';

const router = Router();

router.post('/:pollId/vote', authCivil, validate(castVoteSchema), voteController.castVote);
router.get(
  '/:pollId/vote',
  authCivil,
  validate(getMyVoteStatusParamsSchema, 'params'),
  validate(getMyVoteStatusSchema, 'query'),
  voteController.getMyVoteStatus,
);

export default router;
