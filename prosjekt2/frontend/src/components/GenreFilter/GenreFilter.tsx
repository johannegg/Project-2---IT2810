import "./GenreFilter.css";
import { FaFilter } from "react-icons/fa";
import { useGenreCounts } from "../../utils/hooks/useGenreCounts";
import { useReactiveVar } from "@apollo/client";
import { clearFiltersVar, genreFilterVar, maxViewsVar, minViewsVar } from "../../apollo/cache";
import { useEffect, useState } from "react";

interface FilterProps {
	onGenreChange: (selectedGenres: string[]) => void;
	searchTerm: string;
}

export function Filter({
	onGenreChange,
	searchTerm,
}: FilterProps) {
	const minViews = useReactiveVar(minViewsVar);
	const maxViews = useReactiveVar(maxViewsVar);
	const selectedGenres = useReactiveVar(genreFilterVar);
	const selectedGenresFromApollo = useReactiveVar(genreFilterVar);
	const clearFilters = useReactiveVar(clearFiltersVar);
	const { genreCounts, isLoading } = useGenreCounts(searchTerm, minViews, maxViews, selectedGenres);
	const [localSelectedGenres, setLocalSelectedGenres] = useState<string[]>(
		selectedGenresFromApollo || [],
	);
	const [cachedGenreCounts, setCachedGenreCounts] = useState(genreCounts);

	const handleGenreChange = (genre: string) => {
		setLocalSelectedGenres((prevSelected) => {
			const isSelected = prevSelected.includes(genre);
			const newSelectedGenres = isSelected
				? prevSelected.filter((g) => g !== genre)
				: [...prevSelected, genre];

			genreFilterVar(newSelectedGenres);
			sessionStorage.setItem("selectedGenres", JSON.stringify(newSelectedGenres));
			onGenreChange(newSelectedGenres);
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
		genreFilterVar(savedGenres);
	}, []);

	// Reset genres when clearFilters is true
	useEffect(() => {
		if (clearFilters) {
			if (localSelectedGenres.length > 0) {
				setLocalSelectedGenres([]);
				genreFilterVar([]);
				sessionStorage.removeItem("selectedGenres");
				onGenreChange([]);
			}
			clearFiltersVar(false);
		}
	}, [clearFilters, localSelectedGenres, onGenreChange]);

	// Handle keyboard input for accessibility
	const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>, genre: string) => {
		if (event.key === "Enter" || event.key === " ") {
			event.preventDefault();
			handleGenreChange(genre);
		}
	};

	return (
		<>
			<section className="filterContainer">
				<section className="filterHeader">
					<FaFilter className="filterSortIcon" />
					<h2>Genre</h2>
				</section>
				<section className="categories">
					{cachedGenreCounts.map((genre: { name: string; count: number }) => (
						<div
							className="filterRow"
							key={genre.name}
							tabIndex={-1}
							onKeyDown={(event) => handleKeyDown(event, genre.name)}
							role="checkbox"
							aria-checked={localSelectedGenres.includes(genre.name)}
						>
							<input
								type="checkbox"
								id={genre.name}
								checked={localSelectedGenres.includes(genre.name)}
								onChange={() => handleGenreChange(genre.name)}
								disabled={isLoading || genre.count === 0}
								className={isLoading || genre.count === 0 ? "disabled-filter" : ""}
								tabIndex={0}
							/>
							<label
								htmlFor={genre.name}
								className={genre.count === 0 ? "disabled-filter-label" : ""}
							>
								{genre.name.charAt(0).toUpperCase() + genre.name.slice(1)}{" "}
								<span className="filterCount">({genre.count})</span>
							</label>
						</div>
					))}
				</section>
			</section>
		</>
	);
}
