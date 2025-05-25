import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreatePollInput } from './dto/create-poll.input';
import { UpdatePollInput } from './dto/update-poll.input';
import { Poll } from './entities/poll.entity';

@Injectable()
export class PollService {
  constructor(
    @InjectRepository(Poll)
    private readonly pollRepository: Repository<Poll>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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
    return await this.pollRepository.find();
  }

  async findOne(id: number) {
    return await this.pollRepository.findOne({ where: { id, isActive: true } });
  }

  async update(id: number, updatePollInput: UpdatePollInput, current_user) {
    const poll = await this.pollRepository.findOne({
      where: { id, isActive: true },
      relations: ['createdBy'], // kerak bo‘lsa
    });

    if (!poll) {
      throw new NotFoundException('Poll not found');
    }

    if (poll.createdBy.id !== current_user.id && current_user.role !== 'admin') {
      throw new ForbiddenException('You can only update your own polls');
    }

    Object.assign(poll, updatePollInput)

    return await this.pollRepository.save(poll);
  }

  remove(id: number) {
    return `This action removes a #${id} poll`;
  }
}
