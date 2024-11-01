import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { Neo4jGraphQL } from '@neo4j/graphql';
import { typeDefs } from './graphql/typeDefs';
import { resolvers } from './graphql/resolvers';
import driver from './utils/neo4j-driver';
import dotenv from 'dotenv';

dotenv.config();

// Create Neo4j GraphQL schema
const neoSchema = new Neo4jGraphQL({ typeDefs, driver, resolvers });

async function startApolloServer() {
  try {
    const schema = await neoSchema.getSchema();
    const server = new ApolloServer({
      schema,
    });

    const { url } = await startStandaloneServer(server, {
      context: async ({ req }) => {
        // Pass Neo4j driver to context
        return { driver };
      },
      listen: { port: 3001 },
    });

    console.log(`🚀 Server ready at: ${url}`);
  } catch (error) {
    console.error('Error initializing the Apollo server:', error);
  }
}

startApolloServer();
