import { Module } from '@nestjs/common';
import { PollService } from './poll.service';
import { PollResolver } from './poll.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Poll } from './entities/poll.entity';
import { UserModule } from 'src/user/user.module';
import { Vote } from 'src/vote/entities/vote.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Poll, Vote]), UserModule],
  providers: [PollResolver, PollService],
  exports: [TypeOrmModule, PollService],
})
export class PollModule {}
