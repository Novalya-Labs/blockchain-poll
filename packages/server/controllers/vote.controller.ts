import { Request, Response } from 'express';
import { voteService } from '@/services/vote.service';

export const voteController = {
  vote: async (req: Request, res: Response) => {
    const { voterId, voteChoice } = req.body;

    if (!voterId || !voteChoice) {
      return res.status(400).json({ message: 'voterId and voteChoice are required' });
    }

    try {
      await voteService.castVote(voterId, voteChoice);
      res.json({ message: 'Vote recorded successfully!' });
    } catch (error) {
      console.error('Error in controller:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
};
