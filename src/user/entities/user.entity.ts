import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Vote } from 'src/vote/entities/vote.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@ObjectType()
@Entity('users')
export class User {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: string;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Field()
  @Column({ type: 'enum', enum: ['admin', 'user'], default: 'user' })
  role: 'admin' | 'user';

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Vote, (vote) => vote.createdBy)
  votes: Vote[];
}
