export const Env = {
  PORT: process.env.PORT || 8888,
  VOTE_CONTRACT_ADDRESS: process.env.VOTE_CONTRACT_ADDRESS || '',
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: Number(process.env.DB_PORT || '5432'),
  DB_USER: process.env.DB_USER || 'postgres',
  DB_PASS: process.env.DB_PASS || 'postgres',
  DB_NAME: process.env.DB_NAME || 'blockchain-poll',
};
