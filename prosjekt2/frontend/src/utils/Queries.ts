import { gql } from '@apollo/client';

export const GET_SONGS = gql`
    query GetSongs($skip: Int, $limit: Int, $genres: [String]) {
        songs(skip: $skip, limit: $limit, genres: $genres) {
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
