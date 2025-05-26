import { DataSource } from 'typeorm';
import { Env } from './env';
import { Poll } from '@/entities/Poll';
import { Vote } from '@/entities/Vote';
import { Option } from '@/entities/Option';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: Env.DB_HOST,
  port: Env.DB_PORT,
  username: Env.DB_USER,
  password: Env.DB_PASS,
  database: Env.DB_NAME,
  synchronize: true,
  logging: false,
  entities: [Poll, Vote, Option],
  migrations: [],
  subscribers: [],
});
