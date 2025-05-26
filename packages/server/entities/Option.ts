import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Poll } from './Poll';
import { Vote } from './Vote';

@Entity()
export class Option {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  text!: string;

  @ManyToOne(
    () => Poll,
    (poll) => poll.options,
    { onDelete: 'CASCADE' },
  )
  poll!: Poll;

  @OneToMany(
    () => Vote,
    (vote) => vote.option,
  )
  votes!: Vote[];
}
