import "./GenreFilter.css";
import { FaFilter } from "react-icons/fa";
import { SongData } from "../../utils/types/SongTypes";
import { useReactiveVar } from "@apollo/client";
import { genreFilterVar } from "../../apollo/cache";

interface FilterProps {
	songs: SongData[];
	onGenreChange: (selectedGenres: string[]) => void;
}

export function Filter({ songs, onGenreChange }: FilterProps) {
	const selectedGenres = useReactiveVar(genreFilterVar);

	const handleGenreChange = (genre: string) => {
		const newSelectedGenres = selectedGenres.includes(genre)
			? selectedGenres.filter((g) => g !== genre)
			: [...selectedGenres, genre];

		genreFilterVar(newSelectedGenres);
		onGenreChange(newSelectedGenres); 
	};

	const predefinedGenres = ["pop", "rb", "rap", "rock", "country"];
	const uniqueGenres = [...new Set([...predefinedGenres, ...songs.map((song) => song.genre.name)])];

	return (
		<>
			<section className="filterContainer">
				<section className="filterHeader">
					<FaFilter className="filterSortIcon" />
					<h2>Genre</h2>
				</section>
				<section className="categories">
					{uniqueGenres.map((genre, index) => (
						<div className="filterRow" key={index}>
							<input
								type="checkbox"
								id={genre}
								checked={selectedGenres.includes(genre)}
								onChange={() => handleGenreChange(genre)}
							/>
							<label htmlFor={genre}>{genre.charAt(0).toUpperCase() + genre.slice(1)}</label>
						</div>
					))}
				</section>
			</section>
		</>
	);
}
