import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Vote } from './Vote';

@Entity()
export class Poll {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column('text')
  description!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @OneToMany(
    () => Vote,
    (vote) => vote.poll,
  )
  votes!: Vote[];
}
