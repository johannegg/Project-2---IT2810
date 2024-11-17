import "./Sidebar.css";
import { Filter } from "../GenreFilter/GenreFilter";
import { ViewsFilter } from "../ViewsFilter/ViewsFilter";
import Sort from "../Sort/Sort";
import { SongData } from "../../utils/types/SongTypes";
import { useEffect, useRef } from "react";

type SidebarProps = {
	onGenreChange: (selectedGenres: string[]) => void;
	onViewsChange: (minViews: number, maxViews: number) => void;
	sortOption: string;
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
	searchTerm,
	minViews,
	maxViews,
	selectedGenres,
}: SidebarProps) {
	const sidebarRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (isOpen && sidebarRef.current) {
			sidebarRef.current.focus();
		}
	}, [isOpen]);

	const toggleMenu = () => {
		onToggle(!isOpen);
	};

	return (
		<div
			className={`sidebar ${isOpen ? "open" : ""}`}
			aria-hidden={!isOpen}
			tabIndex={isOpen ? 0 : -1}
			ref={sidebarRef}
		>
			<button
				className="close-button"
				onClick={toggleMenu}
				type="button"
				aria-label="Close"
				tabIndex={isOpen ? 0 : -1}
			>
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
				<button
					onClick={onClearAllFilters}
					className="clearFiltersButton"
					tabIndex={isOpen ? 0 : -1}
				>
					Clear filters
				</button>
			</div>
		</div>
	);
}
