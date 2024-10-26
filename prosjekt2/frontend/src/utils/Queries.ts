import { gql } from '@apollo/client';

export const GET_SONGS = gql`
    query Songs {
        songs {
            id
            title
            views
            year
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
