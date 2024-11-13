import { gql } from '@apollo/client';

export const GET_SONGS = gql`
  query GetSongs($skip: Int, $limit: Int, $genres: [String], $sortBy: SortBy, $searchTerm: String, $minViews: Int, $maxViews: Int) {
    songs(skip: $skip, limit: $limit, genres: $genres, sortBy: $sortBy, searchTerm: $searchTerm, minViews: $minViews, maxViews: $maxViews) {
      id
      title
      views
      year
      lyrics
      artist {
        name
        id
      }
      genre {
        name
      }
    }
  }
`;


