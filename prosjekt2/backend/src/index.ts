import { ApolloServer } from 'apollo-server';
import { Neo4jGraphQL } from '@neo4j/graphql';
import neo4j from 'neo4j-driver';
import dotenv from 'dotenv';
import { typeDefs } from './graphql/typeDefs';
import { resolvers } from './graphql/resolvers';


dotenv.config();

// Create Neo4j driver
const driver = neo4j.driver(
  process.env.NEO4J_URI as string,
  neo4j.auth.basic(process.env.NEO4J_USER as string, process.env.NEO4J_PASSWORD as string)
);


// Create Neo4j GraphQL schema
const neoSchema = new Neo4jGraphQL({ typeDefs, driver, resolvers });

async function startApolloServer() {
  try {
    const schema = await neoSchema.getSchema();
    const server = new ApolloServer({
      schema,
      context: ({ req }) => {
        // Pass the Neo4j driver into the context
        return { driver };
      },
    });

    server.listen().then(({ url }) => {
      console.log(`🚀 Server ready at: ${url}`);
    }).catch((error) => {
      console.error('Error starting the Apollo server:', error);
    });
  } catch (error) {
    console.error('Error initializing the Neo4j GraphQL schema:', error);
  }
}

startApolloServer();
