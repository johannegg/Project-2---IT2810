import { FaSearch } from "react-icons/fa";
import "./SearchBar.css";
import { useEffect, useState } from "react";
import { Song } from "../../utils/FetchMockData";

type SearchBarProps = {
	songs: Song[];
	setSearchedSongs: (SearchedSongs: Song[]) => void;
};

export function SearchBar({ songs, setSearchedSongs }: SearchBarProps) {
	const [searchInput, setSearchInput] = useState<string>('');

	useEffect(() => {
		function filterSongs(): Song[] {
			if (searchInput === '') return songs;
			const keywords = searchInput.split(' ');
			return songs.filter((song) => {
				return keywords.every((keyword) => {
					return song.title.includes(keyword) || song.artist.includes(keyword);
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
				placeholder="Search after a song or an artist" 
				value={searchInput}
				onChange={(e) => setSearchInput(e.target.value)}
			/>
			<button type="submit" className="searchButton">
				<FaSearch className="searchIcon" />
			</button>
		</div>
	);
}
