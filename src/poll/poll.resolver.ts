import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { checkAdmin } from 'src/common/utils/check-admin';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { GqlAuthGuard } from 'src/guards/gql-auth.guard';
import { CreatePollInput } from './dto/create-poll.input';
import { UpdatePollInput } from './dto/update-poll.input';
import { Poll } from './entities/poll.entity';
import { PollService } from './poll.service';
import { PollResult } from 'src/vote/dto/poll-result';

@Resolver(() => Poll)
export class PollResolver {
  constructor(private readonly pollService: PollService) {}

  @Mutation(() => Poll, { name: 'createPoll' })
  @UseGuards(GqlAuthGuard)
  createPoll(
    @Args('createPollInput') createPollInput: CreatePollInput,
    @CurrentUser() current_user: any,
  ) {
    checkAdmin(current_user);
    return this.pollService.create(createPollInput, current_user);
  }

  @Query(() => [Poll], { name: 'polls' })
  @UseGuards(GqlAuthGuard)
  findAll(@CurrentUser() current_user: any) {
    checkAdmin(current_user);
    return this.pollService.findAll();
  }

  @Query(() => Poll, { name: 'poll' })
  @UseGuards(GqlAuthGuard)
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.pollService.findOne(id);
  }

  @Mutation(() => Poll)
  @UseGuards(GqlAuthGuard)
  updatePoll(
    @Args('id', { type: () => Int }) id: number,
    @Args('updatePollInput') updatePollInput: UpdatePollInput,
    @CurrentUser() current_user: any,
  ) {
    return this.pollService.update(id, updatePollInput, current_user);
  }

  @Mutation(() => Poll)
  @UseGuards(GqlAuthGuard)
  removePoll(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() current_user: any,
  ) {
    return this.pollService.remove(id, current_user);
  }

    @ResolveField(() => [PollResult])
    async results(@Parent() poll: Poll): Promise<PollResult[]> {
      return this.pollService.findResult(poll.id);
    }
}
