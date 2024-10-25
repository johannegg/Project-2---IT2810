import React, { useEffect, useState } from "react";
import { Song } from "../../utils/FetchMockData";
import "./Favorites.css";
import { AllSongsList } from "../../components/AllSongsComponents/AllSongsList";
import { SearchBar } from "../../components/SearchBar/SearchBar";
import { useNavigate } from "react-router-dom";

const Favorites: React.FC = () => {
  const [favorites, setFavorites] = useState<Song[]>([]);
  const [searchedSongs, setSearchedSongs] = useState<Song[]>([]);
  const genres = ["pop", "rock", "rap", "country"];
  const navigate = useNavigate()

  useEffect(() => {
    const favoriteSongs = JSON.parse(localStorage.getItem("favoriteSongs") || "[]");
    setFavorites(favoriteSongs);
  }, []);

  // Show message if no favorite songs are found
  if (favorites.length === 0) {
    return (
      <section className="no-favorites-container">
        <h2>You have no favorited songs</h2>
		<p>Get started by adding some from the homepage!</p>
		<button onClick={() => navigate("/")}>
			Go to home
		</button>
      </section>
    );
  }

  return (
    <section className="favorites-container">
      <h1>Your Favorite Songs</h1>
      <section className="favorites-searchBarContainer">
        <SearchBar songs={favorites} setSearchedSongs={setSearchedSongs} />
      </section>
      <section className="favorites-allSongsContainer">
        <AllSongsList songs={searchedSongs.length ? searchedSongs : favorites} genres={genres} />
      </section>
    </section>
  );
};

export default Favorites;
