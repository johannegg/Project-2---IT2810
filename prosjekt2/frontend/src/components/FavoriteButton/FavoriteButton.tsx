import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as heartRegular } from "@fortawesome/free-regular-svg-icons";
import { faHeart as heartSolid } from "@fortawesome/free-solid-svg-icons";
import "./FavoriteButton.css";
import { useReactiveVar } from "@apollo/client";
import { favoriteSongsVar } from "../../apollo/cache";
import { SongData } from "../../utils/types/SongTypes";
import { useEffect } from "react";

type FavoriteProps = {
	song: SongData;
};

const FavoriteButton = ({ song }: FavoriteProps) => {
	const favoriteSongs = useReactiveVar(favoriteSongsVar);
	const isFavorite = favoriteSongs.some((favSong) => favSong.id === song.id);

	const handleFavorite = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.stopPropagation();

		if (isFavorite) {
			const updatedFavorites = favoriteSongs.filter((favSong) => favSong.id !== song.id);
			favoriteSongsVar([...updatedFavorites]);
		} else {
			const updatedFavorites = [...favoriteSongs, song];
			favoriteSongsVar([...updatedFavorites]);
		}
	};

	// Oppdater `localStorage` hver gang `favoriteSongsVar` endres
	useEffect(() => {
		localStorage.setItem("favoriteSongs", JSON.stringify(favoriteSongs));
	}, [favoriteSongs]);

	return (
		<button className="favoriteButton" onClick={handleFavorite} type="button">
			{isFavorite ? (
				<FontAwesomeIcon icon={heartSolid} style={{ color: "var(--theme-favorite-pink)" }} />
			) : (
				<FontAwesomeIcon icon={heartRegular} style={{ color: "var(--theme-favorite-pink)" }} />
			)}
		</button>
	);
};

export default FavoriteButton;
