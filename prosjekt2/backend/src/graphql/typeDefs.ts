import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

export const typeDefs = `#graphql

  type Song {
    id: ID!
    title: String!
    year: Int
    lyrics: String
    views: Int
    artist: Artist
    genre: Genre
  }

  type Artist {
    id: ID!
    name: String!
    songs: [Song]
  }

  type Genre {
    id: ID!
    name: String!
    songs: [Song]
  }
  
  type GenreCount {
    name: String!
    count: Int!
  }

  type User {
    id: ID!
    username: String!
    favoriteSongs: [Song]
    playlists: [Playlist]
    isNew: Boolean!
  }

  type Playlist {
    id: ID!
    name: String!
    songs: [Song]
    backgroundcolor: String!
    icon: String!
  }

  enum SortBy {
    title_asc
    title_desc
    artist_asc
    artist_desc
    views_desc
  }

  type Query {
    songs(
      skip: Int
      limit: Int
      genres: [String]
      sortBy: SortBy
      searchTerm: String
      minViews: Int
      maxViews: Int
    ): [Song]

    songCount(
      genres: [String]
      searchTerm: String
      minViews: Int
      maxViews: Int
    ): Int

    genreCounts(
      searchTerm: String
      minViews: Int
      maxViews: Int
      genres: [String]
    ): [GenreCount]

    song(id: ID!): Song
    artists: [Artist]
    artist(id: ID!): Artist
    genres: [Genre]
    genre(id: ID!): Genre
  }
  
  type Mutation {
    createUser(username: String!): User
    deleteUser(username: String!): Boolean
    addFavoriteSong(username: String!, songId: ID!): Boolean
    removeFavoriteSong(username: String!, songId: ID!): Boolean
    createPlaylist(username: String!, name: String!, backgroundcolor: String!, icon: String!): Playlist
    deletePlaylist(username: String!, playlistId: ID!): Boolean
    addSongToPlaylist(username: String!, playlistId: ID!, songId: ID!): Playlist
    removeSongFromPlaylist(username: String!, playlistId: ID!, songId: ID!): Playlist
  }
`;
