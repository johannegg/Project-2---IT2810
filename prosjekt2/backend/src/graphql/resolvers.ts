import { Driver } from "neo4j-driver";
import neo4j from 'neo4j-driver';

const executeCypherQuery = async (driver: Driver, cypherQuery: String, params: any = {}) => {
  const session = driver.session();
  try {
      const result = await session.run(cypherQuery, params);
      return result.records;
  } catch (error) {
      console.error("Error executing Cypher query:", error);
      throw new Error("Failed to execute query");
  } finally {
      session.close();
  }
};


// Custom resolvers
export const resolvers = {
  Query: {
    genres: async (_: any, __: any, { driver }: any) => {
      const records = await executeCypherQuery(
        driver,
        "MATCH (g:Genre) RETURN g LIMIT 5",
      );
      // Map the result to fit the GraphQL schema
      return records.map((record) => {
        const genreNode = record.get("g");
        return {
          id: genreNode.elementId,
          name: genreNode.properties.name,
        };
      });
    },
    artists: async (_: any, __: any, { driver }: any) => {
      const records = await executeCypherQuery(
        driver,
        "MATCH (a:Artist) RETURN a LIMIT 10",
      );
      // Map the result to fit the GraphQL schema
      return records.map((record) => {
        const artistNode = record.get("a");
        return {
          id: artistNode.elementId,
          name: artistNode.properties.name,
        };
      });
    },
    songs: async (_: any, { skip = 0, limit = 30, genres, sortBy }: { skip: number, limit: number, genres?: string[], sortBy?: string }, { driver }: any) => {
      // Parse skip and limit to integers
      const intSkip = parseInt(skip as unknown as string, 10);
      const intLimit = parseInt(limit as unknown as string, 10);

      // Map sortBy to cypher ORDER BY
      let orderByClause = "";
      switch (sortBy) {
        case "title_asc":
          orderByClause = "ORDER BY s.title ASC";
          break;
        case "title_desc":
          orderByClause = "ORDER BY s.title DESC";
          break;
        case "artist_asc":
          orderByClause = "ORDER BY a.name ASC";
          break;
        case "artist_desc":
          orderByClause = "ORDER BY a.name DESC";
          break;
        case "views_desc":
          orderByClause = "ORDER BY s.views DESC";
          break;
        default:
          orderByClause = ""; // Default sorting
      }

      // Execute the Cypher query with pagination
      const records = await executeCypherQuery(
        driver,
        `
        MATCH (s:Song)-[:PERFORMED_BY]->(a:Artist), (s)-[:HAS_GENRE]->(g:Genre)
        WHERE $genres IS NULL OR g.name IN $genres
        RETURN s, a, g
        ${orderByClause}
        SKIP $skip
        LIMIT $limit
        `,
        { skip: neo4j.int(intSkip), limit: neo4j.int(intLimit), genres: genres || null } // Use neo4j.int() for correct type
      );
  
      // Map the result to fit the GraphQL schema
      return records.map((record) => {
        const songNode = record.get("s"); // Song node
        const artistNode = record.get("a"); // Artist node related to the song
        const genreNode = record.get("g"); // The genre node of the song

        return {
          id: songNode.properties.id,
          title: songNode.properties.title,
          year: songNode.properties.year,
          lyrics: songNode.properties.lyrics,
          views: songNode.properties.views,
          artist: {
              id: artistNode.elementId,
              name: artistNode.properties.name,
          },
          genre: {
              name: genreNode.properties.name,
          },
        };
      });
  }
  
  },
};
