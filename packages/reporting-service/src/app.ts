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

import { Config } from '@/config';

// datasources
import { ProjectDatasource } from './datasources/projectDatasource';

// dataloaders
import { setupUserDataLoader } from './dataloader';

// graph
import { projectResolver } from './graph/project/resolver';
import projectSchema from './graph/project/typedef.graphql';
import { sharedResolver } from './graph/resolver';
import sharedSchema from './graph/typedef.graphql';

export const gqlSchema = mergeSchemas({
  typeDefs: [projectSchema, sharedSchema],
  resolvers: [
    projectResolver,
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

export const startApolloServer = async (
  schema: GraphQLSchema,
  serverLogger: Logger,
  cfg: Config
) => {
  // db initialization
  const client = new MongoClient(cfg.dbURI);
  await client.connect();

  // server initialization with context and datasources
  const context: ContextFunction<FastifyContext> = ({ request }) => {
    const id = request?.headers?.['x-op-user-id'];

    if (!id) throw new AuthenticationError('you must be logged in');

    const loaders = {
      user: setupUserDataLoader(cfg.apiGatewayURL, cfg.apiGatewayToken),
    };

    return { loaders, user: { id }, logger: serverLogger };
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
