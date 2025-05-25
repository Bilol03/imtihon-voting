import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PollResult {
  @Field()
  option: string;

  @Field()
  votes: number;

  @Field()
  percentage: number;
}
