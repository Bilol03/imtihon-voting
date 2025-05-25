import { Module } from '@nestjs/common';
import { VoteService } from './vote.service';
import { VoteResolver } from './vote.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vote } from './entities/vote.entity';
import { User } from 'src/user/entities/user.entity';
import { UserModule } from 'src/user/user.module';
import { PollModule } from 'src/poll/poll.module';

@Module({
  imports: [TypeOrmModule.forFeature([Vote]), UserModule, PollModule],
  providers: [VoteResolver, VoteService],
})
export class VoteModule {}
