import dotenv from "dotenv";
dotenv.config();

import { ApolloServer } from "apollo-server";
import { Neo4jGraphQL } from "@neo4j/graphql";
import { typeDefs } from "./graphql/typeDefs";
import { resolvers } from "./graphql/resolvers";
import driver from "./utils/neo4j-driver";

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

    server
      .listen()
      .then(({ url }) => {
        console.log(`🚀 Server ready at: ${url}`);
      })
      .catch((error) => {
        console.error("Error starting the Apollo server:", error);
      });
  } catch (error) {
    console.error("Error initializing the Neo4j GraphQL schema:", error);
  }
}

startApolloServer();
