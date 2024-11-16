import { useEffect, useState, useRef } from "react";
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

	const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
	const [clearFilters, setClearFilters] = useState(false);
	const [localSongCount, setLocalSongCount] = useState<number>(0); // Lokalt songCount
	const debounceTimer = useRef<NodeJS.Timeout | null>(null);

	// Hent data for antall resultater
	const {
		songCount,
		isLoading: isSongCountLoading,
		refetch: refetchSongCount,
	} = useSongCount(selectedGenres, searchTerm, minViews, maxViews);

	// Hent sangdata
	const { songs, isLoading, error, loadMoreSongs, hasMoreSongs } = useCachedSongs({
		searchTerm,
		selectedGenres: selectedGenres || [],
		minViews,
		maxViews,
		sortOption,
	});

	// Oppdater lokalt songCount kun når lasting er ferdig
	useEffect(() => {
		if (!isSongCountLoading) {
			setLocalSongCount(songCount); // Oppdater lokal state etter lasting
		}
	}, [songCount, isSongCountLoading]);

	useEffect(() => {
		refetchSongCount();
	}, []);

	const handleGenreChange = (genres: string[]) => {
		genreFilterVar(genres.length > 0 ? genres : []);
		refetchSongCount();
	};

	const handleViewsChange = (newMinViews: number, newMaxViews: number) => {
		minViewsVar(newMinViews);
		maxViewsVar(newMaxViews);

		if (debounceTimer.current) {
			clearTimeout(debounceTimer.current);
		}

		debounceTimer.current = setTimeout(() => {
			refetchSongCount(); // Oppdater resultater etter debounce
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
		setIsSidebarOpen((prev) => !prev);
	};

	const clearAllFilters = () => {
		// Sett Reactive Vars til standardverdier
		genreFilterVar([]);
		sortOptionVar("views_desc");
		minViewsVar(0);
		maxViewsVar(1000000);
	  
		// Tilbakestill sessionStorage
		sessionStorage.setItem("minViews", "0");
		sessionStorage.setItem("maxViews", "1000000");
	  
		setClearFilters(true); // Oppdater lokalt filterstatus
		setTimeout(() => setClearFilters(false), 0); // Tilbakestill filterstatus raskt
	  
		refetchSongCount(); // Oppdater antall resultater
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
				onViewsChange={(newMin, newMax) => handleViewsChange(newMin, newMax)}
				clearFilters={clearFilters} // Sørg for at denne blir håndtert
				selectedGenres={selectedGenres}
				searchTerm={searchTerm}
				minViews={minViews} // Pass alltid oppdaterte verdier
				maxViews={maxViews}
				onClearAllFilters={clearAllFilters}
			/>

			<section className={`homeComponents ${isSidebarOpen ? "shifted" : ""}`}>
				<section className="searchBarContainer">
					<SearchBar setSearchTerm={handleSearchSubmit} initialSearchTerm={searchTerm} />
				</section>
				<section className="filterButtonContainer">
					<FilterButton onClick={toggleSidebar} />
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
								genres={selectedGenres || []}
								maxViews={maxViews}
								minViews={minViews}
							/>
						</section>
					) : null}
				</section>
				{/* Vis "Load More Songs"-knappen kun når det er flere sanger */}
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
