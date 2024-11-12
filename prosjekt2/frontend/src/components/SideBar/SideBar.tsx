import "./Sidebar.css";
import { Filter } from "../GenreFilter/GenreFilter";
import { ViewsFilter } from "../ViewsFilter/ViewsFilter";
import Sort from "../Sort/Sort";
import { SongData } from "../../utils/types/SongTypes";
import { useState, useEffect } from "react";

type SidebarProps = {
	onGenreChange: (selectedGenres: string[]) => void;
	onViewsChange: (minViews: number, maxViews: number) => void;
	sortOption: string;
	onSortChange: (newSort: string) => void;
	songs: SongData[];
	onToggle: (isOpen: boolean) => void;
	isOpen: boolean;
};

export function Sidebar({
	onGenreChange,
	onViewsChange,
	sortOption,
	onSortChange,
	songs,
	onToggle,
	isOpen,
}: SidebarProps) {
	const toggleMenu = () => {
		onToggle(!isOpen);
	};

	// State for selected genres and view limits
	const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
	const [minViews, setMinViews] = useState<number>(0);
	const [maxViews, setMaxViews] = useState<number>(3000000);

	// Update genre and views filters on change
	useEffect(() => {
		onGenreChange(selectedGenres);
	}, [selectedGenres, onGenreChange]);

	useEffect(() => {
		onViewsChange(minViews, maxViews);
	}, [minViews, maxViews, onViewsChange]);

	// Apply filters and sorting to the song list
	const filteredAndSortedSongs = () => {
		let filteredSongs = songs;

		// Apply genre filtering
		if (selectedGenres.length > 0) {
			filteredSongs = filteredSongs.filter(song => selectedGenres.includes(song.genre.name));
		}

		// Apply views filtering
		filteredSongs = filteredSongs.filter(song => song.views >= minViews && song.views <= maxViews);

		// Apply sorting
		switch (sortOption) {
			case "title_asc":
				return filteredSongs.sort((a, b) => a.title.localeCompare(b.title));
			case "title_desc":
				return filteredSongs.sort((a, b) => b.title.localeCompare(a.title));
			case "artist_asc":
				return filteredSongs.sort((a, b) => a.artist.name.localeCompare(b.artist.name));
			case "artist_desc":
				return filteredSongs.sort((a, b) => b.artist.name.localeCompare(a.artist.name));
			case "views_desc":
				return filteredSongs.sort((a, b) => b.views - a.views);
			default:
				return filteredSongs;
		}
	};

	return (
		<div className={`sidebar ${isOpen ? "open" : ""}`}>
			<button className="close-button" onClick={toggleMenu} type="button">
				✕
			</button>
			<div className="filteringContainer">
				<Filter onGenreChange={setSelectedGenres} songs={songs} />
				<br />
				<ViewsFilter onViewsChange={(min, max) => { setMinViews(min); setMaxViews(max); }} />
				<br />
				<Sort songs={filteredAndSortedSongs()} sortOption={sortOption} onSortChange={onSortChange} />
			</div>
		</div>
	);
}
