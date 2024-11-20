import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import "./SearchBar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

type SearchBarProps = {
	setSearchTerm: (term: string) => void;
	initialSearchTerm?: string; // Nytt prop for å sette en initial verdi
};

export const SearchBar: React.FC<SearchBarProps> = ({ setSearchTerm, initialSearchTerm = "" }) => {
	const [searchInput, setSearchInput] = useState<string>(initialSearchTerm);

	useEffect(() => {
		setSearchInput(initialSearchTerm); // Sett initial verdi ved første render
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
					onChange={(e) => setSearchInput(e.target.value)}
					aria-label="Search Input Field"
				/>
				<button type="submit" className="iconContainer" aria-label="Submit Search">
					<FaSearch className="searchIcon" aria-hidden="true" />
				</button>
			</form>
			{searchInput && (
				<button
					className="clearButton"
					onClick={clearInput}
					aria-label="Clear Search Button"
				>
					<FontAwesomeIcon icon={faXmark} aria-hidden="true" />
				</button>
			)}
		</div>
	);
};
