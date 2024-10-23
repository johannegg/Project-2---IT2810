import "./Sidebar.css";
import { Filter } from "../Filter/Filter";
import Sort from "../Sort/Sort";
import type { Song } from "../../utils/FetchMockData";

type SidebarProps = {
	onGenreChange: (selectedGenres: string[]) => void;
	sortOption: string;
	onSortChange: (newSort: string, sortedSongs: Song[]) => void;
	songs: Song[];
	onToggle: (isOpen: boolean) => void;
	isOpen: boolean;
};
export function Sidebar({
	onGenreChange,
	sortOption,
	onSortChange,
	songs,
	onToggle,
	isOpen,
}: SidebarProps) {
	const toggleMenu = () => {
		onToggle(!isOpen);
	};

	return (
		<div className={`sidebar ${isOpen ? "open" : ""}`}>
			<button className="close-button" onClick={toggleMenu} type="button">
				✕
			</button>
			<div className="filteringContainer">
				<Filter onGenreChange={onGenreChange} />
				<br />
				<Sort songs={songs} sortOption={sortOption} onSortChange={onSortChange} />
			</div>
		</div>
	);
}
