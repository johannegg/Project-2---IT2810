import React from "react";
import { FaEye } from "react-icons/fa";
import type { Song } from "../../utils/FetchMockData";
import { formatViews } from "../../utils/FormatViews";
import "./AllSongsList.css";
import { useNavigate } from "react-router-dom";
import FavoriteButton from "../FavoriteButton/FavoriteButton";
import { routeChange } from "../../utils/SongRouteChange";

type AllSongsListProps = {
    songs: Song[];
    genres: string[];
};

export function AllSongsList({ songs, genres }: AllSongsListProps) {
	const navigate = useNavigate();

	const filteredSongs =
		genres.length > 0 ? songs.filter((song) => genres.includes(song.genre)) : songs;

	return (
		<section className="songContainer">
			{songs.length === 0 ? (
				<p>No songs found</p>
			) : (
				<table className="songTable">
					{filteredSongs.map((song) => (
						<tr key={song.id} className="tableRow" onClick={() => routeChange(song, navigate)}>
							<td className="title-artist-cell">
								<span className="titleCell">{song.title}</span>
								<span className="artistCell">{song.artist}</span>
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
