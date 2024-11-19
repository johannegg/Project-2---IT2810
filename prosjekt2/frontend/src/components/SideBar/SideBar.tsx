import "./Sidebar.css";
import { Filter } from "../GenreFilter/GenreFilter";
import { ViewsFilter } from "../ViewsFilter/ViewsFilter";
import Sort from "../Sort/Sort";
import { SongData } from "../../utils/types/SongTypes";
import { useReactiveVar } from "@apollo/client";
import {
	isSidebarOpenVar,
	genreFilterVar,
	sortOptionVar,
	clearFiltersVar,
} from "../../apollo/cache";
import { forwardRef, useEffect } from "react";

type SidebarProps = {
	onGenreChange: (selectedGenres: string[]) => void;
	onViewsChange: (minViews: number, maxViews: number) => void;
	onSortChange: (newSort: string) => void;
	songs: SongData[];
	onToggle: (isSidebarOpen: boolean) => void;
	onClearAllFilters: () => void;
	searchTerm: string;
};

export const Sidebar = forwardRef<HTMLDivElement, SidebarProps>(
	(
		{ onGenreChange, onViewsChange, onSortChange, songs, onToggle, onClearAllFilters, searchTerm },
		ref,
	) => {
		const isSidebarOpen = useReactiveVar(isSidebarOpenVar);
		const sortOption = useReactiveVar(sortOptionVar);
		const clearFilters = useReactiveVar(clearFiltersVar);

		useEffect(() => {
			const savedState = sessionStorage.getItem("isSidebarOpen");
			if (savedState !== null) {
				isSidebarOpenVar(savedState === "true");
			}
		}, []);

		useEffect(() => {
			sessionStorage.setItem("isSidebarOpen", isSidebarOpen.toString());
		}, [isSidebarOpen]);

		useEffect(() => {
			if (!ref || !("current" in ref)) return;

			const sidebar = ref.current;
			if (!sidebar) return;

			const focusableElements = sidebar.querySelectorAll<HTMLElement>(
				'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])',
			);

			focusableElements.forEach((el) => {
				if (isSidebarOpen) {
					el.removeAttribute("tabindex");
				} else {
					el.setAttribute("tabindex", "-1");
				}
			});
		}, [isSidebarOpen, ref]);

		const toggleMenu = () => {
			const newState = !isSidebarOpen;
			isSidebarOpenVar(newState);
			onToggle(newState);
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
				ref={ref}
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
					<Filter onGenreChange={onGenreChange} searchTerm={searchTerm} />
					<br />
					<ViewsFilter onViewsChange={onViewsChange} />
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
	},
);
