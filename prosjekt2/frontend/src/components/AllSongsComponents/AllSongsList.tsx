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
	selectedGenres: string[];
	maxViews: number;
	minViews: number;
	isInPlaylist?: boolean;
	playlistId?: string;
	onSongRemoved?: (songId: string) => void;
};

export function AllSongsList({
	songs,
	isInPlaylist,
	playlistId,
	selectedGenres,
	maxViews,
	minViews,
	onSongRemoved,
}: AllSongsListProps) {
	const navigate = useNavigate();

	// Filter songs based on selected genres and view range
	const filteredSongs = songs
		.filter((song) => (selectedGenres.length > 0 ? selectedGenres.includes(song.genre.name) : true))
		.filter((song) => song.views >= minViews && song.views <= maxViews);

	return (
		<section className="songContainer" aria-label="Songs list">
			{filteredSongs.length === 0 ? (
				<p aria-label="No songs found">No songs found</p>
			) : (
				<table className="songTable" aria-label="Filtered songs table">
					<tbody>
						{filteredSongs.map((song) => (
							<tr
								key={song.id}
								className="tableRow"
								aria-label={`Song: ${song.title} by ${song.artist.name}`}
								// Navigate to song details page unless a button is clicked
								onClick={(e) => {
									if (!(e.target instanceof HTMLButtonElement)) {
										routeChange(song, navigate);
									}
								}}
								tabIndex={0}
								// Handle keyboard navigation for accessibility
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
								<td className="title-artist-cell" aria-label="Song title and artist">
									<span className="titleCell" aria-label={`Title: ${song.title}`}>
										{song.title}
									</span>
									<span className="artistCell" aria-label={`Artist: ${song.artist.name}`}>
										{song.artist.name}
									</span>
								</td>
								<td aria-label={`Year: ${song.year}`}>{song.year}</td>
								<td className="viewsCell" aria-label={`Views: ${song.views}`}>
									{/* Display view count with icon */}
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
