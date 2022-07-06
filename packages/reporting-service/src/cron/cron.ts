import Agenda, { Job } from 'agenda';
import { Collection, Document, ObjectId } from 'mongodb';
import { fetch } from 'undici';
import jsonminify from 'jsonminify';
import mustache from 'mustache';

import { JobConfigDatasource } from '@/datasources/jobConfigDatasource';
import { JobPayloadDatasource } from '@/datasources/jobPayloadDatasource';
import { FieldBaseOperators, getEquationResult } from '@/lib/equations';
import { JobPayloadFileType } from '@/datasources/types';

export interface ICronManager {
  startAJob: (jobID: string, cron: string) => Promise<void>;
  updateAJob: (jobID: string, cron: string) => Promise<void>;
  deleteAJob: (jobID: string) => Promise<void>;
}

export type Mailer = (to: string, subject: string, body: string) => Promise<void>;

export class CronManager implements ICronManager {
  agenda: Agenda;

  collection: Collection<Document>;

  jobConfig: JobConfigDatasource;

  jobPayload: JobPayloadDatasource;

  mailer: Mailer;

  constructor(
    agenda: Agenda,
    jobConfig: JobConfigDatasource,
    jobPayload: JobPayloadDatasource,
    mailer: Mailer
  ) {
    this.agenda = agenda;
    // eslint-disable-next-line no-underscore-dangle
    this.collection = agenda._collection;

    this.jobConfig = jobConfig;
    this.jobPayload = jobPayload;

    this.mailer = mailer;

    this.initializeTasks();
  }

  start() {
    return this.agenda.start();
  }

  initializeTasks() {
    this.agenda.define('monitor', { concurrency: 10 }, async (job: Job) => {
      const jobID = job?.attrs?.data?.jobID as string;
      const config = await this.jobConfig.getJobConfigByID(job?.attrs?.data?.jobID as string);

      if (config) {
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        config.jobs.forEach(async ({ fn, payload }) => {
          const data = await fetch(fn.endpoint, { method: fn.method });

          let body: Record<string, unknown> = {};
          const id = new ObjectId();

          if (payload?.type === JobPayloadFileType.JSON) {
            body = (await data.json()) as Record<string, unknown>;

            await this.jobPayload.upsertPayloadForAJob(id.toString(), jobID, {
              method: fn.method,
              url: fn.endpoint,
              payload: jsonminify(JSON.stringify(body)),
            });
          }

          if (payload?.fields) {
            const field = payload.fields;
            const eq = getEquationResult(
              body,
              field.condition || FieldBaseOperators.AND,
              field.rules,
              field.not
            );

            console.log({ eq });

            if (!eq) {
              const { effects = [] } = config;
              // eslint-disable-next-line @typescript-eslint/no-misused-promises
              effects.forEach(async (e) => {
                await this.mailer(
                  e.to,
                  'Reporting Service Trial Run',
                  mustache.render(e.template, {})
                );
              });
            }
          }
        });
      }
    });

    this.agenda.on('fail', (err: Error) => {
      console.log(`Job failed with error: ${err?.message}`);
    });
  }

  async startAJob(jobID: string, cron: string) {
    const cronJob = this.agenda.create('monitor', { jobID });
    await cronJob.repeatEvery(cron).save();
  }

  async updateAJob(jobID: string, cron: string) {
    await this.collection.findOneAndDelete({ 'data.jobID': jobID });
    const cronJob = this.agenda.create('monitor', { jobID });
    await cronJob.repeatEvery(cron).save();
  }

  async deleteAJob(jobID: string) {
    await this.collection.findOneAndDelete({ 'data.jobID': jobID });
  }
}
