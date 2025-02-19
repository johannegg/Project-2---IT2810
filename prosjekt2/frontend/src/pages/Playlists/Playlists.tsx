import { useState, useEffect, useCallback } from "react";
import "./Playlists.css";
import Playlist from "../../components/Playlist/Playlist";
import PlaylistForm from "../../components/PlaylistForm/PlaylistForm";
import { SongData } from "../../utils/types/SongTypes";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { CREATE_PLAYLIST, DELETE_PLAYLIST } from "../../utils/Queries";
import { useUserPlaylist } from "../../utils/hooks/useUserPlaylists";
import { playlistsVar } from "../../apollo/cache";
import { useReactiveVar } from "@apollo/client";

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
	const playlists = useReactiveVar(playlistsVar);
	const profileName = localStorage.getItem("profileName");

	const [createPlaylist] = useMutation(CREATE_PLAYLIST);
	const [deletePlaylistMutation] = useMutation(DELETE_PLAYLIST);

	const {
		playlists: fetchedPlaylists,
		loading: playlistsLoading,
		error: playlistsError,
		refetch,
	} = useUserPlaylist(profileName ? profileName : "");

	useEffect(() => {
		if (fetchedPlaylists?.length) {
			playlistsVar(fetchedPlaylists);
		}
	}, [fetchedPlaylists]);

	useEffect(() => {
		localStorage.setItem("playlists", JSON.stringify(playlists));
	}, [playlists]);

	// Fetch playlists from `localStorage` to `playlistsVar`
	useEffect(() => {
		const storedPlaylists = localStorage.getItem("playlists");
		if (storedPlaylists) {
			playlistsVar(JSON.parse(storedPlaylists));
		}
	}, []);

	// If playlists are loading, set a timeout to display the loading indicator after 500ms, to hinder it from popping up immediately
	useEffect(() => {
		let loadingTimeout: NodeJS.Timeout;
		if (playlistsLoading) {
			loadingTimeout = setTimeout(() => setShowLoading(true), 500);
		} else {
			setShowLoading(false);
		}
		return () => clearTimeout(loadingTimeout);
	}, [playlistsLoading]);

	const addNewPlaylist = async (newPlaylistName: string, backgroundColor: string, icon: string) => {
		try {
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
			playlistsVar([...playlists, createdPlaylist]);
		} catch (error) {
			console.error("Error creating playlist:", error);
		}
	};

	const deletePlaylist = useCallback(
		async (playlistId: string) => {
			try {
				await deletePlaylistMutation({
					variables: {
						username: localStorage.getItem("profileName"),
						playlistId,
					},
				});
				const updatedPlaylists = playlists.filter((playlist) => playlist.id !== playlistId);
				playlistsVar(updatedPlaylists);
			} catch (error) {
				console.error("Error deleting playlist:", error);
			}
		},
		[deletePlaylistMutation, playlists],
	);

	useEffect(() => {
		const deletedPlaylistId = location.state?.deletedPlaylistId;
		if (deletedPlaylistId) {
			deletePlaylist(deletedPlaylistId);
			navigate("/playlists", { replace: true });
		}
	}, [deletePlaylist, location.state, navigate]);

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
				<div className="playlists-container" aria-label="List of your playlists">
					{playlists.length === 0 ? (
						<p>You have no playlists yet.</p>
					) : (
						playlists.map((playlist) => (
							<Playlist
								id={playlist.id}
								key={playlist.id}
								name={playlist.name}
								backgroundColor={playlist.backgroundcolor}
								icon={playlist.icon}
								songs={playlist.songs}
								onClick={() => handlePlaylistClick(playlist)}
								aria-label={`Open playlist ${playlist.name}`}
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
				{showLoading && <p>Loading playlists</p>}
				{playlistsError && <p>Error loading playlists</p>}
			</div>
		</section>
	);
};

export default Playlists;
