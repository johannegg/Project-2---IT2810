import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GET_SONGS } from "../Queries";
import { SongData } from "../types/SongTypes";

// Create key to save data batches based on search, sort option and genres
const generateCacheKey = (genres: string[] | null, sortOption: string, searchTerm: string) => {
	const genreKey = genres ? genres.join(",") : "allGenres";
	const searchKey = searchTerm.trim().toLowerCase() || "noSearch";
	return `songs_${genreKey}_${sortOption}_${searchKey}`;
};

export const useCachedSongs = (
	selectedGenres: string[] | null,
	sortOption: string,
	searchTerm: string,
) => {
	const [songs, setSongs] = useState<SongData[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const { loading, error, data, fetchMore, refetch } = useQuery(GET_SONGS, {
		variables: { skip: 0, limit: 30, genres: selectedGenres, sortBy: sortOption, searchTerm },
		fetchPolicy: "cache-first",
	});

	const cacheKey = generateCacheKey(selectedGenres, sortOption, searchTerm);

	useEffect(() => {
		const cachedData = localStorage.getItem(cacheKey);
		if (cachedData) {
			setSongs(JSON.parse(cachedData));
		} else if (data && !loading) {
			setSongs(data.songs);
			localStorage.setItem(cacheKey, JSON.stringify(data.songs));
		}
	}, [cacheKey, data, loading]);

  // Trigger refetch on search, genre, or sort changes
	useEffect(() => {
		refetch({
			skip: 0,
			limit: 30,
			genres: selectedGenres || null,
			sortBy: sortOption,
			searchTerm,
		});
	}, [refetch, searchTerm, selectedGenres, sortOption]);

  // Append fetched songs on "Load More"
	const loadMoreSongs = () => {
		if (!data?.songs) return;
		setIsLoading(true);

		fetchMore({
			variables: {
				skip: songs.length, // Increment skip based on current number of songs fetched
				limit: 30,
			},
		})
			.then((response) => {
				const newSongs = response.data.songs;
				// Update the state by adding the new songs to the existing ones
				// and save batch to localstorage
				setSongs((prevSongs) => {
					const updatedSongs = [...prevSongs, ...newSongs];
					localStorage.setItem(cacheKey, JSON.stringify(updatedSongs));
					return updatedSongs;
				});
			})
			.catch((error) => {
				console.error("Error fetching more songs: ", error);
			})
			.finally(() => setIsLoading(false));
	};
	return { songs, isLoading: isLoading || loading, error, loadMoreSongs };
};
