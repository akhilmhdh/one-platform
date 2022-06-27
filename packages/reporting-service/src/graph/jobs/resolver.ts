/* eslint-disable no-underscore-dangle */
import { IExecutableSchemaDefinition } from '@graphql-tools/schema';

import {
  createJobConfigValidation,
  deleteJobConfigValidation,
  updateJobConfigValidation,
} from './validation';
import { GQLValidationError, UnauthorizedProjectAccess } from '@/error';

export const reportingJobResolver: IExecutableSchemaDefinition<IContext>['resolvers'] = {
  ReportingJobConfig: {
    id(parent: { _id: string }) {
      // eslint-disable-next-line no-underscore-dangle
      return parent._id;
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
    async createReportingJob(_parent, args, { dataSources: { jobConfigs, projects }, user }) {
      const { error, value } = createJobConfigValidation.validate(args);
      if (error) {
        throw new GQLValidationError(error.details);
      }
      const { data, projectID } = value;

      const isMember = await projects.isAMemberOfProject(projectID, user.id);
      if (!isMember) {
        throw UnauthorizedProjectAccess;
      }

      return jobConfigs.createJobConfig(projectID, {
        ...data,
        createdBy: user.id,
      });
    },
    async updateReportingJobByID(_parent, args, { dataSources: { jobConfigs, projects }, user }) {
      const { value, error } = updateJobConfigValidation.validate(args);

      if (error) {
        throw new GQLValidationError(error.details);
      }

      const { data, projectID, jobID } = value;

      const isMember = await projects.isAMemberOfProject(projectID, user.id);
      if (!isMember) {
        throw UnauthorizedProjectAccess;
      }

      return jobConfigs.updateJobConfigByID(jobID, {
        ...data,
        updatedBy: user.id,
      });
    },
    async deleteReportingJobByID(_parent, args, { dataSources: { jobConfigs, projects }, user }) {
      const { error, value } = deleteJobConfigValidation.validate(args);

      if (error) {
        throw new GQLValidationError(error.details);
      }
      const { projectID, jobID } = value;
      const isMember = await projects.isAMemberOfProject(projectID, user.id);
      if (!isMember) {
        throw UnauthorizedProjectAccess;
      }

      return jobConfigs.deleteJobConfigByID(jobID);
    },
  },
};
