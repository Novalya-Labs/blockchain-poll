import { AppDataSource } from '@/configs/database';
import { Vote } from '@/entities/Vote';
import { Poll } from '@/entities/Poll';
import { Option } from '@/entities/Option';
import { blockchainService } from './blockchain.service';

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

    const hasVotedOnChain = await blockchainService.hasVotedOnChain(voterId);
    if (hasVotedOnChain) return { success: false, message: 'User already voted on blockchain' };

    const option = await this.optionRepo.findOne({ where: { text: choice, poll: { id: pollId } } });
    if (!option) return { success: false, message: 'Invalid option selected' };

    const blockchainResult = await blockchainService.castVoteOnChain(voterId, choice);
    if (!blockchainResult.success) {
      return { success: false, message: blockchainResult.error || 'Blockchain vote failed' };
    }

    const vote = this.voteRepo.create({
      poll,
      voterId,
      option,
      transactionHash: blockchainResult.txHash,
    });
    await this.voteRepo.save(vote);

    return {
      success: true,
      message: 'Vote successfully recorded',
      transactionHash: blockchainResult.txHash,
    };
  }

  async hasVoted(pollId: string, voterId: string) {
    const dbVote = await this.voteRepo.findOne({ where: { poll: { id: pollId }, voterId } });
    const blockchainVote = await blockchainService.hasVotedOnChain(voterId);

    return !!dbVote || blockchainVote;
  }

  async getVoteByTransaction(transactionHash: string) {
    return await this.voteRepo.findOne({
      where: { transactionHash },
      relations: ['poll', 'option'],
    });
  }
}

export const voteService = new VoteService();
