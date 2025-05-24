import { Field, InputType, Int, PartialType } from '@nestjs/graphql';
import { RegisterInput } from './register.input';

@InputType()
export class LoginInput extends PartialType(RegisterInput) {
  @Field(() => String, { description: 'Enter your email' })
  email: string;
  @Field(() => String, { description: 'Enter your password' })
  password: string;
}