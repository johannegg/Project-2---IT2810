import React from "react";
import { FaEye } from "react-icons/fa";
import { Song } from "../../utils/FetchMockData";
import { formatViews } from "../../utils/FormatViews";
import "./AllSongsList.css";
import { useNavigate } from "react-router-dom";

type AllSongsListProps = {
	songs: Song[];
};

export function AllSongsList({ songs }: AllSongsListProps) {
	const navigate = useNavigate();

	const routeChange = (song: Song) => {
		const path = `/${song.artist.toLowerCase().replace(/ /g, "-")}/${song.title
			.toLowerCase()
			.replace(/ /g, "-")}`;
		navigate(path, { state: song });
	};

	return (
		<section className="songContainer">
			{songs.length === 0 ? (
				<p>No songs found</p>
			) : (
				<table className="songTable">
					{songs.map((song) => (
						<tr key={song.id} className="tableRow" onClick={() => routeChange(song)}>
							<td className="titleCell">{song.title}</td>
							<td>{song.artist}</td>
							<td>{song.year}</td>
							<td className="viewsCell">
								<FaEye style={{ marginRight: "5px" }} />
								{formatViews(song.views)}
							</td>
						</tr>
					))}
				</table>
			)}
		</section>
	);
}
