import { useEffect, useState } from "react";
import { AllSongsList } from "../../components/AllSongsComponents/AllSongsList";
import { SearchBar } from "../../components/SearchBar/SearchBar";
import { fetchSongs, type Song } from "../../utils/FetchMockData";
import { Filter } from "../../components/Filter/Filter";
import "./Home.css";
import Sort from "../../components/Sort/Sort";

const Home = () => {
    const [songs, setSongs] = useState<Song[]>([]);
    const [searchedSongs, setSearchedSongs] = useState<Song[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
    const [sortOption, setSortOption] = useState<string>('title-asc'); 
    const [sortedSongs, setSortedSongs] = useState<Song[]>([]); 

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await fetchSongs();
                setSongs(data);
                setSearchedSongs(data); 
                setSortedSongs(data);  
            } catch {
                setError("Failed to load data");
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const handleGenreChange = (genres: string[]) => {
        setSelectedGenres(genres);
    };

    const handleSortChange = (newSortOption: string, sortedSongs: Song[]) => {
        setSortOption(newSortOption);
        setSortedSongs(sortedSongs);  
    };

    if (loading) return <p>Loading songs...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="homeComponents">
            <div className="searchBarContainer">
                <SearchBar songs={songs} setSearchedSongs={setSearchedSongs} />
            </div>
            <div className="appContainer">
				
                <div className="filter-sort-container">
                    <Filter onGenreChange={handleGenreChange} />
                    <Sort songs={searchedSongs} sortOption={sortOption} onSortChange={handleSortChange} />
                </div>
                
                <div className="allSongsList-container">
                    <AllSongsList songs={sortedSongs} genres={selectedGenres} />
                </div>
            </div>
        </div>
    );
};

export default Home;
