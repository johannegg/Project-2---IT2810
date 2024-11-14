import "./Sidebar.css";
import { Filter } from "../GenreFilter/GenreFilter";
import { ViewsFilter } from "../ViewsFilter/ViewsFilter";
import Sort from "../Sort/Sort";
import { SongData } from "../../utils/types/SongTypes";
import { useReactiveVar } from "@apollo/client"; // Importer useReactiveVar
import { sortOptionVar } from "../../apollo/cache"; // Importer sortOptionVar

type SidebarProps = {
	onGenreChange: (selectedGenres: string[]) => void;
	onViewsChange: (minViews: number, maxViews: number) => void;
	onSortChange: (newSort: string) => void;
	songs: SongData[];
	onToggle: (isOpen: boolean) => void;
	isOpen: boolean;
	clearFilters: boolean;
	onClearAllFilters: () => void;
};

export function Sidebar({
	onGenreChange,
	onViewsChange,
	onSortChange,
	songs,
	onToggle,
	isOpen,
	clearFilters,
	onClearAllFilters,
}: SidebarProps) {
	const sortOption = useReactiveVar(sortOptionVar); // Hent sortOption direkte

	const toggleMenu = () => {
		onToggle(!isOpen);
	};

	return (
		<div className={`sidebar ${isOpen ? "open" : ""}`}>
			<button className="close-button" onClick={toggleMenu} type="button">
				✕
			</button>
			<div className="filteringContainer">
				<Sort songs={songs} sortOption={sortOption} onSortChange={onSortChange} />
				<br />
				<Filter onGenreChange={onGenreChange} songs={songs} />
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
