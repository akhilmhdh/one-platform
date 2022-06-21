import { IExecutableSchemaDefinition } from '@graphql-tools/schema';

import { GQLValidationError } from '@/error';

import { CreateProjectArgs, GetProjectByIDArgs, UpdateProjectArgs } from './types';
import { createProjectValidation, updateProjectValidation, verifyMongoDBID } from './validation';

export const projectResolver: IExecutableSchemaDefinition<IContext>['resolvers'] = {
  ReportingProject: {
    id(parent: { _id: string }) {
      // eslint-disable-next-line no-underscore-dangle
      return parent._id;
    },
  },
  Query: {
    listReportingProjects(_parent, _args, { dataSources: { projects } }) {
      return projects.getProjects();
    },

    getReportingProjectByID(_parent, args: GetProjectByIDArgs, { dataSources: { projects } }) {
      const { error, value } = verifyMongoDBID.validate(args);
      if (error) {
        throw new GQLValidationError(error.details);
      }
      return projects.getProjectById(value.id);
    },
  },
  Mutation: {
    createReportingProject(_parent, args: CreateProjectArgs, { dataSources: { projects } }) {
      const { error, value } = createProjectValidation.validate(args);
      if (error) {
        throw new GQLValidationError(error.details);
      }

      return projects.createProject(value.data);
    },
    updateReportingProjectByID(_parent, args: UpdateProjectArgs, { dataSources: { projects } }) {
      const { error, value } = updateProjectValidation.validate(args);
      if (error) {
        throw new GQLValidationError(error.details);
      }

      return projects.updateProjectByID(value.id, value.data);
    },
    deleteReportingProjectByID(_parent, args: { id: string }, { dataSources: { projects } }) {
      const { error, value } = verifyMongoDBID.validate(args);
      if (error) {
        throw new GQLValidationError(error.details);
      }

      return projects.deleteProjectByID(value.id);
    },
  },
};
