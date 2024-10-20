import { useEffect, useState } from "react";
import { AllSongsList } from "../../components/AllSongsComponents/AllSongsList";
import { SearchBar } from "../../components/SearchBar/SearchBar";
import { fetchSongs, type Song } from "../../utils/FetchMockData";
import "./Home.css";
import { Sidebar } from "../../components/SideBar/SideBar";

const Home = () => {
	const [songs, setSongs] = useState<Song[]>([]);
	const [searchedSongs, setSearchedSongs] = useState<Song[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
	const [sortOption, setSortOption] = useState<string>("title-asc");

	useEffect(() => {
		const loadData = async () => {
			try {
				const data = await fetchSongs();
				setSongs(data);
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
		setSongs(sortedSongs);
	};

	if (loading) return <p>Loading songs...</p>;
	if (error) return <p>{error}</p>;

	return (
		<>
			<Sidebar
				onGenreChange={handleGenreChange}
				sortOption={sortOption}
				onSortChange={handleSortChange}
				songs={searchedSongs}
			/>
			<div className="homeComponents">
				<div className="searchBarContainer">
					<SearchBar songs={songs} setSearchedSongs={setSearchedSongs} />
				</div>
				<div className="appContainer">
					<AllSongsList songs={searchedSongs} genres={selectedGenres} />
				</div>
			</div>
		</>
	);
};

export default Home;
