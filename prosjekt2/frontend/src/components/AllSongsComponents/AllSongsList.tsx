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
	isInPlaylist?: boolean;
	playlistId?: string;
	minViews?: number;
	maxViews?: number;
	onSongRemoved?: () => void;
	isSideBarOpen?: boolean;
};

export function AllSongsList({
	songs,
	genres, 
	maxViews, 
	minViews,
	isInPlaylist,
	playlistId,
	onSongRemoved,
	isSideBarOpen,
}: AllSongsListProps) {
	const navigate = useNavigate();

	const filteredSongs = songs
	.filter((song) => (genres.length > 0 ? genres.includes(song.genre.name) : true)) // Filter by genre if genres are selected
	.filter((song) => song.views >= (minViews ?? 0) && song.views <= (maxViews ?? Infinity)); // Filter by views within minViews and maxViews


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
										isSideBarOpen={isSideBarOpen ?? false}
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
