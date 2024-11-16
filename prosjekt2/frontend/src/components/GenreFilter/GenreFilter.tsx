import { useEffect, useState } from "react";
import "./GenreFilter.css";
import { FaFilter } from "react-icons/fa";
import { SongData } from "../../utils/types/SongTypes";

interface FilterProps {
	songs: SongData[];
	clearFilters: boolean;
	onGenreChange: (selectedGenres: string[]) => void;
}

export function Filter({ songs, onGenreChange, clearFilters }: FilterProps) {
	const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

	const handleGenreChange = (genre: string) => {
		setSelectedGenres((prevSelected) => {
			const isSelected = prevSelected.includes(genre);
			const newSelectedGenres = isSelected
				? prevSelected.filter((g) => g !== genre)
				: [...prevSelected, genre];

			onGenreChange(newSelectedGenres.length > 0 ? newSelectedGenres : []);
			sessionStorage.setItem("selectedGenres", JSON.stringify(newSelectedGenres));
			return newSelectedGenres;
		});
	};

	// Load genres from sessionStorage on initial mount
	useEffect(() => {
		const savedGenres = JSON.parse(sessionStorage.getItem("selectedGenres") || "[]");
		setSelectedGenres(savedGenres.length > 0 ? savedGenres : []);
	}, []);

	// Reset genres when clearFilters is true
	useEffect(() => {
		if (clearFilters) {
			setSelectedGenres([]);
			onGenreChange([]);
		}
	}, [clearFilters, onGenreChange]);

	const predefinedGenres = ["pop", "rb", "rap", "rock", "country"];
	const uniqueGenres = [...new Set([...predefinedGenres, ...songs.map((song) => song.genre.name)])];

	const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>, genre: string) => {
		if (event.key === "Enter" || event.key === " ") {
			event.preventDefault();
			handleGenreChange(genre);
		}
	};

	return (
		<section className="filterContainer">
			<section className="filterHeader">
				<FaFilter className="filterSortIcon" />
				<h2>Genre</h2>
			</section>
			<section className="categories">
				{uniqueGenres.map((genre, index) => (
					<div
						className="filterRow"
						key={index}
						tabIndex={-1}
						onKeyDown={(event) => handleKeyDown(event, genre)}
						role="checkbox"
						aria-checked={selectedGenres.includes(genre)}
					>
						<input
							type="checkbox"
							id={genre}
							checked={selectedGenres.includes(genre)}
							onChange={() => handleGenreChange(genre)}
							tabIndex={0}
						/>
						<label htmlFor={genre} onClick={() => handleGenreChange(genre)}>
							{genre.charAt(0).toUpperCase() + genre.slice(1)}
						</label>
					</div>
				))}
			</section>
		</section>
	);
}
