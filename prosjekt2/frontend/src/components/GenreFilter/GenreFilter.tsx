import "./GenreFilter.css";
import { FaFilter } from "react-icons/fa";
import { useGenreCounts } from "../../utils/hooks/useGenreCounts";
import { useReactiveVar } from "@apollo/client";
import { clearFiltersVar, genreFilterVar, maxViewsVar, minViewsVar } from "../../apollo/cache";
import { useEffect, useState, useCallback } from "react";

interface FilterProps {
	onGenreChange: (selectedGenres: string[]) => void;
	searchTerm: string;
}

export function Filter({ onGenreChange, searchTerm }: FilterProps) {
	const minViews = useReactiveVar(minViewsVar);
	const maxViews = useReactiveVar(maxViewsVar);
	const selectedGenresFromApollo = useReactiveVar(genreFilterVar);
	const clearFilters = useReactiveVar(clearFiltersVar);
	const { genreCounts, isLoading } = useGenreCounts(
		searchTerm,
		minViews,
		maxViews,
		selectedGenresFromApollo,
	);
	const [localSelectedGenres, setLocalSelectedGenres] = useState<string[]>(
		selectedGenresFromApollo || [],
	);
	const [cachedGenreCounts, setCachedGenreCounts] = useState(genreCounts);

	const handleGenreChange = useCallback(
		(genre: string) => {
			// Toggle genre selection and update Apollo cache and sessionStorage
			const isSelected = localSelectedGenres.includes(genre);
			const newSelectedGenres = isSelected
				? localSelectedGenres.filter((g) => g !== genre)
				: [...localSelectedGenres, genre];

			setLocalSelectedGenres(newSelectedGenres);
			genreFilterVar(newSelectedGenres);
			sessionStorage.setItem("selectedGenres", JSON.stringify(newSelectedGenres));
			onGenreChange(newSelectedGenres);
		},
		[localSelectedGenres, onGenreChange],
	);

	// Cache genre counts after loading completes to prevent flickering
	useEffect(() => {
		if (!isLoading) {
			setCachedGenreCounts(genreCounts);
		}
	}, [isLoading, genreCounts]);

	// Load saved genres from sessionStorage
	useEffect(() => {
		const savedGenres = JSON.parse(sessionStorage.getItem("selectedGenres") || "[]");
		if (savedGenres.length > 0) {
			setLocalSelectedGenres(savedGenres);
			genreFilterVar(savedGenres);
		}
	}, []);

	// Clear selected genres when clearFilters is triggered
	useEffect(() => {
		if (clearFilters) {
			setLocalSelectedGenres([]);
			sessionStorage.removeItem("selectedGenres");
		}
	}, [clearFilters]);

	// Handle keyboard interaction for toggling genres
	const handleKeyDown = useCallback(
		(event: React.KeyboardEvent<HTMLDivElement>, genre: string) => {
			if (event.key === "Enter" || event.key === " ") {
				event.preventDefault();
				handleGenreChange(genre);
			}
		},
		[handleGenreChange],
	);

	return (
		<section className="filterContainer" aria-label="Genre filter">
			<section className="filterHeader" aria-label="Filter header">
				<FaFilter className="filterSortIcon" aria-hidden="true" />
				<h2 aria-label="Genre filter section">Genre</h2>
			</section>
			<section className="categories" aria-label="Available genres">
				{/* Render genre filters dynamically */}
				{cachedGenreCounts.map((genre: { name: string; count: number }) => (
					<div
						className="filterRow"
						key={genre.name}
						tabIndex={-1}
						onKeyDown={(event) => handleKeyDown(event, genre.name)}
						role="checkbox"
						aria-checked={localSelectedGenres.includes(genre.name)}
						aria-label={`Filter for genre ${genre.name} with ${genre.count} available songs`}
					>
						{/* Checkbox for toggling genre filter */}
						<input
							type="checkbox"
							id={genre.name}
							checked={localSelectedGenres.includes(genre.name)}
							onChange={() => handleGenreChange(genre.name)}
							disabled={isLoading || genre.count === 0}
							className={isLoading || genre.count === 0 ? "disabled-filter" : ""}
							tabIndex={0}
							aria-label={`Toggle ${genre.name} genre`}
						/>
						<label
							htmlFor={genre.name}
							className={genre.count === 0 ? "disabled-filter-label" : ""}
							aria-label={`Label for ${genre.name} filter`}
						>
							{genre.name.charAt(0).toUpperCase() + genre.name.slice(1)}{" "}
							<span className="filterCount">({genre.count})</span>
						</label>
					</div>
				))}
			</section>
		</section>
	);
}
