import React, { useEffect, useState } from "react";
import { FaEye } from "react-icons/fa";
import { fetchSongs, Song } from "../../utils/FetchMockData";
import { formatViews } from "../../utils/FormatViews";
import "./AllSongsList.css";
import { useNavigate } from "react-router-dom";

interface AllSongsListProps {
  genres: string[];
}

export function AllSongsList({ genres }: AllSongsListProps) {
  const [songs, setSongs] = useState<Song[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

	const navigate = useNavigate();

    const routeChange = (song: Song) => {
		const path = `/${song.artist.toLowerCase().replace(/ /g, "-")}/${song.title.toLowerCase().replace(/ /g, "-")}`;
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

  const filteredSongs = genres.length > 0 
    ? songs.filter(song => genres.includes(song.genre))
    : songs;

  return (
    <section className="songContainer">
      <table className="songTable">
        {filteredSongs.map((song) => (
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
