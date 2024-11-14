import { useEffect, useState } from "react";
import { AllSongsList } from "../../components/AllSongsComponents/AllSongsList";
import { SearchBar } from "../../components/SearchBar/SearchBar";
import { Sidebar } from "../../components/SideBar/SideBar";
import { FilterButton } from "../../components/SideBar/FilterButton/FilterButton";
import { useCachedSongs } from "../../utils/hooks/useCachedSongs";
import { genreFilterVar, minViewsVar, maxViewsVar } from "../../apollo/cache";
import { useReactiveVar } from "@apollo/client";
import "./Home.css";

const Home = () => {
	const selectedGenres = useReactiveVar(genreFilterVar);
	const minViews = useReactiveVar(minViewsVar);
	const maxViews = useReactiveVar(maxViewsVar);
	const [sortOption, setSortOption] = useState<string>("views_desc");
	const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
	const [showLoading, setShowLoading] = useState(false);
	const [searchTerm, setSearchTerm] = useState<string>("");
	const [clearFilters, setClearFilters] = useState(false);

	const { songs, isLoading, error, loadMoreSongs } = useCachedSongs(
		sortOption,
		searchTerm,
	);

	// Load initial values from session storage
	useEffect(() => {
		const savedSortOption = sessionStorage.getItem("sortOption");
		if (savedSortOption) setSortOption(savedSortOption);

		const savedSearchTerm = sessionStorage.getItem("searchTerm") || "";
		setSearchTerm(savedSearchTerm);
	}, []);

	// Loading delay for songs
	useEffect(() => {
		let loadingTimeout: NodeJS.Timeout;
		if (isLoading) {
			loadingTimeout = setTimeout(() => setShowLoading(true), 500); 
		} else {
			setShowLoading(false);
		}
		return () => clearTimeout(loadingTimeout);
	}, [isLoading]);

	const handleGenreChange = (genres: string[]) => {
		genreFilterVar(genres);
	};

	const handleSortChange = (newSortOption: string) => {
		setSortOption(newSortOption);
		sessionStorage.setItem("sortOption", newSortOption);
	};

	const handleSearchSubmit = (term: string) => {
		setSearchTerm(term);
		sessionStorage.setItem("searchTerm", term);
	};

	const toggleSidebar = () => {
		setIsSidebarOpen((prev) => !prev);
	};

	const clearAllFilters = () => {
		handleGenreChange([]);
		setSortOption("views_desc");
		minViewsVar(0);
		maxViewsVar(3000000);
		sessionStorage.removeItem("sortOption");
		setClearFilters(true);
		setTimeout(() => setClearFilters(false), 0);
	};

	if (error) return <p>Error loading songs: {error?.message}</p>;

	return (
		<>
			<Sidebar
				onGenreChange={handleGenreChange}
				sortOption={sortOption}
				onSortChange={handleSortChange}
				songs={songs}
				onToggle={setIsSidebarOpen}
				isOpen={isSidebarOpen}
				onViewsChange={(min, max) => {
					minViewsVar(min);
					maxViewsVar(max);
				}}
				clearFilters={clearFilters}
				onClearAllFilters={clearAllFilters}
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
						<AllSongsList
							songs={songs}
							genres={selectedGenres || []}
							maxViews={maxViews}
							minViews={minViews}
						/>
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
