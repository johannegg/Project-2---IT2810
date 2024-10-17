import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHeart as heartRegular} from "@fortawesome/free-regular-svg-icons";
import { faHeart as heartSolid} from "@fortawesome/free-solid-svg-icons";
import "./FavoriteButton.css"
import { useEffect, useState } from "react";
import { Song } from "../../utils/FetchMockData";

type FavoriteProps = {
    song: Song;
    size?: "small" | "large";
};
  
const FavoriteButton = ({song, size = "small"}: FavoriteProps) => {
    const [hearted, setHearted] = useState<boolean>(false);

    useEffect(() => {
        // Check if the song is already favorited (saved in localstorage)
        const favoriteSongs = JSON.parse(localStorage.getItem("favoriteSongs") || "[]");
        if (favoriteSongs.some((favSong: Song) => favSong.id === song.id)) {
            setHearted(true);
        }
    }, [song.id])

    const handleFavorite = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();

        const favoriteSongs: Song[] = JSON.parse(localStorage.getItem("favoriteSongs") || "[]")
        // Remove song from favorites when toggling a already hearted the favorite button 
        if(hearted) {
            const updatedFavorites = favoriteSongs.filter((favoriteSong) => favoriteSong.id !== song.id);
            localStorage.setItem("favoriteSongs", JSON.stringify(updatedFavorites));
        // Add entire song object to favorites
        } else {
            favoriteSongs.push(song);
            localStorage.setItem("favoriteSongs", JSON.stringify(favoriteSongs));
        }
        setHearted(!hearted);
    }

    const heartSize = size === "large" ? "xl" : "lg";
    
    return (
        <button className={`favoriteButton ${heartSize}`} onClick={(e) => handleFavorite(e)}>
            {hearted ? 
                <FontAwesomeIcon icon={heartSolid} style={{color: "#E27396"}} size={heartSize}/>
             : (
                <FontAwesomeIcon icon={heartRegular} style={{color: "#E27396"}} size={heartSize}/>
            )
            }
        </button>
    )
}

export default FavoriteButton