import { useQuery } from "@apollo/client";
import { GET_USER_PLAYLISTS } from "../Queries";

export const useUserPlaylist = (username: string) => {
	const { data, error, loading, refetch } = useQuery(GET_USER_PLAYLISTS, {
		variables: { username },
		fetchPolicy: "network-only",
	});

	// Safely access the playlists data or return an empty array if undefined
	return { playlists: data?.fetchPlaylists || [], error, loading, refetch };
};
