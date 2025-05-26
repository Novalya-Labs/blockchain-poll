import { AppDataSource } from '@/configs/database';
import { Poll } from '@/entities/Poll';

export class PollService {
  private repo = AppDataSource.getRepository(Poll);

  async createPoll(data: { title: string; description: string }) {
    const poll = this.repo.create(data);
    await this.repo.save(poll);
    return poll;
  }

  async listPolls() {
    return await this.repo.find();
  }

  async getPoll(id: string) {
    return await this.repo.findOne({ where: { id } });
  }

  async getPollVotes(id: string) {
    const poll = await this.repo.findOne({ where: { id }, relations: ['votes'] });
    return poll ? poll.votes.length : 0;
  }
}

export const pollService = new PollService();
