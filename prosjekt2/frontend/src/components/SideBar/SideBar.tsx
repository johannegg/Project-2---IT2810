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
	clearFilters: boolean; // Ny prop som indikerer om filtrene skal nullstilles
	onClearAllFilters: () => void;
};

export function Sidebar({
	onGenreChange,
	onViewsChange,
	sortOption,
	onSortChange,
	songs,
	onToggle,
	isOpen,
	clearFilters,
	onClearAllFilters,
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
				{/* Passer clearFilters som en prop til Filter og ViewsFilter */}
				<Sort songs={songs} sortOption={sortOption} onSortChange={onSortChange} />
				<br />
				<Filter onGenreChange={onGenreChange} songs={songs} clearFilters={clearFilters} />
				<br />
				<ViewsFilter onViewsChange={onViewsChange} clearFilters={clearFilters} />
				<br />
				<button onClick={onClearAllFilters} className="clearFiltersButton">
					Clear filters
				</button>
			</div>
		</div>
	);
}
