import { useState, useEffect } from "react";
import "./Playlists.css";
import Playlist from "../../components/Playlist/Playlist";
import PlaylistForm from "../../components/PlaylistForm/PlaylistForm";
import { SongData } from "../../utils/types/SongTypes";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { CREATE_PLAYLIST, DELETE_PLAYLIST } from "../../utils/Queries";
import { useUserPlaylist } from "../../utils/hooks/useUserPlaylists";

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
	const [showForm, setShowForm] = useState(false);
	const [showLoading, setShowLoading] = useState(false);
	const profileName = localStorage.getItem("profileName");

	const [createPlaylist] = useMutation(CREATE_PLAYLIST);
	const [deletePlaylistMutation] = useMutation(DELETE_PLAYLIST);

	const defaultPlaylists: PlaylistData[] = [];

	const {
		playlists: fetchedPlaylists,
		loading: playlistsLoading,
		error: playlistsError,
		refetch,
	} = useUserPlaylist(profileName ? profileName : "");

	const [playlists, setPlaylists] = useState<PlaylistData[]>(() => {
		refetch();
		const storedPlaylists = localStorage.getItem("playlists");
		const userPlaylists = storedPlaylists ? JSON.parse(storedPlaylists) : [];
		return [...defaultPlaylists, ...userPlaylists];
	});
	useEffect(() => {
		if (fetchedPlaylists && fetchedPlaylists.length > 0) {
			localStorage.setItem("playlists", JSON.stringify(fetchedPlaylists));
			setPlaylists(fetchedPlaylists);
		}
	}, [fetchedPlaylists]);

	useEffect(() => {
		const userPlaylists = playlists.slice(defaultPlaylists.length);
		localStorage.setItem("playlists", JSON.stringify(userPlaylists));
	}, [defaultPlaylists.length, playlists]);

	useEffect(() => {
		let loadingTimeout: NodeJS.Timeout;
		if (playlistsLoading) {
			loadingTimeout = setTimeout(() => setShowLoading(true), 500); // Added delay
		} else {
			setShowLoading(false);
		}
		return () => clearTimeout(loadingTimeout); // Cleanup on unmount or if loading changes
	}, [playlistsLoading]);

	const addNewPlaylist = async (newPlaylistName: string, backgroundColor: string, icon: string) => {
		try {
			// Call the createPlaylist mutation
			const { data } = await createPlaylist({
				variables: {
					username: profileName,
					name: newPlaylistName,
					backgroundcolor: backgroundColor,
					icon: icon,
				},
			});
			refetch();
			// Update the state with the response from the server
			const createdPlaylist = data.createPlaylist;
			setPlaylists([
				...defaultPlaylists,
				...playlists.slice(defaultPlaylists.length),
				createdPlaylist,
			]);
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
				{!showLoading && (
					<button onClick={() => setShowForm(true)} className="new-playlist-button">
						New Playlist
					</button>
				)}
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
				{showLoading && <p>Loading playlists</p>}
				{playlistsError && <p>Error loading playlists</p>}
			</div>
		</section>
	);
};

export default Playlists;
