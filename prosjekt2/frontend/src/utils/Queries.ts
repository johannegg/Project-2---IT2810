import { gql } from "@apollo/client";

export const GET_SONGS = gql`
	query GetSongs(
		$skip: Int
		$limit: Int
		$genres: [String]
		$sortBy: SortBy
		$searchTerm: String
		$minViews: Int
		$maxViews: Int
	) {
		songs(
			skip: $skip
			limit: $limit
			genres: $genres
			sortBy: $sortBy
			searchTerm: $searchTerm
			minViews: $minViews
			maxViews: $maxViews
		) {
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

export const GET_SONG_COUNT = gql`
  query GetSongCount(
    $genres: [String]
    $searchTerm: String
    $minViews: Int
    $maxViews: Int
  ) {
    songCount(
      genres: $genres
      searchTerm: $searchTerm
      minViews: $minViews
      maxViews: $maxViews
    )
  }
`;

export const GET_GENRE_COUNTS = gql`
  query GetGenreCounts(
    $searchTerm: String
    $minViews: Int
    $maxViews: Int
    $genres: [String]
  ) {
    genreCounts(
      searchTerm: $searchTerm
      minViews: $minViews
      maxViews: $maxViews
      genres: $genres
    ) {
      name
      count
    }
  }
`;

export const CREATE_USER = gql`
	mutation CreateUser($username: String!) {
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
`;

export const ADD_FAVORITE_SONG = gql`
	mutation AddFavoriteSong($username: String!, $songId: ID!) {
		addFavoriteSong(username: $username, songId: $songId)
	}
`;

export const REMOVE_FAVORITE_SONG = gql`
	mutation RemoveFavoriteSong($username: String!, $songId: ID!) {
		removeFavoriteSong(username: $username, songId: $songId)
	}
`;

export const CREATE_PLAYLIST = gql`
	mutation CreatePlaylist(
		$username: String!
		$name: String!
		$backgroundcolor: String!
		$icon: String!
	) {
		createPlaylist(
			username: $username
			name: $name
			backgroundcolor: $backgroundcolor
			icon: $icon
		) {
			id
			name
			backgroundcolor
			icon
			songs {
				id
				title
			}
		}
	}
`;

export const DELETE_PLAYLIST = gql`
	mutation DeletePlaylist($username: String!, $playlistId: ID!) {
		deletePlaylist(username: $username, playlistId: $playlistId)
	}
`;

export const ADD_SONG_TO_PLAYLIST = gql`
	mutation AddSongToPlaylist($username: String!, $playlistId: ID!, $songId: ID!) {
		addSongToPlaylist(username: $username, playlistId: $playlistId, songId: $songId) {
			id
			name
			backgroundcolor
			icon
			songs {
				id
				title
			}
		}
	}
`;

export const REMOVE_SONG_FROM_PLAYLIST = gql`
	mutation RemoveSongFromPlaylist($username: String!, $playlistId: ID!, $songId: ID!) {
		RemoveSongFromPlaylist(username: $username, playlistId: $playlistId, songId: $songId) {
			id
			name
			backgroundcolor
			icon
			songs {
				id
				title
			}
		}
	}
`;
