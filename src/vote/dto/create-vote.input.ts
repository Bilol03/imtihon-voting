import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class CreateVoteInput {
  @Field(() => ID, ({ description: " The ID of the poll should be written" }))
  pollId: number;

  @Field(() => String, ({ description: "The option that the user voted for" }))
  selectedOption: string;
}
