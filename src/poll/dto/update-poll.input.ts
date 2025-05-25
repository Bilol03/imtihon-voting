import { InputType, Field, PartialType } from '@nestjs/graphql';
import { CreatePollInput } from './create-poll.input';
import { IsOptional, IsBoolean } from 'class-validator';

@InputType()
export class UpdatePollInput extends PartialType(CreatePollInput) {
  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
