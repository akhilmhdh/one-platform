import dotenv from 'dotenv-safe';

export type Config = {
  port: number;
  env: 'development' | 'production' | 'test';
};

export const setupConfig = (): Config => {
  dotenv.config();

  return {
    port: Number(process.env.PORT || 3000),
    env: (process.env.NODE_ENV || 'development') as Config['env'],
  };
};
