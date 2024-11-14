import { Driver } from "neo4j-driver";
import neo4j from "neo4j-driver";

interface Song {
  id: string;
  title: string;
  views: number;
  year: number;
  lyrics: string;
  artist: Artist;
  genre: Genre;
}

interface Artist {
  name: string;
  id: string;
}

interface Genre {
  name: string;
}

const executeCypherQuery = async (
  driver: Driver,
  cypherQuery: String,
  params: any = {},
) => {
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

export const checkUserExists = async (
  _: any,
  { username }: { username: string },
  { driver }: any,
) => {
  const records = await executeCypherQuery(
    driver,
    `
    MATCH (user:User {username: $username})
    RETURN COUNT(user) > 0 AS exists
    `,
    { username },
  );

  return records.length > 0 && records[0].get("exists");
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
    fetchPlaylists: async (
      _: any,
      { username }: { username: string },
      { driver }: any,
    ) => {
      const records = await executeCypherQuery(
        driver,
        `
        MATCH (user:User {username: $username})-[:OWNS]->(playlist:Playlist)
        OPTIONAL MATCH (playlist)-[:CONTAINS]->(playlistSong:Song)
        OPTIONAL MATCH (playlistSong)-[:PERFORMED_BY]->(playlistArtist:Artist)
        OPTIONAL MATCH (playlistSong)-[:HAS_GENRE]->(playlistGenre:Genre)
        WITH playlist, collect({
          id: playlistSong.id,
          title: playlistSong.title,
          views: playlistSong.views,
          year: playlistSong.year,
          lyrics: playlistSong.lyrics,
          artist: playlistArtist { id: playlistArtist.id, name: playlistArtist.name },
          genre: playlistGenre { name: playlistGenre.name }
        }) AS songs
        RETURN {
          id: playlist.id,
          name: playlist.name,
          backgroundcolor: playlist.backgroundcolor,
          icon: playlist.icon,
          songs: songs
        } AS playlist
        `,
        { username },
      );

      if (!records || records.length === 0) return null;

      return records.map((record) => {
        const playlist = record.get("playlist");

        return {
          id: playlist.id,
          name: playlist.name,
          backgroundcolor: playlist.backgroundcolor,
          icon: playlist.icon,
          songs: playlist.songs && playlist.songs.length > 0
            ? playlist.songs.map((song: Song) => ({
                id: song.id,
                title: song.title,
                views: song.views,
                year: song.year,
                lyrics: song.lyrics,
                artist: song.artist
                  ? { id: song.artist.id, name: song.artist.name }
                  : { id: "", name: "Unknown Artist" },
                genre: song.genre
                  ? { name: song.genre.name }
                  : { name: "Unknown Genre" },
              }))
            : [], // Return an empty array if no songs are present
        };
      });
    },
    songs: async (
      _: any,
      {
        skip = 0,
        limit = 30,
        genres,
        sortBy,
        searchTerm,
      }: {
        skip: number;
        limit: number;
        genres?: string[];
        sortBy?: string;
        searchTerm?: string;
      },
      { driver }: any,
    ) => {
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

      // Create insensitive search clause using the search term
      const searchClause = searchTerm
        ? "AND (toLower(s.title) CONTAINS toLower($searchTerm) OR toLower(a.name) CONTAINS toLower($searchTerm))"
        : "";

      // Execute the Cypher query with pagination
      const records = await executeCypherQuery(
        driver,
        `
        MATCH (s:Song)-[:PERFORMED_BY]->(a:Artist), (s)-[:HAS_GENRE]->(g:Genre)
        WHERE ($genres IS NULL OR g.name IN $genres) ${searchClause}
        RETURN s, a, g
        ${orderByClause}
        SKIP $skip
        LIMIT $limit
        `,
        {
          skip: neo4j.int(intSkip), // Use neo4j.int() for correct type
          limit: neo4j.int(intLimit),
          genres: genres || null,
          searchTerm: searchTerm || "",
        },
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
    },

    /* users: async (_: any, __: any, { driver }: any) => {
      const records = await executeCypherQuery(
        driver,
        `
        MATCH (user:User)-[:HAS_FAVORITES]->(song:Song)-[:PERFORMED_BY]->(artist:Artist)
        RETURN user, collect( { song: song, artist: artist}) AS favoriteSongs
        `
      );
  
      // Map the result to the desired format
      return records.map((record) => {
        const userNode = record.get("user") as User;
        const favoriteSongs = record.get("favoriteSongs") as FavoriteSong[];
  
        return {
          username: userNode.properties.username,
          favoriteSongs: favoriteSongs.map(({song, artist}) => {
            return {
              id: song.properties.id,
              title: song.properties.title,
              artist: {
                name: artist.properties.name,
              },
            };
          }),
        };
      });
    }, */
  },
  Mutation: {
    createUser: async (
      _: any,
      { username }: { username: string },
      { driver }: any,
    ) => {
      const records = await executeCypherQuery(
        driver,
        `
        MERGE (user:User {username: $username})
        ON CREATE SET user.id = randomUUID()
        WITH user
        OPTIONAL MATCH (user)-[:HAS_FAVORITES]->(song:Song)-[:PERFORMED_BY]->(artist:Artist)
        OPTIONAL MATCH (song)-[:HAS_GENRE]->(genre:Genre)
        OPTIONAL MATCH (user)-[:OWNS_PLAYLIST]->(playlist:Playlist)
        OPTIONAL MATCH (playlist)-[:CONTAINS]->(playlistSong:Song)-[:PERFORMED_BY]->(playlistArtist:Artist)
        OPTIONAL MATCH (playlistSong)-[:HAS_GENRE]->(playlistGenre:Genre)
        RETURN user {
          id: user.id,
          username: user.username,
          favoriteSongs: collect({
            song: {
              id: song.id,
              title: song.title,
              views: song.views,
              year: song.year,
              lyrics: song.lyrics
            },
            artist: {
              id: artist.id,
              name: artist.name
            },
            genre: genre { name: genre.name }
          })
        } AS user
        `,
        { username },
      );
      if (records.length > 0) {
        const userRecord = records[0].get("user");

        return {
          id: userRecord.id,
          username: userRecord.username,
          favoriteSongs: userRecord.favoriteSongs && userRecord.favoriteSongs.length > 0 
            ? userRecord.favoriteSongs.map((favorite: { artist: Artist; song: Song; genre: Genre }) => ({
                id: favorite.song.id,
                title: favorite.song.title,
                views: favorite.song.views,
                year: favorite.song.year,
                lyrics: favorite.song.lyrics,
                artist: favorite.artist
                  ? { id: favorite.artist.id, name: favorite.artist.name }
                  : { id: "", name: "Unknown Artist" },
                genre: favorite.genre
                  ? { name: favorite.genre.name }
                  : { name: "Unknown Genre" },
              }))
            : [],
        };
      }
      throw new Error("Failed to create or retrieve user");
    },

    deleteUser: async (
      _: any,
      { username }: { username: string },
      { driver }: any,
    ) => {
      const records = await executeCypherQuery(
        driver,
        `
        MATCH (user:User {username: $username})
        DETACH DELETE user
        RETURN COUNT(user) AS count
        `,
        { username },
      );
      const isDeleted = records[0].get("count").toInt();
      return isDeleted > 0;
    },

    addFavoriteSong: async (
      _: any,
      { username, songId }: { username: string; songId: string },
      { driver }: any,
    ) => {
      const records = await executeCypherQuery(
        driver,
        `
        MATCH (user:User {username: $username}), (song:Song {id: $songId})
        MERGE (user)-[:HAS_FAVORITES]->(song)
        RETURN COUNT(song) > 0 AS count
        `,
        { username, songId },
      );
      const isAdded = records[0].get("count");
      return isAdded > 0;
    },

    removeFavoriteSong: async (
      _: any,
      { username, songId }: { username: string; songId: string },
      { driver }: any,
    ) => {
      const records = await executeCypherQuery(
        driver,
        `
        MATCH (user:User {username: $username})-[f:HAS_FAVORITES]->(song:Song {id: $songId})
        DELETE f
        RETURN COUNT(f) > 0 AS count
        `,
        { username, songId },
      );
      const isRemoved = records[0].get("count");
      return isRemoved > 0;
    },

    createPlaylist: async (
      _: any,
      {
        username,
        name,
        backgroundcolor,
        icon,
      }: {
        username: string;
        name: string;
        backgroundcolor: string;
        icon: string;
      },
      { driver }: any,
    ) => {
      const records = await executeCypherQuery(
        driver,
        `
        MATCH (user:User {username: $username})
        CREATE (playlist:Playlist {id: randomUUID(), name: $name, backgroundcolor: $backgroundcolor, icon: $icon})
        MERGE (user)-[:OWNS]->(playlist)
        RETURN playlist { .id, .name, .backgroundcolor, .icon } AS playlist
        `,
        { username, name, backgroundcolor, icon },
      );
      if (records.length > 0) {
        const playlist = records[0].get("playlist");
        return {
          id: playlist.id,
          name: playlist.name,
          backgroundcolor: playlist.backgroundcolor,
          icon: playlist.icon,
        };
      }
    },

    deletePlaylist: async (
      _: any,
      { username, playlistId }: { username: string; playlistId: string },
      { driver }: any,
    ) => {
      const records = await executeCypherQuery(
        driver,
        `
        MATCH (user:User {username: $username})-[o:OWNS]->(playlist:Playlist {id: $playlistId})
        DELETE o
        RETURN COUNT(o) > 0 AS count
        `,
        { username, playlistId },
      );
      const isRemoved = records[0].get("count");
      return isRemoved > 0;
    },

    addSongToPlaylist: async (
      _: any,
      {
        username,
        playlistId,
        songId,
      }: { username: string; playlistId: string; songId: string },
      { driver }: any,
    ) => {
      const records = await executeCypherQuery(
        driver,
        `
        MATCH (user:User {username: $username})-[:OWNS]->(playlist:Playlist {id: $playlistId}), (song:Song {id: $songId})
        MERGE (playlist)-[:CONTAINS]->(song)
        WITH playlist
        MATCH (playlist)-[:CONTAINS]->(s:Song)-[:PERFORMED_BY]->(a:Artist)
        RETURN playlist { .id, .name, songs: collect({ id: s.id, title: s.title, views: s.views, artist: { name: a.name } }) } AS playlist
        `,
        { username, playlistId, songId },
      );
      if (records.length > 0) {
        const playlist = records[0].get("playlist");
        return {
          id: playlist.id,
          name: playlist.name,
          songs: playlist.songs.map((song: any) => ({
            id: song.id,
            title: song.title,
            views: song.views,
            artist: {
              name: song.artist.name,
            },
          })),
        };
      }
      throw new Error("Failed to add song to playlist");
    },

    removeSongFromPlaylist: async (
      _: any,
      {
        username,
        playlistId,
        songId,
      }: { username: string; playlistId: string; songId: string },
      { driver }: any,
    ) => {
      const records = await executeCypherQuery(
        driver,
        `
        MATCH (user:User {username: $username})-[:OWNS]->(playlist:Playlist {id: $playlistId})-[c:CONTAINS]->(song:Song {id: $songId})
        DELETE c
        WITH playlist
        MATCH (playlist)-[:CONTAINS]->(s:Song)-[:PERFORMED_BY]->(a:Artist)
        RETURN playlist { .id, .name, songs: collect({ id: s.id, title: s.title, views: s.views, artist: { name: a.name } }) } AS playlist
        `,
        { username, playlistId, songId },
      );
      const playlist = records[0].get("playlist");
      return {
        id: playlist.id,
        name: playlist.name,
        songs: playlist.songs.map((song: any) => ({
          id: song.id,
          title: song.title,
          views: song.views,
          artist: {
            name: song.artist.name,
          },
        })),
      };
    },
  },
};
