import React from "react";
import { Song } from "../../utils/FetchMockData";
import "./Sort.css";

type SortProps = {
    songs: Song[];
    sortOption: string;
    onSortChange: (newSort: string, sortedSongs: Song[]) => void;
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
                    return a.artist.localeCompare(b.artist);
                case 'artist-desc':
                    return b.artist.localeCompare(a.artist);
                default:
                    return 0;
            }
        });

        onSortChange(newSortOption, sortedSongs);
    };

    return (
        <div className="sort-container">
            <h2 className="sort-heading">Sort by:</h2>
            <select id="sort-options" value={sortOption} onChange={handleSortChange}>
                <option value="title-asc">Title A-Z</option>
                <option value="title-desc">Title Z-A</option>
                <option value="artist-asc">Artist A-Z</option>
                <option value="artist-desc">Artist Z-A</option>
            </select>
        </div>
    );
};

export default Sort;
