import { CreateVoteInput } from './create-vote.input';
import { InputType, Field, Int, PartialType, ID } from '@nestjs/graphql';

@InputType()
export class UpdateVoteInput extends PartialType(CreateVoteInput) {
  @Field(() => ID)
  id: number;
}
