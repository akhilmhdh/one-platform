/* eslint-disable no-console */
import { setupLogger } from '@/logger';
import { setupConfig } from '@/config';

import { gqlSchema, startApolloServer } from './app';

async function main() {
  const config = setupConfig();
  const logger = setupLogger();

  await startApolloServer(gqlSchema, logger, config);
}

main().catch((err) => console.error(err));
