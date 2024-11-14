import { useEffect, useState } from "react";
import "./GenreFilter.css";
import { FaFilter } from "react-icons/fa";
import { useGenreCounts } from "../../utils/hooks/useGenreCounts";

interface FilterProps {
  onGenreChange: (selectedGenres: string[]) => void;
  clearFilters: boolean;
  searchTerm: string;
  minViews: number;
  maxViews: number;
  selectedGenres: string[] | null;
}

export function Filter({
  onGenreChange,
  clearFilters,
  searchTerm,
  minViews,
  maxViews,
  selectedGenres,
}: FilterProps) {
  const { genreCounts, isLoading} = useGenreCounts(
    searchTerm,
    minViews,
    maxViews,
    selectedGenres
  );
  const [localSelectedGenres, setLocalSelectedGenres] = useState<string[]>(selectedGenres || []);
  const [cachedGenreCounts, setCachedGenreCounts] = useState(genreCounts);

  const handleGenreChange = (genre: string) => {
    setLocalSelectedGenres((prevSelected) => {
      const isSelected = prevSelected.includes(genre);
      const newSelectedGenres = isSelected
        ? prevSelected.filter((g) => g !== genre)
        : [...prevSelected, genre];

      onGenreChange(newSelectedGenres.length > 0 ? newSelectedGenres : []);
      sessionStorage.setItem("selectedGenres", JSON.stringify(newSelectedGenres));
      return newSelectedGenres;
    });
  };

  // Cache genre counts only when loading completes to prevent "flickering"
  useEffect(() => {
    if (!isLoading) {
      setCachedGenreCounts(genreCounts);
    }
  }, [isLoading, genreCounts]);

	// Load genres from sessionStorage on initial mount
	useEffect(() => {
		const savedGenres = JSON.parse(sessionStorage.getItem("selectedGenres") || "[]");
		setLocalSelectedGenres(savedGenres.length > 0 ? savedGenres : []);
	}, []);

	// Reset genres when clearFilters is true  
  useEffect(() => {
    if (clearFilters) {
      setLocalSelectedGenres([]);
      onGenreChange([]);
      sessionStorage.removeItem("selectedGenres");
    }
  }, [clearFilters, onGenreChange]);

  return (
    <section className="filterContainer">
      <section className="filterHeader">
        <FaFilter className="filterSortIcon" />
        <h2>Genre</h2>
      </section>
      <section className="categories">
        {cachedGenreCounts.map((genre: { name: string; count: number }) => (
          <div className="filterRow" key={genre.name}>
            <input
              type="checkbox"
              id={genre.name}
              checked={localSelectedGenres.includes(genre.name)}
              onChange={() => handleGenreChange(genre.name)}
              disabled={isLoading || genre.count === 0}
              className={isLoading || genre.count === 0 ? "disabled-filter" : ""}
            />
            <label
              htmlFor={genre.name}
              className={genre.count === 0 ? "disabled-filter-label" : ""}
            >
              {genre.name.charAt(0).toUpperCase() + genre.name.slice(1)} <span className="filterCount">({genre.count})</span>
            </label>
          </div>
        ))}
      </section>
    </section>
  );
}
