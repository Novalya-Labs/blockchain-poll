import { Router } from 'express';
import { pollController } from '@/controllers/poll.controller';
import { validate } from '@/middlewares/validate.middleware';
import { createPollSchema, getPollSchema } from '@/validators/poll.validator';
import { authAdmin } from '@/middlewares/auth.middleware';

const router = Router();

router.post('/', authAdmin, validate(createPollSchema), pollController.createPoll);
router.get('/', pollController.listPolls);
router.get('/:pollId', validate(getPollSchema, 'params'), pollController.getPoll);
router.get('/:pollId/votes', authAdmin, validate(getPollSchema, 'params'), pollController.getPollVotes);

export default router;
