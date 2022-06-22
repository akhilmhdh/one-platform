/* eslint-disable no-param-reassign */
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
    members(parent: { members: string[] }, _args, { loaders: { user } }) {
      return user.loadMany(parent.members);
    },
    createdBy(parent: { createdBy: string }, _args, { loaders: { user } }) {
      return user.load(parent.createdBy);
    },
    updatedBy(parent: { updatedBy: string }, _args, { loaders: { user } }) {
      return user.load(parent.updatedBy);
    },
  },
  Query: {
    listReportingProjects(_parent, _args, { dataSources: { projects }, user }) {
      return projects.getProjects({ userID: user.id });
    },

    getReportingProjectByID(
      _parent,
      args: GetProjectByIDArgs,
      { dataSources: { projects }, user }
    ) {
      const { error, value } = verifyMongoDBID.validate(args);
      if (error) {
        throw new GQLValidationError(error.details);
      }
      return projects.getProjectById(value.id, user.id);
    },
  },
  Mutation: {
    createReportingProject(_parent, args: CreateProjectArgs, { dataSources: { projects }, user }) {
      const createdBy = user.id;
      const { members = [] } = args.data;
      const projectMembers = members.includes(createdBy) ? members : [...members, createdBy];
      args.data.members = projectMembers;
      args.data.createdBy = user.id;

      const { error, value } = createProjectValidation.validate(args);
      if (error) {
        throw new GQLValidationError(error.details);
      }

      return projects.createProject(value.data);
    },
    updateReportingProjectByID(
      _parent,
      args: UpdateProjectArgs,
      { dataSources: { projects }, user }
    ) {
      args.data.updatedBy = user.id;
      const { error, value } = updateProjectValidation.validate(args);
      if (error) {
        throw new GQLValidationError(error.details);
      }

      return projects.updateProjectByID(value.id, value.data);
    },
    deleteReportingProjectByID(_parent, args: { id: string }, { dataSources: { projects }, user }) {
      const { error, value } = verifyMongoDBID.validate(args);
      if (error) {
        throw new GQLValidationError(error.details);
      }

      return projects.deleteProjectByID(value.id, user.id);
    },
  },
};
