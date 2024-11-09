import { gql } from '@apollo/client';

export const GET_SONGS = gql`
  query GetSongs($skip: Int, $limit: Int, $genres: [String], $sortBy: SortBy, $searchTerm: String) {
    songs(skip: $skip, limit: $limit, genres: $genres, sortBy: $sortBy, searchTerm: $searchTerm) {
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

export const CREATE_USER = gql`
  mutation CreateUser($username: String) {
    createUser(username: $username) {
      id
      username
      favoriteSongs {
        id
        title
        views
        year
        lyrics
        artist {
          name
        }
        genre {
          name
        }
      }
      playlists {
        id
        name
        songs {
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
    }
  }
`;

export const DELETE_USER = gql`
  mutation DeleteUser($username: String!) {
    deleteUser(username: $username)  
  }
            
`
