import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as heartRegular } from "@fortawesome/free-regular-svg-icons";
import { faHeart as heartSolid } from "@fortawesome/free-solid-svg-icons";
import "./FavoriteButton.css";
import { useEffect, useState } from "react";
import { SongData } from "../../utils/types/SongTypes";

type FavoriteProps = {
	song: SongData;
};

const FavoriteButton = ({ song }: FavoriteProps) => {
	const [hearted, setHearted] = useState<boolean>(false);

	useEffect(() => {
		// Check if the song is already favorited (saved in localstorage)
		const favoriteSongs = JSON.parse(localStorage.getItem("favoriteSongs") || "[]");
		if (favoriteSongs.some((favSong: SongData) => favSong.id === song.id)) {
			setHearted(true);
		}
	}, [song]);

	const handleFavorite = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.stopPropagation();

		const favoriteSongs: SongData[] = JSON.parse(localStorage.getItem("favoriteSongs") || "[]");
		// Remove song from favorites when toggling a already hearted the favorite button
		if (hearted) {
			const updatedFavorites = favoriteSongs.filter((favoriteSong) => favoriteSong.id !== song.id);
			localStorage.setItem("favoriteSongs", JSON.stringify(updatedFavorites));
			// Add entire song object to favorites
		} else {
			favoriteSongs.push(song);
			localStorage.setItem("favoriteSongs", JSON.stringify(favoriteSongs));
		}
		setHearted(!hearted);
	};

	return (
		<button className={`favoriteButton `} onClick={(e) => handleFavorite(e)} type="button">
			{hearted ? (
				<FontAwesomeIcon icon={heartSolid} style={{ color: "var(--theme-favorite-pink)" }} />
			) : (
				<FontAwesomeIcon icon={heartRegular} style={{ color: "var(--theme-favorite-pink)" }} />
			)}
		</button>
	);
};

export default FavoriteButton;
