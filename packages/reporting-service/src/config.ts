import dotenv from 'dotenv-safe';

export type Config = {
  port: number;
  env: 'development' | 'production' | 'test';
  dbURI: string;
  apiGatewayURL: string;
  apiGatewayToken: string;
};

export const setupConfig = (): Config => {
  dotenv.config();

  return {
    port: Number(process.env.PORT || 8080),
    env: (process.env.NODE_ENV || 'development') as Config['env'],
    dbURI: process.env.MONGODB_URI || '',
    apiGatewayURL: process.env.API_GATEWAY_URL || '',
    apiGatewayToken: process.env.API_GATEWAY_TOKEN || '',
  };
};
