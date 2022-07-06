/* eslint-disable no-console */
import { Agenda } from 'agenda';
import { MongoClient } from 'mongodb';

import { setupLogger } from '@/logger';
import { setupConfig } from '@/config';

import { gqlSchema, startApolloServer } from './app';
import { JobConfigDatasource } from './datasources/jobConfigDatasource';
import { JobPayloadDatasource } from './datasources/jobPayloadDatasource';
import { CronManager } from './cron/cron';
import { setupNodeMailer } from './mailer';

async function main() {
  const config = setupConfig();
  const logger = setupLogger();
  const client = new MongoClient(config.dbURI);

  const mailer = setupNodeMailer({
    host: config.smtpHost,
    port: 587,
    secure: false,
    tls: {
      rejectUnauthorized: false,
    },
  });

  const agenda = new Agenda({ db: { address: config.dbURI } });
  const jobConfig = new JobConfigDatasource(client.db().collection('job-configs'));
  const jobPayload = new JobPayloadDatasource(client.db().collection('job-payloads'));

  const cronManager = new CronManager(agenda, jobConfig, jobPayload, async (to, subject, body) => {
    await mailer.sendMail({
      to,
      subject,
      html: body,
      from: 'One Platform | Reporting Service<no-reply@redhat.com>',
    });
  });

  await client.connect();
  await cronManager.start();
  await startApolloServer(gqlSchema, cronManager, client, logger, config);
}

main().catch((err) => console.error(err));
