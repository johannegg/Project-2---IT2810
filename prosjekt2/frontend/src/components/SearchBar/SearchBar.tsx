import { FaSearch } from "react-icons/fa";
import "./SearchBar.css";
export function SearchBar() {
	return (
		<div className="searchContainer">
			<input className="searchInput" placeholder="Search after a song or an artist" />
			<button type="submit" className="searchButton">
				<FaSearch className="searchIcon" />
			</button>
		</div>
	);
}
