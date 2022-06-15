import { ApolloServer, FastifyContext } from 'apollo-server-fastify';
import { ApolloServerPluginDrainHttpServer, ContextFunction } from 'apollo-server-core';
import { ApolloServerPlugin } from 'apollo-server-plugin-base';
import { Logger } from 'pino';
import { mergeSchemas } from '@graphql-tools/schema';
import fastify, { FastifyInstance } from 'fastify';
import { GraphQLSchema } from 'graphql';

import { Config } from '@/config';

import analyticSchema from './graph/typedef.graphql';
import { sentryResolver } from './graph/resolver';

export const gqlSchema = mergeSchemas({
  typeDefs: [analyticSchema],
  resolvers: [sentryResolver],
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
  const context: ContextFunction<FastifyContext> = ({ request }) => {
    const id = request?.headers?.['x-op-user-id'];

    const loaders = {};

    return { loaders, user: { id }, logger: serverLogger };
  };

  const app = fastify({
    logger: true,
  });

  const server = new ApolloServer({
    schema,
    context,
    dataSources: () => {
      return {};
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
