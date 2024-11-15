// useCachedSongs.ts
import { useQuery } from "@apollo/client";
import { GET_SONGS } from "../Queries";
import { useEffect } from "react";

type UseCachedSongsProps = {
	searchTerm: string;
	selectedGenres: string[];
	minViews: number;
	maxViews: number;
	sortOption: string;
};

export const useCachedSongs = ({ searchTerm, selectedGenres, minViews, maxViews, sortOption }: UseCachedSongsProps) => {
	const { loading, error, data, fetchMore, refetch } = useQuery(GET_SONGS, {
		variables: {
			skip: 0,
			limit: 30,
			genres: selectedGenres.length > 0 ? selectedGenres : null,
			sortBy: sortOption,
			searchTerm,
			minViews,
			maxViews,
		},
		fetchPolicy: "cache-first",
	});

	// Funksjon for å laste inn flere sanger ved "Load More"-klikk
	const loadMoreSongs = () => {
		if (!data?.songs) return;
	
		fetchMore({
			variables: {
				skip: data.songs.length,
				limit: 30,
			},
			updateQuery: (previousResult, { fetchMoreResult }) => {
				if (!fetchMoreResult) return previousResult;
	
				return {
					...previousResult,
					songs: [...previousResult.songs, ...fetchMoreResult.songs],
				};
			},
		})
			.then((response) => {
				console.log("Loaded more songs", response.data.songs);
			})
			.catch((error) => {
				console.error("Error fetching more songs:", error);
			});
	};
	

	// Oppdaterer sanger når filterinnstillingene endres
	useEffect(() => {
		refetch({
			skip: 0,
			limit: 30,
			genres: selectedGenres.length > 0 ? selectedGenres : null,
			sortBy: sortOption,
			searchTerm,
			minViews,
			maxViews,
		});
	}, [refetch, selectedGenres, sortOption, searchTerm, minViews, maxViews]);

	return {
		songs: data?.songs || [],
		isLoading: loading,
		error,
		loadMoreSongs,
	};
};
