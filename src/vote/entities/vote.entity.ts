import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Poll } from 'src/poll/entities/poll.entity';

@ObjectType()
@Entity()
export class Vote {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => User)
  @ManyToOne(() => User, user => user.votes, { eager: true, onDelete: 'CASCADE' })
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
}
