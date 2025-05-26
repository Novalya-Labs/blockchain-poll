import { AppDataSource } from '@/configs/database';
import { Vote } from '@/entities/Vote';
import { Poll } from '@/entities/Poll';
import { Option } from '@/entities/Option';

export class VoteService {
  private pollRepo = AppDataSource.getRepository(Poll);
  private voteRepo = AppDataSource.getRepository(Vote);
  private optionRepo = AppDataSource.getRepository(Option);

  async castVote(pollId: string, voterId: string, choice: string) {
    const poll = await this.pollRepo.findOne({ where: { id: pollId }, relations: ['options'] });
    if (!poll) return { success: false, message: 'Poll not found' };

    if (poll.status !== 'active') return { success: false, message: 'Poll is closed' };

    const existingVote = await this.voteRepo.findOne({ where: { poll: { id: pollId }, voterId } });
    if (existingVote) return { success: false, message: 'User already voted' };

    const option = await this.optionRepo.findOne({ where: { text: choice, poll: { id: pollId } } });
    if (!option) return { success: false, message: 'Invalid option selected' };

    const vote = this.voteRepo.create({ poll, voterId, option });
    await this.voteRepo.save(vote);

    return { success: true };
  }

  async hasVoted(pollId: string, voterId: string) {
    const vote = await this.voteRepo.findOne({ where: { poll: { id: pollId }, voterId } });
    return !!vote;
  }
}

export const voteService = new VoteService();
