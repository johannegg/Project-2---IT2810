import { FaSearch } from "react-icons/fa";
import "./SearchBar.css";
import { useEffect, useState } from "react";
import { Song } from "../../utils/FetchMockData";

type SearchBarProps = {
	songs: Song[];
	setSearchedSongs: (SearchedSongs: Song[]) => void;
};

export function SearchBar({ songs, setSearchedSongs }: SearchBarProps) {
	const [searchInput, setSearchInput] = useState<string>("");

	useEffect(() => {
		function filterSongs(): Song[] {
			if (searchInput === "") return songs;
			const keywords = searchInput.toLowerCase().split(" ");
			return songs.filter((song) => {
				return keywords.every((keyword) => {
					return (
						song.title.toLowerCase().includes(keyword) ||
						song.artist.toLowerCase().includes(keyword)
					);
				});
			});
		}

		const searchedSongs = filterSongs();
		setSearchedSongs(searchedSongs);
	}, [searchInput, songs, setSearchedSongs]);

	return (
		<div className="searchContainer">
			<input
				className="searchInput"
				placeholder="Search for a song or an artist"
				value={searchInput}
				onChange={(e) => setSearchInput(e.target.value)}
			/>
			<div className="iconContainer">
				<FaSearch className="searchIcon" />
			</div>
		</div>
	);
}
