import React, { useState } from "react";
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
};
export function Sidebar({
	onGenreChange,
	sortOption,
	onSortChange,
	songs,
	onToggle,
}: SidebarProps) {
	const [isOpen, setIsOpen] = useState(false);

	const toggleMenu = () => {
		setIsOpen(!isOpen);
		onToggle(!isOpen); // Notify the parent component about the toggle
	};

	return (
		<div className="sidebar-menu">
			<button className="hamburger-icon" onClick={toggleMenu}>
				{/* Hamburger icon (3 lines) */}
				<div className={isOpen ? "line open" : "line"} />
				<div className={isOpen ? "line open" : "line"} />
				<div className={isOpen ? "line open" : "line"} />
			</button>
			<div className={`sidebar ${isOpen ? "open" : ""}`}>
				<div className="filteringContainer">
					<Filter onGenreChange={onGenreChange} />
					<br />
					<Sort songs={songs} sortOption={sortOption} onSortChange={onSortChange} />
				</div>
			</div>
			{/* Overlay to close the sidebar */}
			{isOpen && <div className="overlay" onClick={toggleMenu} />}
		</div>
	);
}
