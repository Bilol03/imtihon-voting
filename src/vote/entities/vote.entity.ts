import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Poll } from 'src/poll/entities/poll.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@ObjectType()
@Entity()
export class Vote {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.votes, {
    eager: true,
    onDelete: 'CASCADE',
  })
  createdBy: User;

  @Field(() => Poll)
  @ManyToOne(() => Poll, (poll) => poll.votes, { eager: true })
  poll: Poll;

  @Field()
  @Column()
  selectedOption: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @Column({ default: true })
  isActive: boolean;
}
