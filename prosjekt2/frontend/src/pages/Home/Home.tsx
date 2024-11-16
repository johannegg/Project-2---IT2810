import { useEffect, useState } from "react";
import { AllSongsList } from "../../components/AllSongsComponents/AllSongsList";
import { SearchBar } from "../../components/SearchBar/SearchBar";
import { Sidebar } from "../../components/SideBar/SideBar";
import { FilterButton } from "../../components/SideBar/FilterButton/FilterButton";
import { useCachedSongs } from "../../utils/hooks/useCachedSongs";
import { genreFilterVar, minViewsVar, maxViewsVar, sortOptionVar, homeSearchTermVar } from "../../apollo/cache";
import { useReactiveVar } from "@apollo/client";
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

  useEffect(() => {
    sessionStorage.setItem("selectedGenres", JSON.stringify(selectedGenres));
  }, [selectedGenres]);

  const { songs, isLoading, error, loadMoreSongs, hasMoreSongs } = useCachedSongs({
    searchTerm,
    selectedGenres,
    minViews,
    maxViews,
    sortOption,
  });

  useEffect(() => {
    let loadingTimeout: NodeJS.Timeout;
    if (isLoading) {
      loadingTimeout = setTimeout(() => setShowLoading(true), 500);
    } else {
      setShowLoading(false);
    }
    return () => clearTimeout(loadingTimeout);
  }, [isLoading]);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const handleSearchSubmit = (term: string) => {
    homeSearchTermVar(term);
  };

  const clearAllFilters = () => {
    genreFilterVar([]);
    sortOptionVar("views_desc");
    minViewsVar(0);
    maxViewsVar(1000000);
    sessionStorage.setItem("selectedGenres", JSON.stringify([]));
    sessionStorage.setItem("sortOption", "views_desc");
    sessionStorage.setItem("minViews", "0");
    sessionStorage.setItem("maxViews", "1000000");

    setClearFilters(true);
    setTimeout(() => setClearFilters(false), 0);
  };

  if (error) return <p>Error loading songs: {error?.message}</p>;

  return (
    <>
      <Sidebar
        onGenreChange={(genres) => genreFilterVar(genres)}
        onSortChange={(sort) => sortOptionVar(sort)}
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
          <SearchBar setSearchTerm={handleSearchSubmit} initialSearchTerm={searchTerm} />
        </section>
        <section className="filterButtonContainer">
          <FilterButton onClick={toggleSidebar} />
        </section>
        {showLoading ? (
          <p>Loading songs...</p>
        ) : (
          <section className="allSongsContainer">
            <AllSongsList songs={songs} genres={selectedGenres || []} maxViews={maxViews} minViews={minViews} />
          </section>
        )}
        {(!isLoading && hasMoreSongs) && (
          <button className="loadMoreButton" onClick={loadMoreSongs}>
            Load More Songs
          </button>
        )}
      </section>
    </>
  );
};

export default Home;
