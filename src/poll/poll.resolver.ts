import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { PollService } from './poll.service';
import { Poll } from './entities/poll.entity';
import { CreatePollInput } from './dto/create-poll.input';
import { UpdatePollInput } from './dto/update-poll.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/guards/gql-auth.guard';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { AuthenticationError } from '@nestjs/apollo';
import { checkAdmin } from 'src/common/utils/check-admin';

@Resolver(() => Poll)
export class PollResolver {
  constructor(private readonly pollService: PollService) {}


  @Mutation(() => Poll, {name: "createPoll"})
  @UseGuards(GqlAuthGuard)
  createPoll(@Args('createPollInput') createPollInput: CreatePollInput, @CurrentUser() current_user: any) {
    checkAdmin(current_user)
    return this.pollService.create(createPollInput, current_user);
  }

  @Query(() => [Poll], { name: 'polls' })
  @UseGuards(GqlAuthGuard)
  findAll(@CurrentUser() current_user: any) {
    checkAdmin(current_user)
    return this.pollService.findAll();
  }

  @Query(() => Poll, { name: 'poll' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.pollService.findOne(id);
  }

  @Mutation(() => Poll)
  updatePoll(@Args('id', { type: () => Int }) id: number, @Args('updatePollInput') updatePollInput: UpdatePollInput, @CurrentUser() current_user: any) {
    return this.pollService.update(id, updatePollInput, current_user);
  }

  @Mutation(() => Poll)
  removePoll(@Args('id', { type: () => Int }) id: number) {
    return this.pollService.remove(id);
  }
}
