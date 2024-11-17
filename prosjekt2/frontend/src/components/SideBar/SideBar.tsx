import "./Sidebar.css";
import { Filter } from "../GenreFilter/GenreFilter";
import { ViewsFilter } from "../ViewsFilter/ViewsFilter";
import Sort from "../Sort/Sort";
import { SongData } from "../../utils/types/SongTypes";
import { useReactiveVar } from "@apollo/client";
import { isSidebarOpenVar, genreFilterVar, sortOptionVar } from "../../apollo/cache";
import { useEffect, useRef } from "react";

type SidebarProps = {
	onGenreChange: (selectedGenres: string[]) => void;
	onViewsChange: (minViews: number, maxViews: number) => void;
	onSortChange: (newSort: string) => void;
	songs: SongData[];
	onToggle: (isSidebarOpen: boolean) => void;
	clearFilters: boolean;
	onClearAllFilters: () => void;
	searchTerm: string;
};

export function Sidebar({
	onGenreChange,
	onViewsChange,
	onSortChange,
	songs,
	onToggle,
	clearFilters,
	onClearAllFilters,
	searchTerm,
}: SidebarProps) {
	const isSidebarOpen = useReactiveVar(isSidebarOpenVar);
	const sortOption = useReactiveVar(sortOptionVar);

	const sidebarRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (isSidebarOpen && sidebarRef.current) {
			sidebarRef.current.focus();
		}
	}, [isSidebarOpen]);

	const toggleMenu = () => {
		onToggle(!isSidebarOpen);
	};

	useEffect(() => {
		if (clearFilters) {
			genreFilterVar([]);
		}
	}, [clearFilters]);

	return (
		<div
			className={`sidebar ${isSidebarOpen ? "open" : ""}`}
			aria-hidden={!isSidebarOpen}
			tabIndex={isSidebarOpen ? 0 : -1}
			ref={sidebarRef}
		>
			<button
				className="close-button"
				onClick={toggleMenu}
				type="button"
				aria-label="Close"
				tabIndex={isSidebarOpen ? 0 : -1}
			>
				✕
			</button>
			<div className="filteringContainer">
				<Sort songs={songs} sortOption={sortOption} onSortChange={onSortChange} />
				<br />
				<Filter onGenreChange={onGenreChange} clearFilters={clearFilters} searchTerm={searchTerm} />
				<br />
				<ViewsFilter onViewsChange={onViewsChange} clearFilters={clearFilters} />
				<br />
				<button
					onClick={onClearAllFilters}
					className="clearFiltersButton"
					tabIndex={isSidebarOpen ? 0 : -1}
				>
					Clear filters
				</button>
			</div>
		</div>
	);
}
