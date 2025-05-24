import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { User } from 'src/user/entities/user.entity';
import { AuthService } from './auth.service';
import { LoginInput } from './dto/login.input';
import { LoginResponse } from './dto/login.responce';
import { RegisterInput } from './dto/register.input';
@Resolver(() => User)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => User)
  register(@Args('createAuthInput') createAuthInput: RegisterInput) {
    return this.authService.register(createAuthInput);
  }

  @Mutation(() => LoginResponse, { name: 'login' })
  login(@Args('LoginInput') LoginInput: LoginInput) {
    return this.authService.login(LoginInput);
  }
}
