import { useEffect, useState } from "react";
import { AllSongsList } from "../../components/AllSongsComponents/AllSongsList";
import { SearchBar } from "../../components/SearchBar/SearchBar";
import { Sidebar } from "../../components/SideBar/SideBar";
import { FilterButton } from "../../components/SideBar/FilterButton/FilterButton";
import { useCachedSongs } from "../../utils/hooks/useCachedSongs";
import { genreFilterVar, minViewsVar, maxViewsVar, sortOptionVar, homeSearchTermVar } from "../../apollo/cache";
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
  const [showLoading, setShowLoading] = useState(false);
  const [clearFilters, setClearFilters] = useState(false);

  const { songCount, isLoading: isSongCountLoading, refetch: refetchSongCount } = useSongCount(
    selectedGenres,
    searchTerm,
    minViews,
    maxViews
  );

  const { songs, isLoading, error, loadMoreSongs, hasMoreSongs } = useCachedSongs({
    searchTerm,
    selectedGenres: selectedGenres || [],
    minViews,
    maxViews,
    sortOption,
  });

  useEffect(() => {
    refetchSongCount();
  }, []); 

  // Loading delay for songs
  useEffect(() => {
    let loadingTimeout: NodeJS.Timeout;
    if (isLoading || isSongCountLoading) {
      loadingTimeout = setTimeout(() => setShowLoading(true), 500);
    } else {
      setShowLoading(false);
    }
    return () => clearTimeout(loadingTimeout);
  }, [isLoading, isSongCountLoading]);

  const handleGenreChange = (genres: string[]) => {
    genreFilterVar(genres.length > 0 ? genres : []);
    refetchSongCount(); 
  };

  const handleViewsChange = (newMinViews: number, newMaxViews: number) => {
    minViewsVar(newMinViews);
    maxViewsVar(newMaxViews);
    refetchSongCount(); 
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
    genreFilterVar([]);
    sortOptionVar("views_desc");
    minViewsVar(0);
    maxViewsVar(1000000);

    setClearFilters(true);
    setTimeout(() => setClearFilters(false), 0);

    refetchSongCount();
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
        clearFilters={clearFilters}
        selectedGenres={selectedGenres}
        searchTerm={searchTerm}
        minViews={minViews}
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
        {showLoading ? (
          <p>Loading songs...</p>
        ) : (
          <section className="searchResults">
            <p className="numberOfResults">
              <span className="resultNumber">{songCount}</span> results
            </p>
            <section className="allSongsContainer">
              <AllSongsList
                songs={songs}
                genres={selectedGenres || []}
                maxViews={maxViews}
                minViews={minViews}
              />
            </section>
          </section>
        )}
        {!isLoading && hasMoreSongs && (
          <button className="loadMoreButton" onClick={loadMoreSongs} type="button">
            Load More Songs
          </button>
        )}
      </section>
    </>
  );
};

export default Home;
