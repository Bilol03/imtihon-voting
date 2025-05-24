import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterInput } from './dto/register.input';
import { LoginInput } from './dto/login.input';
import { NotFoundError } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly authRepo: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(input: RegisterInput) {
    const { name, email, password } = input;

    const existingUser = await this.authRepo.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('Email is already in use');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.authRepo.create({
      name,
      email,
      password: hashedPassword,
      role: 'user', 
    });

    await this.authRepo.save(user);



    return user;
  }

  async login(input: LoginInput) {
        const user = await this.authRepo.findOne({
      where: { email: input.email },
    });
    console.log(user);

    if (!user || !(await bcrypt.compare(input.password, user.password)))
      throw new NotFoundError('User not found or Wrong Password');
    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = await this.jwtService.signAsync(payload);
    return { accessToken, user};
  
  }
}
