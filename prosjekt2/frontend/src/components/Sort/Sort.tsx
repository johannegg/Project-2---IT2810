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
				<FaSort className="filterSortIcon" />
                <h2 className="sort-heading">Sort by</h2>
			</section>
            <select className="sort-options" value={sortOption} onChange={handleSortChange}>
                <option value="title_asc">Title A-Z</option>
                <option value="title_desc">Title Z-A</option>
                <option value="artist_asc">Artist A-Z</option>
                <option value="artist_desc">Artist Z-A</option>
                <option value="views_desc">Views</option>
            </select>
        </div>
    );
};

export default Sort;
