/* eslint-disable no-console */
import { Agenda } from 'agenda';
import { MongoClient } from 'mongodb';

import { setupLogger } from '@/logger';
import { setupConfig } from '@/config';

import { gqlSchema, startAgenda, startApolloServer } from './app';

async function main() {
  const config = setupConfig();
  const logger = setupLogger();
  const client = new MongoClient(config.dbURI);

  const agenda = new Agenda({ db: { address: config.dbURI } });

  await client.connect();
  await startAgenda(agenda);
  await startApolloServer(gqlSchema, agenda, client, logger, config);
}

main().catch((err) => console.error(err));
