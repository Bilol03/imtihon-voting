import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsArray, ArrayMinSize } from 'class-validator';

@InputType()
export class CreatePollInput {
  @Field()
  @IsNotEmpty()
  question: string;

  @Field(() => [String])
  @IsArray()
  @ArrayMinSize(2)
  options: string[];
}
