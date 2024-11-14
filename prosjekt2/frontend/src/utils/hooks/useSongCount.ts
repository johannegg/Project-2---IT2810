import { useQuery } from "@apollo/client";
import { GET_SONG_COUNT } from "../Queries";

export const useSongCount = (
  selectedGenres: string[] | null,
  searchTerm: string,
  minViews: number,
  maxViews: number
) => {
  const { data, error, refetch } = useQuery(GET_SONG_COUNT, {
    variables: {
      genres: selectedGenres,
      searchTerm,
      minViews,
      maxViews,
    },
    fetchPolicy: "cache-first",
  });

  return {
    songCount: data ? data.songCount : 0,
    error,
    refetch,
  };
};
