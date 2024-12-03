import { useQuery } from "@apollo/client";
import { GET_GENRE_COUNTS } from "../Queries";

// Hook to fetch genre counts with applied filters and search term
export const useGenreCounts = (
	searchTerm: string,
	minViews: number,
	maxViews: number,
	selectedGenres: string[] | null,
) => {
	const {
		data,
		loading: isLoading,
		error,
		refetch,
	} = useQuery(GET_GENRE_COUNTS, {
		variables: {
			searchTerm,
			minViews,
			maxViews,
			genres: selectedGenres,
		},
		fetchPolicy: "cache-first",
	});

	return {
		genreCounts: data ? data.genreCounts : [],
		isLoading,
		error,
		refetch,
	};
};
