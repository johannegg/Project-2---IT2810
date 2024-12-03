import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as heartRegular } from "@fortawesome/free-regular-svg-icons";
import { faHeart as heartSolid } from "@fortawesome/free-solid-svg-icons";
import "./FavoriteButton.css";
import { useReactiveVar } from "@apollo/client";
import { favoriteSongsVar } from "../../apollo/cache";
import { SongData } from "../../utils/types/SongTypes";
import { useMutation } from "@apollo/client";
import { ADD_FAVORITE_SONG, REMOVE_FAVORITE_SONG } from "../../utils/Queries";

type FavoriteProps = {
	song: SongData;
};

const FavoriteButton = ({ song }: FavoriteProps) => {
	const favoriteSongs = useReactiveVar(favoriteSongsVar);
	const isFavorite = favoriteSongs.some((favSong) => favSong.id === song.id);
	const [addFavorite] = useMutation(ADD_FAVORITE_SONG);
	const [removeFavorite] = useMutation(REMOVE_FAVORITE_SONG);

	const handleFavorite = async (e: React.MouseEvent<HTMLButtonElement>) => {
		e.stopPropagation();
		const storedUsername = localStorage.getItem("profileName");
		if (!storedUsername) {
			// Ensure the user is logged in before allowing favoriting
			alert("You need to log in to favorite songs");
			return;
		}
		if (isFavorite) {
			// Remove song from favorites and update the cache
			const updatedFavorites = favoriteSongs.filter((favoriteSong) => favoriteSong.id !== song.id);
			favoriteSongsVar([...updatedFavorites]);
			await removeFavorite({
				variables: { username: storedUsername, songId: song.id },
			});
		} else {
			// Add song to favorites and update the cache
			const updatedFavorites = [...favoriteSongs, song];
			favoriteSongsVar([...updatedFavorites]);
			await addFavorite({
				variables: { username: storedUsername, songId: song.id },
			});
		}
	};

	return (
		<button
			className="favoriteButton"
			onClick={handleFavorite}
			type="button"
			aria-label={
				isFavorite ? `Remove ${song.title} from favorites` : `Add ${song.title} to favorites`
			}
		>
			{/* Toggle between solid and regular heart icons based on favorite status */}
			{isFavorite ? (
				<FontAwesomeIcon icon={heartSolid} style={{ color: "var(--theme-favorite-pink)" }} />
			) : (
				<FontAwesomeIcon icon={heartRegular} style={{ color: "var(--theme-favorite-pink)" }} />
			)}
		</button>
	);
};

export default FavoriteButton;
