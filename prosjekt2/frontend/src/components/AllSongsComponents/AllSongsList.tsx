import { FaEye } from "react-icons/fa";
import { formatViews } from "../../utils/FormatViews";
import "./AllSongsList.css";
import { useNavigate } from "react-router-dom";
import FavoriteButton from "../FavoriteButton/FavoriteButton";
import { routeChange } from "../../utils/SongRouteChange";
import { SongData } from "../../utils/types/SongTypes";
import PlusMinusButton from "../PlusMinusButton/PlusMinusButton";

type AllSongsListProps = {
	songs: SongData[];
	genres: string[];
	isInPlaylist: boolean;
	playlistId?: string;
	onSongRemoved?: () => void;
};

export function AllSongsList({
	songs,
	genres,
	isInPlaylist,
	playlistId,
	onSongRemoved,
}: AllSongsListProps) {
	const navigate = useNavigate();

	const filteredSongs =
		genres.length > 0 ? songs.filter((song) => genres.includes(song.genre.name)) : songs;

	return (
		<section className="songContainer">
			{songs.length === 0 ? (
				<p>No songs found</p>
			) : (
				<table className="songTable">
					<tbody>
						{filteredSongs.map((song) => (
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
								<td className="plusMinusCell">
									<PlusMinusButton
										song={song}
										isInPlaylist={isInPlaylist}
										playlistId={playlistId}
										onSongRemoved={onSongRemoved}
									/>
								</td>
								<td>
									<FavoriteButton song={song} />
								</td>
							</tr>
						))}
					</tbody>
				</table>
			)}
		</section>
	);
}
