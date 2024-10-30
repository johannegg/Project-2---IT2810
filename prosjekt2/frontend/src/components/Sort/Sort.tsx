import type React from "react";
import { FaSort } from "react-icons/fa";
import { SongData } from "../../utils/types/SongTypes";
import "./Sort.css";

type SortProps = {
    songs: SongData[];
    sortOption: string;
    onSortChange: (newSort: string, sortedSongs: SongData[]) => void;
};

const Sort: React.FC<SortProps> = ({ songs, sortOption, onSortChange }) => {

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newSortOption = e.target.value;
        const sortedSongs = [...songs].sort((a, b) => {
            switch (newSortOption) {
                case 'title-asc':
                    return a.title.localeCompare(b.title);
                case 'title-desc':
                    return b.title.localeCompare(a.title);
                case 'artist-asc':
                    return a.artist.name.localeCompare(b.artist.name);
                case 'artist-desc':
                    return b.artist.name.localeCompare(a.artist.name);
                default:
                    return 0;
            }
        });

        onSortChange(newSortOption, sortedSongs);
    };

    return (
        <div className="sort-container">
            <section className="sortHeader">
				<FaSort className="filterSortIcon" />
                <h2 className="sort-heading">Sort by</h2>
			</section>
            <select className="sort-options" value={sortOption} onChange={handleSortChange}>
                <option value="title-asc">Title A-Z</option>
                <option value="title-desc">Title Z-A</option>
                <option value="artist-asc">Artist A-Z</option>
                <option value="artist-desc">Artist Z-A</option>
            </select>
        </div>
    );
};

export default Sort;
