import { useEffect, useState } from "react";
import { FaEye } from "react-icons/fa";
import { fetchSongs, Song } from "../../utils/FetchMockData";
import { formatViews } from "../../utils/FormatViews";
import "./AllSongsList.css";
import { useNavigate } from "react-router-dom";

export function AllSongsList() {
	const [songs, setSongs] = useState<Song[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState<boolean>(true);

	const navigate = useNavigate();

    const routeChange = (song: Song) => {
		const path = `/${song.artist.toLowerCase().replace(/ /g, "-")}/${song.title
			.toLowerCase()
			.replace(/ /g, "-")}`;
		  navigate(path, { state: song });
    };

	useEffect(() => {
		const loadData = async () => {
			try {
				const data = await fetchSongs();
				setSongs(data);
			} catch {
				setError("Failed to load data");
			} finally {
				setLoading(false);
			}
		};

		loadData();
	}, []);


	if (loading) return <p>Loading songs...</p>;
	if (error) return <p>{error}</p>;

	return (
		<section className="songContainer">
			<table className="songTable">
				{songs.map((song) => (
					// TODO: Add link to each lyrics pace
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
		</section>
	);
}
