import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import "./SearchBar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

type SearchBarProps = {
	setSearchTerm: (term: string) => void;
	initialSearchTerm?: string;
};

export const SearchBar: React.FC<SearchBarProps> = ({ setSearchTerm, initialSearchTerm = "" }) => {
	const [searchInput, setSearchInput] = useState<string>(initialSearchTerm);

	// Setting the search term to be empty at the start
	useEffect(() => {
		setSearchInput(initialSearchTerm);
	}, [initialSearchTerm]);

	const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setSearchTerm(searchInput);
	};

	const clearInput = () => {
		setSearchInput("");
		setSearchTerm("");
	};

	return (
		<div className="searchContainer" aria-label="Search bar container">
			<form className="searchForm" onSubmit={handleSearchSubmit} aria-label="Search Form">
				<input
					className="searchInput"
					placeholder="Search for a song or an artist"
					value={searchInput}
					// The search is done as the user clicks search (or enter)
					onChange={(e) => setSearchInput(e.target.value)}
					aria-label="Search Input Field"
				/>
				<button type="submit" className="iconContainer" aria-label="Submit Search">
					<FaSearch className="searchIcon" aria-hidden="true" />
				</button>
			</form>
			{searchInput && (
				<button className="clearButton" onClick={clearInput} aria-label="Clear Search Button">
					<FontAwesomeIcon icon={faXmark} />
				</button>
			)}
		</div>
	);
};
