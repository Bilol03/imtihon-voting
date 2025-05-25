import {
  ForbiddenException,
  Injectable,
  Inject,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Vote } from 'src/vote/entities/vote.entity';
import { Repository } from 'typeorm';
import { CreatePollInput } from './dto/create-poll.input';
import { UpdatePollInput } from './dto/update-poll.input';
import { Poll } from './entities/poll.entity';

import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class PollService {
  constructor(
    @InjectRepository(Poll)
    private readonly pollRepository: Repository<Poll>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Vote)
    private readonly voteRepository: Repository<Vote>,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

  async create(createPollInput: CreatePollInput, current_user: any) {
    const user = await this.userRepository.findOne({
      where: { id: current_user.id },
    });
    if (!user) throw new NotFoundException('User not found');
    const poll = await this.pollRepository.create({
      question: createPollInput.question,
      options: createPollInput.options,
      isActive: true,
      createdBy: user,
    });
    return await this.pollRepository.save(poll);
  }

  async findAll() {
    const cacheKey = 'polls';
    const cached = await this.cacheManager.get(cacheKey);

    if (cached) {
      console.log('Returning from cache');
      return cached;
    }
    const polls = await this.pollRepository.find();

    await this.cacheManager.set(cacheKey, polls, 3000);

    return polls;
  }

  async findOne(id: number) {
    return await this.pollRepository.findOne({ where: { id, isActive: true } });
  }

  async update(id: number, updatePollInput: UpdatePollInput, current_user) {
    const poll = await this.pollRepository.findOne({
      where: { id, isActive: true },
    });

    if (!poll) {
      throw new NotFoundException('Poll not found or is inactive');
    }
    console.log(current_user);

    if (
      poll.createdBy.id !== current_user.sub &&
      current_user.role !== 'admin'
    ) {
      throw new ForbiddenException('You can only update your own polls');
    }

    Object.assign(poll, updatePollInput);

    return await this.pollRepository.save(poll);
  }

  async remove(id: number, current_user) {
    const poll = await this.pollRepository.findOne({
      where: { id, isActive: true },
    });

    if (!poll) {
      throw new NotFoundException('Poll not found');
    }

    if (
      poll.createdBy.id !== current_user.id &&
      current_user.role !== 'admin'
    ) {
      throw new ForbiddenException('You can only delete your own polls');
    }

    poll.isActive = false;

    return await this.pollRepository.save(poll);
  }

  async findResult(pollId: number) {
    const poll = await this.pollRepository.findOne({
      where: { id: pollId },
    });

    if (!poll) {
      throw new NotFoundException('Poll not found');
    }

    // poll.options: string[] bo'lishi kerak
    const results = await Promise.all(
      poll.options.map(async (option) => {
        const count = await this.voteRepository.find({
          where: {
            poll: { id: pollId },
            selectedOption: option,
            isActive: true,
          },
          relations: ['createdBy'],
        });
        const votedBy = count.map((vote) => vote.createdBy);

        return { option, votes: votedBy.length, votedBy };
      }),
    );

    const totalVotes = results.reduce((sum, r) => sum + r.votes, 0);

    return results.map((r) => ({
      ...r,
      percentage:
        totalVotes > 0
          ? parseFloat(((r.votes / totalVotes) * 100).toFixed(2))
          : 0,
    }));
  }
}
