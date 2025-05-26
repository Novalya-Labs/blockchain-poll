import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Vote } from './Vote';
import { Option } from './Option';

@Entity()
export class Poll {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column('text')
  description!: string;

  @Column({ type: 'enum', enum: ['active', 'closed'], default: 'active' })
  status!: 'active' | 'closed';

  @CreateDateColumn()
  createdAt!: Date;

  @OneToMany(
    () => Vote,
    (vote) => vote.poll,
  )
  votes!: Vote[];

  @OneToMany(
    () => Option,
    (option) => option.poll,
    { cascade: true },
  )
  options!: Option[];
}
