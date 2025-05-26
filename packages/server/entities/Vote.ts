import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Poll } from './Poll';
import { Option } from './Option';

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

  @ManyToOne(
    () => Option,
    (option) => option.votes,
  )
  option!: Option;

  @CreateDateColumn()
  createdAt!: Date;
}
