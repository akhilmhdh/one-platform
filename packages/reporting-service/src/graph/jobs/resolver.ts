/* eslint-disable no-underscore-dangle */
import { IExecutableSchemaDefinition } from '@graphql-tools/schema';

import { GQLValidationError, UnauthorizedProjectAccess } from '@/error';
import { FieldBaseOperators, Field, Rule } from '@/lib/equations';

import {
  createJobConfigValidation,
  deleteJobConfigValidation,
  updateJobConfigValidation,
} from './validation';

import { ReportingPayloadFieldInput, ReportingRuleInput } from './types';

const getPayloadHelper = (field: ReportingPayloadFieldInput | ReportingRuleInput): Field | Rule => {
  if (!(field as ReportingRuleInput)?.rule) {
    const f = field as ReportingRuleInput;
    return { field: f.field, operator: f.operator, value: f.value };
  }

  const f = field as ReportingPayloadFieldInput;
  return {
    condition: f?.condition || FieldBaseOperators.AND,
    not: Boolean(f?.not),
    rules: f.rules.map((rule) => getPayloadHelper(rule)),
  };
};

const getPayloadRules = (field: ReportingPayloadFieldInput): Field => {
  return {
    condition: field?.condition || FieldBaseOperators.AND,
    not: Boolean(field?.not),
    rules: field.rules.map((rule) => getPayloadHelper(rule)),
  };
};

export const reportingJobResolver: IExecutableSchemaDefinition<IContext>['resolvers'] = {
  ReportingJobConfig: {
    id(parent: { _id: string }) {
      // eslint-disable-next-line no-underscore-dangle
      return parent._id;
    },
  },
  ReportingRule: {
    __resolveType(obj: { field?: string }) {
      if (obj?.field) {
        return 'ReportingPayloadFieldRule';
      }
      return 'ReportingPayloadField';
    },
  },
  JobEffects: {
    __resolveType() {
      return 'JobEffectEmail';
    },
  },
  Query: {
    async listReportingJobs(
      _parent,
      args: { projectID: string },
      { dataSources: { jobConfigs, projects }, user }
    ) {
      const isMember = await projects.isAMemberOfProject(args.projectID, user.id);
      if (!isMember) {
        throw UnauthorizedProjectAccess;
      }

      return jobConfigs.getJobConfigs({ projectID: args.projectID });
    },
    async getReportingJobByID(
      _parent,
      args: { id: string; projectID: string },
      { dataSources: { jobConfigs, projects }, user }
    ) {
      const isMember = await projects.isAMemberOfProject(args.projectID, user.id);
      if (!isMember) {
        throw UnauthorizedProjectAccess;
      }

      return jobConfigs.getJobConfigByID(args.id);
    },
  },
  Mutation: {
    async createReportingJob(_parent, args, { dataSources: { jobConfigs, projects }, cron, user }) {
      const { error, value } = createJobConfigValidation.validate(args);
      if (error) {
        throw new GQLValidationError(error.details);
      }
      const { data, projectID } = value;

      const isMember = await projects.isAMemberOfProject(projectID, user.id);
      if (!isMember) {
        throw UnauthorizedProjectAccess;
      }

      const job = await jobConfigs.createJobConfig(projectID, {
        ...data,
        jobs: data.jobs.map(({ fn, payload }) => ({
          fn,
          payload: { type: payload.type, fields: getPayloadRules(payload.fields) },
        })),
        effects: [data?.effects?.email],
        createdBy: user.id,
      });

      if (job?.cron) {
        await cron.startAJob(job._id.toString(), job.cron);
      }
      return job;
    },
    async updateReportingJobByID(
      _parent,
      args,
      { dataSources: { jobConfigs, projects }, cron, user }
    ) {
      const { value, error } = updateJobConfigValidation.validate(args);

      if (error) {
        throw new GQLValidationError(error.details);
      }

      const { data, projectID, jobID } = value;

      const isMember = await projects.isAMemberOfProject(projectID, user.id);
      if (!isMember) {
        throw UnauthorizedProjectAccess;
      }

      if (data?.jobs) {
        data.jobs = data.jobs.map(({ fn, payload }) => ({
          fn,
          payload: { type: payload.type, fields: getPayloadRules(payload.fields) },
        })) as never;
      }

      const doc = await jobConfigs.updateJobConfigByID(jobID, {
        ...data,
        updatedBy: user.id,
      });

      if (data?.cron) {
        await cron.updateAJob(jobID, data.cron);
      }

      return doc;
    },
    async deleteReportingJobByID(
      _parent,
      args,
      { dataSources: { jobConfigs, projects }, cron, user }
    ) {
      const { error, value } = deleteJobConfigValidation.validate(args);

      if (error) {
        throw new GQLValidationError(error.details);
      }
      const { projectID, jobID } = value;

      await cron.deleteAJob(jobID);

      const isMember = await projects.isAMemberOfProject(projectID, user.id);
      if (!isMember) {
        throw UnauthorizedProjectAccess;
      }

      return jobConfigs.deleteJobConfigByID(jobID);
    },
  },
};
