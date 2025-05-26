import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Poll } from './Poll';

@Entity()
export class Vote {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  voterId!: string;

  @ManyToOne(
    () => Poll,
    (poll) => poll.votes,
  )
  poll!: Poll;

  @CreateDateColumn()
  createdAt!: Date;
}
