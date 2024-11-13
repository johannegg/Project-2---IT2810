import "./Sidebar.css";
import { Filter } from "../GenreFilter/GenreFilter";
import { ViewsFilter } from "../ViewsFilter/ViewsFilter";
import Sort from "../Sort/Sort";
import { SongData } from "../../utils/types/SongTypes";

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

	return (
		<div className={`sidebar ${isOpen ? "open" : ""}`}>
			<button className="close-button" onClick={toggleMenu} type="button">
				✕
			</button>
			<div className="filteringContainer">
				<Filter onGenreChange={onGenreChange} songs={songs} />
				<br />
				<ViewsFilter onViewsChange={onViewsChange} />
				<br />
				<Sort songs={songs} sortOption={sortOption} onSortChange={onSortChange} />
			</div>
		</div>
	);
}
