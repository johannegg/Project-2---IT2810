import { Driver } from "neo4j-driver";

const executeCypherQuery = async (driver: Driver, cypherQuery: String) => {
    const session = driver.session();
    try {
        const result = await session.run(cypherQuery);
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
            const records = await executeCypherQuery(driver, 'MATCH (g:Genre) RETURN g LIMIT 5');
            // Map the result to fit the GraphQL schema
            return records.map((record) => {
                const genreNode = record.get('g');
                return {
                    id: genreNode.elementId,
                    name: genreNode.properties.name,
                };
            });
        },
        artists: async (_: any, __: any, { driver }: any) => {
            const records = await executeCypherQuery(driver, 'MATCH (a:Artist) RETURN a LIMIT 10');
            // Map the result to fit the GraphQL schema
            return records.map((record) => {
                const artistNode = record.get('a');
                return {
                    id: artistNode.elementId,
                    name: artistNode.properties.name,
                };
            });
        },
        songs: async (_: any, __: any, { driver }: any) => {
            const records = await executeCypherQuery(
                driver,
                `
                MATCH (s:Song)-[:PERFORMED_BY]->(a:Artist), (s)-[:HAS_GENRE]->(g:Genre)
                RETURN s, a, g
                LIMIT 30
                `
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
                        name: genreNode.properties.name
                    }
                };
            });
        },
    },
};