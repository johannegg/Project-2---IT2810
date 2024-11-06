import { FaEye } from "react-icons/fa";
import { formatViews } from "../../utils/FormatViews";
import "./AllSongsList.css";
import { useNavigate } from "react-router-dom";
import FavoriteButton from "../FavoriteButton/FavoriteButton";
import { routeChange } from "../../utils/SongRouteChange";
import { SongData } from "../../utils/types/SongTypes";

type AllSongsListProps = {
    songs: SongData[];
    genres: string[];
	minViews: number;
	maxViews: number;
};

export function AllSongsList({ songs, genres, maxViews, minViews }: AllSongsListProps) {
	const navigate = useNavigate();
    const filteredSongs =
        genres.length > 0 ? songs.filter((song) => genres.includes(song.genre.name)) : songs;
	
	const filteredSongsViews = filteredSongs.filter((song) => song.views >= minViews && song.views <= maxViews);

	return (
		<section className="songContainer">
			{songs.length === 0 ? (
				<p>No songs found</p>
			) : (
				<table className="songTable">
					{filteredSongsViews.map((song) => (
						<tr key={song.id} className="tableRow" onClick={() => routeChange(song, navigate)}>
							<td className="title-artist-cell">
								<span className="titleCell">{song.title}</span>
								<span className="artistCell">{song.artist.name}</span>
							</td>
							<td>{song.year}</td>
							<td className="viewsCell">
								<FaEye style={{ marginRight: "5px" }} />
								{formatViews(song.views)}
							</td>
							<td>
								<FavoriteButton song={song} />
							</td>
						</tr>
					))}
				</table>
			)}
		</section>
	);
}
