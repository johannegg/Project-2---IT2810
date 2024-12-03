import { useEffect, useState, useRef } from "react";
import "./Home.css";
import { AllSongsList } from "../../components/AllSongsComponents/AllSongsList";
import { SearchBar } from "../../components/SearchBar/SearchBar";
import { Sidebar } from "../../components/SideBar/SideBar";
import { FilterButton } from "../../components/SideBar/FilterButton/FilterButton";
import { useCachedSongs } from "../../utils/hooks/useCachedSongs";
import {
	genreFilterVar,
	minViewsVar,
	maxViewsVar,
	sortOptionVar,
	homeSearchTermVar,
	isSidebarOpenVar,
	clearFiltersVar,
} from "../../apollo/cache";
import { useReactiveVar } from "@apollo/client";
import { useSongCount } from "../../utils/hooks/useSongCount";
import "./Home.css";

const Home = () => {
	const selectedGenres = useReactiveVar(genreFilterVar);
	const minViews = useReactiveVar(minViewsVar);
	const maxViews = useReactiveVar(maxViewsVar);
	const sortOption = useReactiveVar(sortOptionVar);
	const searchTerm = useReactiveVar(homeSearchTermVar);
	const isSidebarOpen = useReactiveVar(isSidebarOpenVar);

	const [localSongCount, setLocalSongCount] = useState<number>(0);
	const debounceTimer = useRef<NodeJS.Timeout | null>(null);
	const sidebarRef = useRef<HTMLDivElement | null>(null);

	// Fetch song count and state from backend/cache
	const {
		songCount,
		isLoading: isSongCountLoading,
		refetch: refetchSongCount,
	} = useSongCount(selectedGenres, searchTerm, minViews, maxViews);

	const { songs, isLoading, error, loadMoreSongs, hasMoreSongs } = useCachedSongs({
		searchTerm,
		selectedGenres: selectedGenres || [],
		minViews,
		maxViews,
		sortOption,
	});

	useEffect(() => {
		if (!isSongCountLoading) {
			setLocalSongCount(songCount);
		}
	}, [songCount, isSongCountLoading]);

	useEffect(() => {
		refetchSongCount();
	}, [refetchSongCount]);

	// Update genres in Apollo cache and refetch song count
	const handleGenreChange = (genres: string[]) => {
		genreFilterVar(genres.length > 0 ? genres : []);
		refetchSongCount();
	};

	// Update min/max views in Apollo cache and debounce refetch
	const handleViewsChange = (newMinViews: number, newMaxViews: number) => {
		minViewsVar(newMinViews);
		maxViewsVar(newMaxViews);

		if (debounceTimer.current) {
			clearTimeout(debounceTimer.current);
		}

		debounceTimer.current = setTimeout(() => {
			refetchSongCount();
		}, 300);
	};

	const handleSortChange = (newSortOption: string) => {
		sortOptionVar(newSortOption);
	};

	const handleSearchSubmit = (term: string) => {
		homeSearchTermVar(term);
		refetchSongCount();
	};

	const toggleSidebar = () => {
		isSidebarOpenVar(!isSidebarOpen);
		if (!isSidebarOpen && sidebarRef.current) {
			setTimeout(() => {
				sidebarRef.current?.focus();
			}, 0);
		}
	};

	// Clear all filters and reset state in Apollo cache
	const clearAllFilters = () => {
		genreFilterVar([]);
		sortOptionVar("views_desc");
		minViewsVar(0);
		maxViewsVar(1000000);

		sessionStorage.setItem("minViews", "0");
		sessionStorage.setItem("maxViews", "1000000");
		sessionStorage.removeItem("selectedGenres");

		clearFiltersVar(true);
		refetchSongCount();

		setTimeout(() => {
			clearFiltersVar(false);
		}, 100);
	};

	if (error) return <p>Error loading songs: {error?.message}</p>;

	return (
		<>
			<Sidebar
				ref={sidebarRef}
				onGenreChange={handleGenreChange}
				onSortChange={handleSortChange}
				songs={songs}
				onToggle={toggleSidebar}
				onViewsChange={(newMin, newMax) => handleViewsChange(newMin, newMax)}
				searchTerm={searchTerm}
				onClearAllFilters={clearAllFilters}
				aria-label="Sidebar with filtering and sorting options"
			/>

			<section
				className={`homeComponents ${isSidebarOpen ? "shifted" : ""}`}
				aria-label="Main content section"
			>
				<section className="searchBarContainer">
					<SearchBar
						setSearchTerm={handleSearchSubmit}
						initialSearchTerm={searchTerm}
						aria-label="Search songs"
					/>
				</section>
				<section className="filterButtonContainer">
					<FilterButton onClick={toggleSidebar} aria-label="Toggle sidebar" />
				</section>
				<section className="searchResults">
					<p className="numberOfResults">
						<span className="resultNumber">{isSongCountLoading ? localSongCount : songCount}</span>{" "}
						results
					</p>
					{!isLoading ? (
						<section className="allSongsContainer">
							<AllSongsList
								songs={songs}
								selectedGenres={selectedGenres}
								maxViews={maxViews}
								minViews={minViews}
								aria-label="List of songs"
							/>
						</section>
					) : null}
				</section>
				{!isLoading && hasMoreSongs && songs.length > 0 && (
					<button className="loadMoreButton" onClick={loadMoreSongs} type="button">
						Load More Songs
					</button>
				)}
			</section>
		</>
	);
};

export default Home;
