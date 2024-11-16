import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as heartRegular } from "@fortawesome/free-regular-svg-icons";
import { faHeart as heartSolid } from "@fortawesome/free-solid-svg-icons";
import "./FavoriteButton.css";
import { useEffect, useState } from "react";
import { SongData } from "../../utils/types/SongTypes";
import { useMutation } from "@apollo/client";
import { ADD_FAVORITE_SONG, REMOVE_FAVORITE_SONG } from "../../utils/Queries";

type FavoriteProps = {
	song: SongData;
};

const FavoriteButton = ({ song }: FavoriteProps) => {
	const [hearted, setHearted] = useState<boolean>(false);
	const [addFavorite] = useMutation(ADD_FAVORITE_SONG);
	const [removeFavorite] = useMutation(REMOVE_FAVORITE_SONG);

	const checkIfHearted = () => {
        const favoriteSongs = JSON.parse(localStorage.getItem("favoriteSongs") || "[]");
        setHearted(favoriteSongs.some((favSong: SongData) => favSong.id === song.id));
    };

	useEffect(() => {
		checkIfHearted();
		const handleAuthChange = () => checkIfHearted();
        window.addEventListener("authChange", handleAuthChange);

        return () => {
            window.removeEventListener("authChange", handleAuthChange);
        };
	}, [song]);

	const handleFavorite = async (e: React.MouseEvent<HTMLButtonElement>) => {
		e.stopPropagation();
		
		const favoriteSongs: SongData[] = JSON.parse(localStorage.getItem("favoriteSongs") || "[]");
		const storedUsername = localStorage.getItem("profileName");
		if (storedUsername == "" || !storedUsername) {
			alert("You need to log in to favorite songs");
			localStorage.removeItem("favoriteSongs")
			return
		}
		if (hearted) {
			// Remove song from favorites when toggling a already hearted the favorite button
			const updatedFavorites = favoriteSongs.filter((favoriteSong) => favoriteSong.id !== song.id);
			localStorage.setItem("favoriteSongs", JSON.stringify(updatedFavorites));
			await removeFavorite({
				variables: { username: storedUsername, songId: song.id },
			});

		} else {
			// Add entire song object to favorites
			favoriteSongs.push(song);
			localStorage.setItem("favoriteSongs", JSON.stringify(favoriteSongs));
			await addFavorite({
				variables: { username: storedUsername, songId: song.id },
			});
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
