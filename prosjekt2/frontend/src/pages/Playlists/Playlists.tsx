import { useState, useEffect } from "react";
import "./Playlists.css";
import Playlist from "../../components/Playlist/Playlist";
import PlaylistForm from "../../components/PlaylistForm/PlaylistForm";
import { SongData } from "../../utils/types/SongTypes";
import { useLocation, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { useMutation } from "@apollo/client";
import { CREATE_PLAYLIST, DELETE_PLAYLIST } from "../../utils/Queries";

export interface PlaylistData {
	id: string;
	name: string;
	backgroundcolor: string;
	icon: string;
	songs: SongData[];
}

const Playlists = () => {
	const navigate = useNavigate();
	const location = useLocation();

	const defaultPlaylists: PlaylistData[] = [
		{
			id: uuidv4(),
			name: "My playlist 1",
			backgroundcolor: "#ffffff",
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
			backgroundcolor: "#ffffff",
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
	// Mutations for creating and deleting playlists
	const [createPlaylist] = useMutation(CREATE_PLAYLIST);
	const [deletePlaylistMutation] = useMutation(DELETE_PLAYLIST);

	useEffect(() => {
		const userPlaylists = playlists.slice(defaultPlaylists.length);
		localStorage.setItem("playlists", JSON.stringify(userPlaylists));
	}, [defaultPlaylists.length, playlists]);

	const addNewPlaylist = async (newPlaylistName: string, backgroundColor: string, icon: string) => {
		try {
			// Call the createPlaylist mutation
			const { data } = await createPlaylist({
				variables: {
					username: localStorage.getItem("profileName"),
					name: newPlaylistName,
					backgroundcolor: backgroundColor,
					icon: icon,
				},
			});

			// Update the state with the response from the server
			const createdPlaylist = data.createPlaylist;
			setPlaylists([...defaultPlaylists, ...playlists.slice(defaultPlaylists.length), createdPlaylist]);
		} catch (error) {
			console.error("Error creating playlist:", error);
		}
	};

	const deletePlaylist = async (playlistId: string) => {
		try {
			await deletePlaylistMutation({
				variables: {
					username: localStorage.getItem("profileName"),
					playlistId,
				},
			});
			console.log(playlistId)
			// Remove the playlist locally
			const updatedPlaylists = playlists.filter((playlist) => playlist.id !== playlistId);
			setPlaylists(updatedPlaylists);
		} catch (error) {
			console.error("Error deleting playlist:", error);
		}
	};

	useEffect(() => {
        // Check if a playlist deletion is requested in location.state
        const deletedPlaylistId = location.state?.deletedPlaylistId;
        if (deletedPlaylistId) {
            deletePlaylist(deletedPlaylistId);
            // Clear the deletion flag from location.state to avoid repeating the deletion
            navigate("/playlists", { replace: true });
        }
    }, [location.state]);

	const handlePlaylistClick = (playlist: PlaylistData) => {
		navigate(`/playlist/${playlist.id}`, { state: { playlist } });
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
					{playlists.map((playlist) => (
						<Playlist
							id={playlist.id}
							key={playlist.id}
							name={playlist.name}
							backgroundColor={playlist.backgroundcolor}
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
