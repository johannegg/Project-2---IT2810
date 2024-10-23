import { useEffect, useState } from "react";
import { AllSongsList } from "../../components/AllSongsComponents/AllSongsList";
import { SearchBar } from "../../components/SearchBar/SearchBar";
import { fetchSongs, type Song } from "../../utils/FetchMockData";
import "./Home.css";
import { Sidebar } from "../../components/SideBar/SideBar";
import { FilterButton } from "../../components/SideBar/FilterButton/FilterButton";

const Home = () => {
	const [songs, setSongs] = useState<Song[]>([]);
	const [searchedSongs, setSearchedSongs] = useState<Song[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
	const [sortOption, setSortOption] = useState<string>("title-asc");
	const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

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

	const toggleSidebar = () => {
		setIsSidebarOpen((prev) => !prev);
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
				onToggle={setIsSidebarOpen} //setIsSidebarOpen
				isOpen={isSidebarOpen}
			/>
			<section className={`homeComponents ${isSidebarOpen ? "shifted" : ""}`}>
				<section className="searchBarContainer">
					<SearchBar songs={songs} setSearchedSongs={setSearchedSongs} />
				</section>
				<section className="filterButtonContainer">
					<FilterButton onClick={toggleSidebar} />
				</section>
				<section className="allSongsContainer">
					<AllSongsList songs={searchedSongs} genres={selectedGenres} />
				</section>
			</section>
		</>
	);
};

export default Home;
