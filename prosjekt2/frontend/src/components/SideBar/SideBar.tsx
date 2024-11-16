import "./Sidebar.css";
import { Filter } from "../GenreFilter/GenreFilter";
import { ViewsFilter } from "../ViewsFilter/ViewsFilter";
import Sort from "../Sort/Sort";
import { SongData } from "../../utils/types/SongTypes";
import { useReactiveVar } from "@apollo/client"; 
import { genreFilterVar, sortOptionVar } from "../../apollo/cache"; 
import { useEffect } from "react";

type SidebarProps = {
	onGenreChange: (selectedGenres: string[]) => void;
	onViewsChange: (minViews: number, maxViews: number) => void;
	onSortChange: (newSort: string) => void;
	songs: SongData[];
	onToggle: (isOpen: boolean) => void;
	isOpen: boolean;
	clearFilters: boolean;
	onClearAllFilters: () => void;
	searchTerm: string;
	minViews: number;
	maxViews: number;
	selectedGenres: string[] | null;
	sortOption: string;
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
	searchTerm,
	minViews,
	maxViews,
	selectedGenres,
}: SidebarProps) {
	const sortOption = useReactiveVar(sortOptionVar); 

	const toggleMenu = () => {
		onToggle(!isOpen);
	};

	useEffect(() => {
		if (clearFilters) {
			genreFilterVar([]); 
		}
	}, [clearFilters]);

	return (
		<div className={`sidebar ${isOpen ? "open" : ""}`}>
			<button className="close-button" onClick={toggleMenu} type="button">
				✕
			</button>
			<div className="filteringContainer">
				<Sort songs={songs} sortOption={sortOption} onSortChange={onSortChange} />
				<br />
				<Filter
					onGenreChange={onGenreChange}
					clearFilters={clearFilters}
					searchTerm={searchTerm}
					minViews={minViews}
					maxViews={maxViews}
					selectedGenres={selectedGenres}
				/>
				<br />
				<ViewsFilter onViewsChange={onViewsChange} clearFilters={clearFilters} />
				<br />
				<button onClick={onClearAllFilters} className="clearFiltersButton" type="button">
					Clear filters
				</button>
			</div>
		</div>
	);
}
