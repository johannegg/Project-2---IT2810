import { gql } from 'apollo-server-express';

export const typeDefs = gql `
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

type Query {
  songs: [Song]
  song(id: ID!): Song
  artists: [Artist]
  artist(id: ID!): Artist
  genres: [Genre]
  genre(id: ID!): Genre
}
`
;
