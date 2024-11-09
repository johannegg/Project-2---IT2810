import "./Sidebar.css";
import { Filter } from "../Filter/Filter";
import Sort from "../Sort/Sort";
import { SongData } from "../../utils/types/SongTypes";

type SidebarProps = {
	onGenreChange: (selectedGenres: string[]) => void;
	sortOption: string;
	onSortChange: (newSort: string) => void;
	songs: SongData[];
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
				<Filter onGenreChange={onGenreChange} songs={songs} />
				<br />
				<Sort songs={songs} sortOption={sortOption} onSortChange={onSortChange} />
			</div>
		</div>
	);
}
