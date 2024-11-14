import { useEffect, useState } from "react";
import { AllSongsList } from "../../components/AllSongsComponents/AllSongsList";
import { SearchBar } from "../../components/SearchBar/SearchBar";
import { Sidebar } from "../../components/SideBar/SideBar";
import { FilterButton } from "../../components/SideBar/FilterButton/FilterButton";
import { useCachedSongs } from "../../utils/hooks/useCachedSongs";
import { useSongCount } from "../../utils/hooks/useSongCount";
import "./Home.css";

const Home = () => {
	const [selectedGenres, setSelectedGenres] = useState<string[] | null>(null);
	const [sortOption, setSortOption] = useState<string>("views_desc");
	const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
	const [showLoading, setShowLoading] = useState(false);
	const [searchTerm, setSearchTerm] = useState<string>("");
	const [minViews, setMinViews] = useState<number>(0);
	const [maxViews, setMaxViews] = useState<number>(3000000);
	const [clearFilters, setClearFilters] = useState(false);

	const { songCount } = useSongCount(
    selectedGenres,
    searchTerm,
    minViews,
    maxViews
  );

	const { songs, isLoading, error, loadMoreSongs } = useCachedSongs(
		selectedGenres,
		sortOption,
		searchTerm,
		minViews,
		maxViews,
	);

	// Load initial filter values from session storage
	useEffect(() => {
		const savedGenres = JSON.parse(sessionStorage.getItem("selectedGenres") || "[]");
		setSelectedGenres(savedGenres.length > 0 ? savedGenres : null);

		const savedMinViews = JSON.parse(sessionStorage.getItem("minViews") || "0");
		const savedMaxViews = JSON.parse(sessionStorage.getItem("maxViews") || "3000000");
		setMinViews(savedMinViews);
		setMaxViews(savedMaxViews);

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
		setSelectedGenres(genres.length > 0 ? genres : null);
		sessionStorage.setItem("selectedGenres", JSON.stringify(genres));
	};

	const handleViewsChange = (newMinViews: number, newMaxViews: number) => {
		setMinViews(newMinViews);
		setMaxViews(newMaxViews);
		sessionStorage.setItem("minViews", JSON.stringify(newMinViews));
		sessionStorage.setItem("maxViews", JSON.stringify(newMaxViews));
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

	// Clear all filters function
	const clearAllFilters = () => {
		setSelectedGenres(null);
		setSortOption("views_desc");
		setMinViews(0);
		setMaxViews(3000000);

		// Remove filter-related items from sessionStorage, but keep search term
		sessionStorage.removeItem("selectedGenres");
		sessionStorage.removeItem("sortOption");
		sessionStorage.removeItem("minViews");
		sessionStorage.removeItem("maxViews");

		// Toggle clearFilters to trigger reset in child components
		setClearFilters(true);

		// Reset clearFilters back to false after triggering
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
				onViewsChange={handleViewsChange}
				clearFilters={clearFilters} // Send clearFilters as boolean
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
					<section className="searchResults">
						<p className="numberOfResults"> <span className="resultNumber">{songCount}</span> results</p>
						<section className="allSongsContainer">
							<AllSongsList
								songs={songs}
								genres={selectedGenres == null ? [] : selectedGenres}
								maxViews={maxViews}
								minViews={minViews}
							/>
						</section>
					</section>
				)}
				{!isLoading && songs.length >= 30 && (
					<button className="loadMoreButton" onClick={loadMoreSongs} type="button">
						Load More Songs
					</button>
				)}
			</section>
		</>
	);
};

export default Home;
