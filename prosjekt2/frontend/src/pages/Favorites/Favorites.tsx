import React, { useEffect, useState } from "react";
import "./Favorites.css";
import { AllSongsList } from "../../components/AllSongsComponents/AllSongsList";
import { SearchBar } from "../../components/SearchBar/SearchBar";
import { useNavigate } from "react-router-dom";
import { SongData } from "../../utils/types/SongTypes";
import { favoritesSearchTermVar } from "../../apollo/cache"; 
import { useReactiveVar } from "@apollo/client";

const Favorites: React.FC = () => {
	const [favorites, setFavorites] = useState<SongData[]>([]);
	const [searchedSongs, setSearchedSongs] = useState<SongData[]>([]);
	const searchTerm = useReactiveVar(favoritesSearchTermVar); 
	const genres = ["pop", "rock", "rap", "rb", "country"];
	const navigate = useNavigate();

	useEffect(() => {
		const favoriteSongs = JSON.parse(localStorage.getItem("favoriteSongs") || "[]");
		setFavorites(favoriteSongs);
		setSearchedSongs(favoriteSongs);
	}, []);

	useEffect(() => {
		const filterSongs = () => {
			if (searchTerm === "") return favorites;
			const keywords = searchTerm.toLowerCase().split(" ");

			return favorites.filter((song) => {
				return keywords.every((keyword) =>
					(song.title?.toLowerCase().includes(keyword) || "") ||
					(song.artist?.name?.toLowerCase().includes(keyword) || "")
				);
			});
		};
		setSearchedSongs(filterSongs());
	}, [searchTerm, favorites]);

	const handleSearchSubmit = (term: string) => {
		favoritesSearchTermVar(term); 
	};

	if (favorites.length === 0) {
		return (
			<section className="no-favorites-container">
				<h2>You have no favorited songs</h2>
				<p>Get started by adding some from the homepage!</p>
				<button onClick={() => navigate("/")}>Go to home</button>
			</section>
		);
	}

	return (
		<section className="favorites-container">
			<h1>Your Favorite Songs</h1>
			<section className="favorites-searchBarContainer">
				<SearchBar
					setSearchTerm={handleSearchSubmit}
					initialSearchTerm={searchTerm} 
				/>
			</section>
			<section className="favorites-allSongsContainer">
				<AllSongsList songs={searchedSongs} genres={genres} />
			</section>
		</section>
	);
};

export default Favorites;
