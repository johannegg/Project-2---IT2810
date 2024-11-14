import { useEffect, useState } from "react";
import { AllSongsList } from "../../components/AllSongsComponents/AllSongsList";
import { SearchBar } from "../../components/SearchBar/SearchBar";
import { Sidebar } from "../../components/SideBar/SideBar";
import { FilterButton } from "../../components/SideBar/FilterButton/FilterButton";
import { useCachedSongs } from "../../utils/hooks/useCachedSongs";
import "./Home.css";

const Home = () => {
	const [selectedGenres, setSelectedGenres] = useState<string[] | null>(null);
	const [sortOption, setSortOption] = useState<string>("views_desc");
	const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
	const [showLoading, setShowLoading] = useState(false);
	const [searchTerm, setSearchTerm] = useState<string>("");
	const [username, setUsername] = useState<string | null>(null);

	const { songs, isLoading, error, loadMoreSongs } = useCachedSongs(
		selectedGenres,
		sortOption,
		searchTerm,
	);

	// Load selected genres from session storage on initial render
	useEffect(() => {
		const savedGenres = JSON.parse(sessionStorage.getItem("selectedGenres") || "[]");
		setSelectedGenres(savedGenres.length > 0 ? savedGenres : null);
	}, []);

	useEffect(() => {
		const storedUsername = localStorage.getItem("profileName");
		if (storedUsername) {
			setUsername(storedUsername);
		}

		const handleStorageChange = () => {
			const updatedUsername = localStorage.getItem("profileName");
			if (updatedUsername !== username) {
				setUsername(updatedUsername);
			}
		};
		window.addEventListener("storage", handleStorageChange);
		return () => {
			window.removeEventListener("storage", handleStorageChange);
		};
	}, [username]);

	// Loading delay
	useEffect(() => {
		let loadingTimeout: NodeJS.Timeout;
		if (isLoading) {
			loadingTimeout = setTimeout(() => setShowLoading(true), 500); // Added delay
		} else {
			setShowLoading(false);
		}
		return () => clearTimeout(loadingTimeout); // Cleanup on unmount or if loading changes
	}, [isLoading]);

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

	const handleSearchSubmit = (term: string) => {
		setSearchTerm(term);
	};

	if (error) return <p>Error loading songs: {error?.message}</p>;

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
				{!isLoading && songs.length >= 30 && (
					<button className="loadMoreButton" onClick={loadMoreSongs}>
						Load More Songs
					</button>
				)}
			</section>
		</>
	);
};

export default Home;
