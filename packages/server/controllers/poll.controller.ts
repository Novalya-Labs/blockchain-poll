import { Request, Response } from 'express';
import { pollService } from '@/services/poll.service';

export class PollController {
  async createPoll(req: Request, res: Response) {
    const poll = await pollService.createPoll(req.body);
    return res.status(201).json(poll);
  }

  async listPolls(_: Request, res: Response) {
    const polls = await pollService.listPolls();
    return res.status(200).json(polls);
  }

  async getPoll(req: Request, res: Response) {
    const poll = await pollService.getPoll(req.params.pollId);
    if (!poll) return res.status(404).json({ message: 'Poll not found' });
    return res.status(200).json(poll);
  }

  async getPollVotes(req: Request, res: Response) {
    const votes = await pollService.getPollVotes(req.params.pollId);
    return res.status(200).json(votes);
  }
}

export const pollController = new PollController();
