import { AppDataSource } from '@/configs/database';
import { Poll } from '@/entities/Poll';
import { Option } from '@/entities/Option';

export class PollService {
  private repo = AppDataSource.getRepository(Poll);
  private optionRepo = AppDataSource.getRepository(Option);

  async createPoll(data: { title: string; description: string; options: string[] }) {
    const poll = this.repo.create({ title: data.title, description: data.description });
    await this.repo.save(poll);

    const options = data.options.map((text) => this.optionRepo.create({ text, poll }));
    await this.optionRepo.save(options);

    return await this.repo.findOne({ where: { id: poll.id }, relations: ['options'] });
  }

  async listPolls() {
    return await this.repo.find({ relations: ['options'] });
  }

  async getPoll(id: string) {
    return await this.repo.findOne({ where: { id }, relations: ['options'] });
  }

  async getPollVotes(id: string) {
    const poll = await this.repo.findOne({
      where: { id },
      relations: ['votes', 'votes.option'],
    });
    return poll ? poll.votes : [];
  }
}

export const pollService = new PollService();
