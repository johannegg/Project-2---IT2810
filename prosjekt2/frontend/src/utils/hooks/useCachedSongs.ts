import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GET_SONGS } from "../Queries";
import { SongData } from "../types/SongTypes";

export const useCachedSongs = (
  selectedGenres: string[] | null,
  sortOption: string,
  searchTerm: string,
  minViews: number,
  maxViews: number,
) => {
  const [songs, setSongs] = useState<SongData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { loading, error, data, fetchMore, refetch } = useQuery(GET_SONGS, {
    variables: { skip: 0, limit: 30, genres: selectedGenres, sortBy: sortOption, searchTerm, minViews, maxViews },
    fetchPolicy: "cache-first",
  });

  useEffect(() => {
    if (data && !loading) {
      setSongs(data.songs);
    }
  }, [data, loading]);

  // Trigger refetch on search, genre, sort, or views filter changes
  useEffect(() => {
    refetch({
      skip: 0,
      limit: 30,
      genres: selectedGenres || null,
      sortBy: sortOption,
      searchTerm,
      minViews,
      maxViews,
    });
  }, [refetch, searchTerm, selectedGenres, sortOption, minViews, maxViews]);

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
        setSongs((prevSongs) => [...prevSongs, ...newSongs]);
      })
      .catch((error) => {
        console.error("Error fetching more songs: ", error);
      })
      .finally(() => setIsLoading(false));
  };

  return { songs, isLoading: isLoading || loading, error, loadMoreSongs };
};
