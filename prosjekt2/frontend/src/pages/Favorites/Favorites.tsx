import React, { useEffect, useState } from "react";
import { FaEye } from "react-icons/fa";
import FavoriteButton from "../../components/FavoriteButton/FavoriteButton";
import { Song } from "../../utils/FetchMockData";
import { formatViews } from "../../utils/FormatViews";
import { routeChange } from "../../utils/SongRouteChange";
import { useNavigate } from "react-router-dom";
import "./Favorites.css"

const Favorites: React.FC = () => {

	const [favorites, setFavorites] = useState<Song[]>([]);
	const navigate = useNavigate();
	useEffect(() => {
		
		const favoriteSongs = JSON.parse(localStorage.getItem("favoriteSongs") || "[]");
		setFavorites(favoriteSongs)	
		  
	}, [])

	return (
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
	);
};

export default Favorites;
