import { useEffect, useState } from "react";
import { useQuery, useReactiveVar } from "@apollo/client";
import { GET_SONGS } from "../Queries";
import { SongData } from "../types/SongTypes";
import { genreFilterVar, minViewsVar, maxViewsVar, sortOptionVar } from "../../apollo/cache";

export const useCachedSongs = (searchTerm: string) => {
	const [songs, setSongs] = useState<SongData[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const selectedGenres = useReactiveVar(genreFilterVar);
	const minViews = useReactiveVar(minViewsVar);
	const maxViews = useReactiveVar(maxViewsVar);
	const sortOption = useReactiveVar(sortOptionVar); // Bruk sortOptionVar direkte

	const { loading, error, data, fetchMore, refetch } = useQuery(GET_SONGS, {
		variables: {
			skip: 0,
			limit: 30,
			genres: selectedGenres.length > 0 ? selectedGenres : null,
			sortBy: sortOption, // Bruk sortOption fra useReactiveVar
			searchTerm,
			minViews,
			maxViews,
		},
		fetchPolicy: "cache-first",
		onCompleted: (fetchedData) => {
			if (fetchedData?.songs) {
				setSongs(fetchedData.songs);
			}
		},
	});

	// Oppdater `songs` når nye data blir hentet
	useEffect(() => {
		if (data && !loading) {
			setSongs(data.songs);
		}
	}, [data, loading]);

	// Trigger refetch når filtervariabler endrer seg
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

	// Legg til sanger ved "Load More"
	const loadMoreSongs = () => {
		if (!data?.songs) return;
		setIsLoading(true);

		fetchMore({
			variables: {
				skip: songs.length,
				limit: 30,
			},
		})
			.then((response) => {
				const newSongs = response.data.songs;
				setSongs((prevSongs) => [...prevSongs, ...newSongs]);
			})
			.catch((error) => {
				console.error("Error fetching more songs: ", error);
			})
			.finally(() => setIsLoading(false));
	};

	return { songs, isLoading: isLoading || loading, error, loadMoreSongs };
};
