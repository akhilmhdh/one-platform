import { ApolloServer, FastifyContext } from 'apollo-server-fastify';
import {
  ApolloServerPluginDrainHttpServer,
  AuthenticationError,
  ContextFunction,
} from 'apollo-server-core';
import { ApolloServerPlugin } from 'apollo-server-plugin-base';
import { Logger } from 'pino';
import { IExecutableSchemaDefinition, mergeSchemas } from '@graphql-tools/schema';
import fastify, { FastifyInstance } from 'fastify';
import { GraphQLSchema } from 'graphql';
import { MongoClient } from 'mongodb';
import { Agenda, Job } from 'agenda';

import { Config } from '@/config';

// datasources
import { ProjectDatasource } from './datasources/projectDatasource';

// dataloaders
import { setupUserDataLoader } from './dataloader';

// graph
import { projectResolver } from './graph/project/resolver';
import projectSchema from './graph/project/typedef.graphql';
import { reportingJobResolver } from './graph/jobs/resolver';
import reportingJobSchema from './graph/jobs/typedef.graphql';
import { sharedResolver } from './graph/resolver';
import sharedSchema from './graph/typedef.graphql';
import { JobConfigDatasource } from './datasources/jobConfigDatasource';

export const gqlSchema = mergeSchemas({
  typeDefs: [projectSchema, reportingJobSchema, sharedSchema],
  resolvers: [
    projectResolver,
    reportingJobResolver,
    sharedResolver,
  ] as IExecutableSchemaDefinition<IContext>['resolvers'],
});

function fastifyAppClosePlugin(app: FastifyInstance): ApolloServerPlugin {
  return {
    async serverWillStart() {
      return Promise.resolve({
        async drainServer() {
          await app.close();
        },
      });
    },
  };
}

export const startAgenda = async (agenda: Agenda) => {
  agenda.define('pull-data', { concurrency: 10 }, (job: Job) => {
    console.log(`${job?.attrs?.data?.info as string} - completed`);
  });

  await agenda.start();
};

export const startApolloServer = async (
  schema: GraphQLSchema,
  agenda: Agenda,
  client: MongoClient,
  serverLogger: Logger,
  cfg: Config
) => {
  // server initialization with context and datasources
  const context: ContextFunction<FastifyContext> = ({ request }) => {
    const id = request?.headers?.['x-op-user-id'];

    if (!id) throw new AuthenticationError('you must be logged in');

    const loaders = {
      user: setupUserDataLoader(cfg.apiGatewayURL, cfg.apiGatewayToken),
    };

    return { loaders, user: { id }, logger: serverLogger, agenda };
  };

  const app = fastify({
    logger: true,
  });

  const server = new ApolloServer({
    schema,
    context,
    dataSources: () => {
      return {
        projects: new ProjectDatasource(client.db().collection('projects')),
        jobConfigs: new JobConfigDatasource(client.db().collection('job-configs')),
      };
    },
    formatError: (error) => ({
      message: error.message,
      locations: error.locations,
      path: error.path,
      ...error.extensions,
    }),
    plugins: [
      fastifyAppClosePlugin(app),
      ApolloServerPluginDrainHttpServer({ httpServer: app.server }),
    ],
  });

  await server.start();
  await app.register(server.createHandler());
  await app.listen(cfg.port, '0.0.0.0');
};
