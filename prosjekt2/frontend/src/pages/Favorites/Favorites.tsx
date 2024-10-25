import React, { useEffect, useState } from "react";
import { Song } from "../../utils/FetchMockData";
import "./Favorites.css"
import { AllSongsList } from "../../components/AllSongsComponents/AllSongsList";
import { SearchBar } from "../../components/SearchBar/SearchBar";

const Favorites: React.FC = () => {

	const [favorites, setFavorites] = useState<Song[]>([]);
	const [searchedSongs, setSearchedSongs] = useState<Song[]>([]);
	const genres = ["pop", "rock"]

	useEffect(() => {
		
		const favoriteSongs = JSON.parse(localStorage.getItem("favoriteSongs") || "[]");
		setFavorites(favoriteSongs)	
		  
	}, [])

	return (
		<section className="favorites-container">
			<h1>Your Favorite Songs</h1>
			<section className="favorites-searchBarContainer">
				<SearchBar songs={favorites} setSearchedSongs={setSearchedSongs} />
			</section>
			<section className="favorites-allSongsContainer">
				<AllSongsList songs={searchedSongs} genres={genres} />
			</section>
		</section>
	)

	/* return (
		<section className="favorites-container">
			<h1>Your Favorite Songs</h1>
			<table className="favorites-table">
					{favorites.map((song) => (
						<tr key={song.id} className="favorites-row" onClick={() => routeChange(song, navigate)}>
							<td className="favorites-title-artist-cell">
								<span className="titleCell">{song.title}</span>
								<span className="artistCell">{song.artist}</span>
            				</td>
							<td className="favorites-publishyear">{song.year}</td>
							<td className="favorites-viewsCell">
								<FaEye style={{ marginRight: "5px" }} />
								{formatViews(song.views)}
							</td>
              				<td><FavoriteButton song={song}/></td>
						</tr>
					))}
				</table>
		</section>
	); */
};

export default Favorites;
