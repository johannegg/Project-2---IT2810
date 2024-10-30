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

	const defaultPlaylists: PlaylistData[] = [
		{
			id: uuidv4(),
			name: "My playlist 1",
			backgroundColor: "#ffffff",
			icon: "🎵",
			songs: [
				{
					id: "0",
					title: "Song A",
					artist: { id: "id1", name: "Artist 1" },
					year: 2015,
					views: 500,
					lyrics: "...",
					genre: { name: "pop" },
				},
				{
					id: "1",
					title: "Song B",
					artist: { id: "id2", name: "Artist 2" },
					year: 2016,
					views: 500,
					lyrics: "...",
					genre: { name: "pop" },
				},
			],
		},
		{
			id: uuidv4(),
			name: "My playlist 2",
			backgroundColor: "#ffffff",
			icon: "🎧",
			songs: [
				{
					id: "2",
					title: "Song C",
					artist: { id: "id3", name: "Artist 3" },
					year: 2015,
					views: 300,
					lyrics: "...",
					genre: { name: "pop" },
				},
				{
					id: "3",
					title: "Song D",
					artist: { id: "id4", name: "Artist 4" },
					year: 2015,
					views: 500,
					lyrics: "...",
					genre: { name: "pop" },
				},
			],
		},
	];

	const [playlists, setPlaylists] = useState<PlaylistData[]>(() => {
		const storedPlaylists = localStorage.getItem("playlists");
		const userPlaylists = storedPlaylists ? JSON.parse(storedPlaylists) : [];
		return [...defaultPlaylists, ...userPlaylists]; 
	});

	const [showForm, setShowForm] = useState(false);

	useEffect(() => {
		const userPlaylists = playlists.slice(defaultPlaylists.length); 
		localStorage.setItem("playlists", JSON.stringify(userPlaylists));
	}, [playlists]);

	const addNewPlaylist = (newPlaylistName: string, backgroundColor: string, icon: string) => {
		const newPlaylist = {
			id: uuidv4(),
			name: newPlaylistName,
			backgroundColor,
			icon,
			songs: [],
		};

		setPlaylists([...defaultPlaylists, ...playlists.slice(defaultPlaylists.length), newPlaylist]);
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
			<h2>Your Playlists</h2>

			<PlaylistForm show={showForm} onClose={() => setShowForm(false)} onSubmit={addNewPlaylist} />
			<div className="outer-playlist-container">
				<button onClick={() => setShowForm(true)} className="new-playlist-button">
					New Playlist
				</button>
				<div className="playlists-container">
					{playlists.map((playlist) => (
						<Playlist
							id={playlist.id}
							key={playlist.id}
							name={playlist.name}
							backgroundColor={playlist.backgroundColor}
							icon={playlist.icon}
							songs={playlist.songs}
							onClick={() => handlePlaylistClick(playlist)}
						/>
					))}
				</div>
			</div>
		</section>
	);
};

export default Playlists;
