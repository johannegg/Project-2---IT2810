import { useEffect, useState } from "react";
import { AllSongsList } from "../../components/AllSongsComponents/AllSongsList";
import { SearchBar } from "../../components/SearchBar/SearchBar";
import { Sidebar } from "../../components/SideBar/SideBar";
import { FilterButton } from "../../components/SideBar/FilterButton/FilterButton";
import { useQuery } from "@apollo/client";
import { GET_SONGS } from "../../utils/Queries";
import { SongsQueryResponse } from "../../utils/types/QueryTypes";
import { SongData } from "../../utils/types/SongTypes";
import "./Home.css";

const Home = () => {
	const [songs, setSongs] = useState<SongData[]>([]);
	const [searchedSongs, setSearchedSongs] = useState<SongData[]>([]);
	const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
	const [sortOption, setSortOption] = useState<string>("title-asc");
	const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
	const { loading, error, data } = useQuery<SongsQueryResponse>(GET_SONGS);

	useEffect(() => {
		if(data) {
			setSongs(data.songs)
		}
	}, [data]);

	const handleGenreChange = (genres: string[]) => {
		setSelectedGenres(genres);
	};

	const handleSortChange = (newSortOption: string, sortedSongs: SongData[]) => {
		setSortOption(newSortOption);
		setSongs(sortedSongs);
	};

	const toggleSidebar = () => {
		setIsSidebarOpen((prev) => !prev);
	};

	if (loading) return <p>Loading songs...</p>;
	if (error || !data) return <p>{error?.message}</p>;

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
