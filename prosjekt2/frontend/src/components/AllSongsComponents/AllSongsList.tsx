import { FaEye } from "react-icons/fa";
import { formatViews } from "../../utils/FormatViews";
import "./AllSongsList.css";
import { useNavigate } from "react-router-dom";
import FavoriteButton from "../FavoriteButton/FavoriteButton";
import { routeChange } from "../../utils/SongRouteChange";
import { SongData } from "../../utils/types/SongTypes";
import PlusMinusButton from "../PlusMinusButton/PlusMinusButton";
import { useReactiveVar } from "@apollo/client";
import { genreFilterVar, maxViewsVar, minViewsVar } from "../../apollo/cache";

type AllSongsListProps = {
	songs: SongData[];
	isInPlaylist?: boolean;
	playlistId?: string;
	onSongRemoved?: (songId: string) => void;
};

export function AllSongsList({
	songs,
	isInPlaylist,
	playlistId,
	onSongRemoved,
}: AllSongsListProps) {
	const navigate = useNavigate();
	const selectedGenres = useReactiveVar(genreFilterVar);
	const minViews = useReactiveVar(minViewsVar);
	const maxViews = useReactiveVar(maxViewsVar);

	const filteredSongs = songs
		.filter((song) => (selectedGenres.length > 0 ? selectedGenres.includes(song.genre.name) : true))
		.filter((song) => song.views >= minViews && song.views <= maxViews);

	return (
		<section className="songContainer">
			{filteredSongs.length === 0 ? (
				<p>No songs found</p>
			) : (
				<table className="songTable">
					<tbody>
						{filteredSongs.map((song) => (
							<tr
								key={song.id}
								className="tableRow"
								onClick={(e) => {
									if (!(e.target instanceof HTMLButtonElement)) {
										routeChange(song, navigate);
									}
								}}
								tabIndex={0}
								onKeyDown={(e) => {
									if (
										!(e.target instanceof HTMLButtonElement) &&
										(e.key === "Enter" || e.key === " ")
									) {
										e.preventDefault();
										routeChange(song, navigate);
									}
								}}
							>
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
