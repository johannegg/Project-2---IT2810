import { useQuery } from "@apollo/client";
import { GET_SONG_COUNT } from "../Queries";


// Hook to fetch the count of songs based on filters and search criteria
export const useSongCount = (
	selectedGenres: string[] | null,
	searchTerm: string,
	minViews: number,
	maxViews: number,
) => {
	const { data, loading, error, refetch } = useQuery(GET_SONG_COUNT, {
		variables: {
			genres: selectedGenres && selectedGenres.length > 0 ? selectedGenres : null,
			searchTerm: searchTerm || "",
			minViews,
			maxViews,
		},
		fetchPolicy: "network-only",
	});

	return {
		songCount: data ? data.songCount : 0,
		isLoading: loading,
		error,
		refetch,
	};
};
