import { AppDataSource } from '@/configs/database';
import { Vote } from '@/entities/Vote';
import { Poll } from '@/entities/Poll';

export class VoteService {
  private pollRepo = AppDataSource.getRepository(Poll);
  private voteRepo = AppDataSource.getRepository(Vote);

  async castVote(pollId: string, voterId: string) {
    const poll = await this.pollRepo.findOne({ where: { id: pollId } });
    if (!poll) return { success: false, message: 'Poll not found' };

    const existingVote = await this.voteRepo.findOne({ where: { poll: { id: pollId }, voterId } });
    if (existingVote) return { success: false, message: 'User already voted' };

    const vote = this.voteRepo.create({ poll, voterId });
    await this.voteRepo.save(vote);

    return { success: true };
  }

  async hasVoted(pollId: string, voterId: string) {
    const vote = await this.voteRepo.findOne({ where: { poll: { id: pollId }, voterId } });
    return !!vote;
  }
}

export const voteService = new VoteService();
