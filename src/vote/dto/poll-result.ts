import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/user/entities/user.entity';

@ObjectType()
export class PollResult {
  @Field()
  option: string;

  @Field()
  votes: number;

  @Field()
  percentage: number;
  @Field(() => [User])
  votedBy: User[];
}
