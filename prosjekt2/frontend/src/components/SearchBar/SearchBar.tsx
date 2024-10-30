import { FaSearch } from "react-icons/fa";
import "./SearchBar.css";
import { useState } from "react";

type SearchBarProps = {
	setSearchTerm: (setSearchTerm: string) => void;
};

export function SearchBar({ setSearchTerm }: SearchBarProps) {
	const [searchInput, setSearchInput] = useState<string>("");

	const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault(); 
		setSearchTerm(searchInput); // Pass search input to Home page
	};

	return (
		<div className="searchContainer">
			<form className="searchForm" onSubmit={handleSearchSubmit}>
				<input
					className="searchInput"
					placeholder="Search for a song or an artist"
					value={searchInput}
					onChange={(e) => setSearchInput(e.target.value)}
				/>
				<button type="submit" className="iconContainer">
					<FaSearch className="searchIcon" />
				</button>
			</form>
		</div>
	);
}
