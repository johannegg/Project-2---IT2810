import { useQuery } from "@apollo/client";
import { GET_SONGS } from "../Queries";
import { useEffect, useState } from "react";

type UseCachedSongsProps = {
	searchTerm: string;
	selectedGenres: string[];
	minViews: number;
	maxViews: number;
	sortOption: string;
};

// Hook to fetch and manage a cached list of songs
export const useCachedSongs = ({
	selectedGenres,
	sortOption,
	searchTerm,
	minViews,
	maxViews,
}: UseCachedSongsProps) => {
	const [hasMoreSongs, setHasMoreSongs] = useState(true);

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
		onCompleted: (fetchedData) => {
			setHasMoreSongs(fetchedData.songs.length === 30);
		},
	});

	// Function to load more songs for infinite scrolling or pagination
	const loadMoreSongs = () => {
		if (!data?.songs || !hasMoreSongs) return;

		fetchMore({
			variables: {
				skip: data.songs.length,
				limit: 30,
			},
			updateQuery: (previousResult, { fetchMoreResult }) => {
				if (!fetchMoreResult) return previousResult;

				if (fetchMoreResult.songs.length < 30) {
					setHasMoreSongs(false);
				}

				return {
					...previousResult,
					songs: [...previousResult.songs, ...fetchMoreResult.songs],
				};
			},
		}).catch((error) => {
			console.error("Error fetching more songs:", error);
		});
	};

	// Refetch songs whenever dependencies change
	useEffect(() => {
		setHasMoreSongs(true);
		refetch({
			skip: 0,
			limit: 30,
			genres: selectedGenres.length > 0 ? selectedGenres : null,
			sortBy: sortOption,
			searchTerm,
			minViews,
			maxViews,
		}).then((fetchedData) => {
			setHasMoreSongs(fetchedData?.data?.songs.length === 30);
		});
	}, [refetch, selectedGenres, sortOption, searchTerm, minViews, maxViews]);

	return {
		songs: data?.songs || [],
		isLoading: loading,
		error,
		loadMoreSongs,
		hasMoreSongs,
	};
};
