import { FaSearch } from "react-icons/fa";
import "./SearchBar.css";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

type SearchBarProps = {
	setSearchTerm: (setSearchTerm: string) => void;
};

export function SearchBar({ setSearchTerm }: SearchBarProps) {
	const [searchInput, setSearchInput] = useState<string>("");
	const [hasInput, setHasInput] = useState<boolean>(false);

	const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault(); 
		setSearchTerm(searchInput); // Pass search input to Home page
	};

	const handleSearchInput = (input: string) => {
		setSearchInput(input);
		if (input == "") setHasInput(false);
		else setHasInput(true)
	}

	const clearInput = () => {
		setSearchInput("");
		setSearchTerm("");
		setHasInput(false);
	}

	return (
		<div className="searchContainer">
			<form className="searchForm" onSubmit={handleSearchSubmit}>
				<input
					className="searchInput"
					placeholder="Search for a song or an artist"
					value={searchInput}
					onChange={(e) => handleSearchInput(e.target.value)}
				/>
				<button type="submit" className="iconContainer">
					<FaSearch className="searchIcon" />
				</button>
			</form>
			{hasInput &&
				<button className="clearButton" onClick={clearInput}>
					<FontAwesomeIcon icon={faXmark} />
				</button>
			}
		</div>
	);
}
