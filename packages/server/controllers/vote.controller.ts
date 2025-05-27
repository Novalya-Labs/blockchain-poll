import { Request, Response } from 'express';
import { voteService } from '@/services/vote.service';

export class VoteController {
  async castVote(req: Request, res: Response) {
    const { voterId, choice } = req.body;
    const pollId = req.params.pollId;

    const result = await voteService.castVote(pollId, voterId, choice);
    if (!result.success) return res.status(400).json({ message: result.message });
    return res.status(201).json({ message: 'Registered vote' });
  }

  async getMyVoteStatus(req: Request, res: Response) {
    const { voterId } = req.query as { voterId: string };
    const pollId = req.params.pollId;

    const hasVoted = await voteService.hasVoted(pollId, voterId);
    return res.status(200).json({ hasVoted });
  }
}

export const voteController = new VoteController();
