import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Poll } from 'src/poll/entities/poll.entity';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateVoteInput } from './dto/create-vote.input';
import { UpdateVoteInput } from './dto/update-vote.input';
import { Vote } from './entities/vote.entity';

@Injectable()
export class VoteService {
  constructor(
    @InjectRepository(Vote)
    readonly voteRepository: Repository<Vote>,
    @InjectRepository(User)
    readonly userRepository: Repository<User>,
    @InjectRepository(Poll)
    readonly pollRepository: Repository<Poll>,
  ) {}

  async create(createVoteInput: CreateVoteInput, current_user: any) {
    const poll = await this.pollRepository.findOne({
      where: { id: createVoteInput.pollId, isActive: true },
    });

    if (!poll) {
      throw new NotFoundException('Poll not found');
    }

    if (!poll.options.includes(createVoteInput.selectedOption)) {
      throw new BadRequestException(
        'Selected option is not valid for this poll',
      );
    }

    const user = await this.userRepository.findOne({
      where: { id: current_user.id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const is_voted = await this.voteRepository.findOne({where: {poll: {
      id: createVoteInput.pollId
    }, createdBy: {
      id: current_user.id
    }}});

    if(is_voted) throw new BadRequestException("You already voted. One user can vote only once")
    const vote = this.voteRepository.create({
      selectedOption: createVoteInput.selectedOption,
      poll,
      createdBy: user,
    });

    return await this.voteRepository.save(vote);
  }

  findAll() {
    return `This action returns all vote`;
  }

  findOne(id: number) {
    return `This action returns a #${id} vote`;
  }

  update(id: number, updateVoteInput: UpdateVoteInput) {
    return `This action updates a #${id} vote`;
  }

  remove(id: number) {
    return `This action removes a #${id} vote`;
  }
}
