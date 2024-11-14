import { useEffect, useState } from "react";
import { AllSongsList } from "../../components/AllSongsComponents/AllSongsList";
import { SearchBar } from "../../components/SearchBar/SearchBar";
import { Sidebar } from "../../components/SideBar/SideBar";
import { FilterButton } from "../../components/SideBar/FilterButton/FilterButton";
import { useCachedSongs } from "../../utils/hooks/useCachedSongs";
import { genreFilterVar, minViewsVar, maxViewsVar, sortOptionVar } from "../../apollo/cache";
import { useReactiveVar } from "@apollo/client";
import "./Home.css";

const Home = () => {
	const selectedGenres = useReactiveVar(genreFilterVar);
	const minViews = useReactiveVar(minViewsVar);
	const maxViews = useReactiveVar(maxViewsVar);

	const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
	const [showLoading, setShowLoading] = useState(false);
	const [searchTerm, setSearchTerm] = useState<string>(sessionStorage.getItem("searchTerm") || "");
	const [clearFilters, setClearFilters] = useState(false);

	const { songs, isLoading, error, loadMoreSongs } = useCachedSongs(
		searchTerm,
	);

	// Delay for visning av lasting
	useEffect(() => {
		let loadingTimeout: NodeJS.Timeout;
		if (isLoading) {
			loadingTimeout = setTimeout(() => setShowLoading(true), 500); 
		} else {
			setShowLoading(false);
		}
		return () => clearTimeout(loadingTimeout);
	}, [isLoading]);

	// Oppdater sortOption ved endring
	const handleSortChange = (newSortOption: string) => {
		sortOptionVar(newSortOption); // Oppdater direkte gjennom sortOptionVar
		console.log("Sort option updated to:", newSortOption);
	};

	const handleGenreChange = (genres: string[]) => {
		genreFilterVar(genres);
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
		sortOptionVar("views_desc");
		minViewsVar(0);
		maxViewsVar(3000000);
		sessionStorage.removeItem("searchTerm");
		setClearFilters(true);
		setTimeout(() => setClearFilters(false), 0);
	};

	if (error) return <p>Error loading songs: {error?.message}</p>;

	return (
		<>
			<Sidebar
				onGenreChange={handleGenreChange}
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
