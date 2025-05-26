declare namespace NodeJS {
  interface ProcessEnv {
    VOTE_CONTRACT_ADDRESS: string;
    PORT: string;
    DB_HOST: string;
    DB_PORT: number;
    DB_USER: string;
    DB_PASS: string;
    DB_NAME: string;
  }
}
