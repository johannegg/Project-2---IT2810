import { gql } from '@apollo/client';

export const GET_SONGS = gql`
    query GetSongs($skip: Int, $limit: Int, $genres: [String], $sortBy: SortBy) {
        songs(skip: $skip, limit: $limit, genres: $genres, sortBy: $sortBy) {
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
