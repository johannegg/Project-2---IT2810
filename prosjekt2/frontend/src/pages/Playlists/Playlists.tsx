import { useState, useEffect } from "react";
import "./Playlists.css";
import Playlist from "../../components/Playlist/Playlist";
import PlaylistForm from "../../components/PlaylistForm/PlaylistForm";
import { SongData } from "../../utils/types/SongTypes";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

export interface PlaylistData {
	id: string;
	name: string;
	backgroundColor: string;
	icon: string;
	songs: SongData[];
}

const Playlists = () => {
	const navigate = useNavigate();

	const [playlists, setPlaylists] = useState<PlaylistData[]>(() => {
		const storedPlaylists = localStorage.getItem("playlists");
		return storedPlaylists ? JSON.parse(storedPlaylists) : [];
	});

	const [showForm, setShowForm] = useState(false);

	useEffect(() => {
		localStorage.setItem("playlists", JSON.stringify(playlists));
	}, [playlists]);

	const addNewPlaylist = (newPlaylistName: string, backgroundColor: string, icon: string) => {
		const newPlaylist = {
			id: uuidv4(),
			name: newPlaylistName,
			backgroundColor,
			icon,
			songs: [],
		};
		setPlaylists([...playlists, newPlaylist]);
	};

	const deletePlaylist = (playlistId: string) => {
		const updatedPlaylists = playlists.filter((playlist) => playlist.id !== playlistId);
		setPlaylists(updatedPlaylists);
	};

	const handlePlaylistClick = (playlist: PlaylistData) => {
		navigate(`/playlist/${playlist.id}`, { state: { playlist, deletePlaylist } });
	};

	return (
		<section className="playlists-page">
			<h1>Your Playlists</h1>

			<PlaylistForm show={showForm} onClose={() => setShowForm(false)} onSubmit={addNewPlaylist} />
			<div className="outer-playlist-container">
				<button onClick={() => setShowForm(true)} className="new-playlist-button">
					New Playlist
				</button>
				<div className="playlists-container">
					{playlists.length === 0 ? (
						<p>You have no playlists yet.</p>
					) : (
						playlists.map((playlist) => (
							<Playlist
								id={playlist.id}
								key={playlist.id}
								name={playlist.name}
								backgroundColor={playlist.backgroundColor}
								icon={playlist.icon}
								songs={playlist.songs}
								onClick={() => handlePlaylistClick(playlist)}
								tabIndex={0}
								onKeyDown={(e) => {
									if (e.key === "Enter" || e.key === " ") {
										handlePlaylistClick(playlist);
									}
								}}
							/>
						))
					)}
				</div>
			</div>
		</section>
	);
};

export default Playlists;
