import type React from "react";
import { FaSort } from "react-icons/fa";
import { SongData } from "../../utils/types/SongTypes";
import "./Sort.css";

type SortProps = {
	songs: SongData[];
	sortOption: string;
	onSortChange: (newSort: string) => void;
};

const Sort: React.FC<SortProps> = ({ sortOption, onSortChange }) => {
	const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const newSortOption = e.target.value;
		onSortChange(newSortOption);
	};

	return (
		<div className="sort-container">
			<section className="sortHeader">
				<FaSort className="filterSortIcon" aria-label="Sort icon" />
				<h2 className="sort-heading">Sort by</h2>
			</section>
			<select
				className="sort-options"
				value={sortOption}
				onChange={handleSortChange}
				tabIndex={0}
				aria-label="Sort songs by"
			>
				<option value="title_asc" aria-label="Sort by title A to Z">
					Title A-Z
				</option>
				<option value="title_desc" aria-label="Sort by title Z to A">
					Title Z-A
				</option>
				<option value="artist_asc" aria-label="Sort by artist A to Z">
					Artist A-Z
				</option>
				<option value="artist_desc" aria-label="Sort by artist Z to A">
					Artist Z-A
				</option>
				<option value="views_desc" aria-label="Sort by views descending">
					Views
				</option>
			</select>
		</div>
	);
};

export default Sort;
