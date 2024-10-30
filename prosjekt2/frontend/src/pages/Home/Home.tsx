import { useEffect, useState } from "react";
import { AllSongsList } from "../../components/AllSongsComponents/AllSongsList";
import { SearchBar } from "../../components/SearchBar/SearchBar";
import { Sidebar } from "../../components/SideBar/SideBar";
import { FilterButton } from "../../components/SideBar/FilterButton/FilterButton";
import { SongData } from "../../utils/types/SongTypes";
import { SongsQueryResponse } from "../../utils/types/QueryTypes";
import { useQuery } from "@apollo/client";
import { GET_SONGS } from "../../utils/Queries";
import "./Home.css";

const Home = () => {
	const [songs, setSongs] = useState<SongData[]>([]);
	const [selectedGenres, setSelectedGenres] = useState<string[] | null>(null);
	const [sortOption, setSortOption] = useState<string>("views_desc");
	const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
	const [showLoading, setShowLoading] = useState(false);
	const [searchTerm, setSearchTerm] = useState<string>("");

	const { loading, error, data, fetchMore } = useQuery<SongsQueryResponse>(GET_SONGS, {
		variables: {
			skip: 0,
			limit: 30,
			genres: selectedGenres || null,
			sortBy: sortOption,
			searchTerm,
		}, // Fetch the first 30 songs
	});

	const loadMoreSongs = () => {
		if (!data || !data.songs) return; // Prevent running if data is not available

		fetchMore({
			variables: {
				skip: data.songs.length, // Increment skip based on current number of songs fetched
				limit: 30, // TODO: save skip value to use in dynamic paging
			},
		})
			.then((response) => {
				const newSongs = response.data.songs;
				// Update the state by adding the new songs to the existing ones
				setSongs((prevSongs) => [...prevSongs, ...newSongs]);
			})
			.catch((error) => {
				console.error("Error fetching more songs: ", error);
			});
	};

	useEffect(() => {
		if (data) {
			setSongs(data.songs);
		}
	}, [data]);

	useEffect(() => {
		const savedGenres = JSON.parse(sessionStorage.getItem("selectedGenres") || "[]");
		setSelectedGenres(savedGenres.length > 0 ? savedGenres : null);
	}, []);

	useEffect(() => {
		let loadingTimeout: NodeJS.Timeout;
		if (loading) {
			loadingTimeout = setTimeout(() => setShowLoading(true), 500); // Added delay
		} else {
			setShowLoading(false); // Hide loading message if data is loaded
		}
		return () => clearTimeout(loadingTimeout); // Cleanup on unmount or if loading changes
	}, [loading]);

	const handleGenreChange = (genres: string[]) => {
		setSelectedGenres(genres.length > 0 ? genres : null);
		sessionStorage.setItem("selectedGenres", JSON.stringify(genres));
	};

	const handleSortChange = (newSortOption: string) => {
		setSortOption(newSortOption);
	};

	const toggleSidebar = () => {
		setIsSidebarOpen((prev) => !prev);
	};

	if (error) return <p>{error?.message}</p>;

	const handleSearchSubmit = (term: string) => {
		setSearchTerm(term); // Updates search term based on button click
	};

	return (
		<>
			<Sidebar
				onGenreChange={handleGenreChange}
				sortOption={sortOption}
				onSortChange={handleSortChange}
				songs={songs}
				onToggle={setIsSidebarOpen} //setIsSidebarOpen
				isOpen={isSidebarOpen}
			/>
			<section className={`homeComponents ${isSidebarOpen ? "shifted" : ""}`}>
				<section className="searchBarContainer">
					<SearchBar setSearchTerm={handleSearchSubmit} />
				</section>
				<section className="filterButtonContainer">
					<FilterButton onClick={toggleSidebar} />
				</section>
				{showLoading ? (
					<p>Loading songs...</p>
				) : (
					<section className="allSongsContainer">
						<AllSongsList songs={songs} genres={selectedGenres == null ? [] : selectedGenres} />
					</section>
				)}
				{!loading && <button onClick={loadMoreSongs}>Load More Songs</button>}
			</section>
		</>
	);
};

export default Home;
