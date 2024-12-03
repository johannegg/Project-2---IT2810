import { useParams, useNavigate } from "react-router-dom";
import { useReactiveVar } from "@apollo/client";
import { playlistsVar } from "../../apollo/cache";
import DisplayPlaylist from "./DisplayPlaylist";
import { useEffect } from "react";

const DynamicPlaylist = () => {
	const { playlistId } = useParams<{ playlistId: string }>(); 
	const navigate = useNavigate();
	const playlists = useReactiveVar(playlistsVar);
	const playlistData = playlists.find((playlist) => playlist.id === playlistId);

	useEffect(() => {
		// Load playlists from localStorage into the Apollo cache when the component mounts
		const storedPlaylists = JSON.parse(localStorage.getItem("playlists") || "[]");
		playlistsVar(storedPlaylists);
	}, []);

	if (!playlistData) {
		// Redirect to a "not found" page if the playlist does not exist
		navigate("/not-found", { replace: true });
		return <div aria-label="Playlist not found">Playlist not found. Redirecting...</div>;
	}

	const handleDelete = () => {
		// Remove the playlist and update both the Apollo cache and localStorage
		const updatedPlaylists = playlists.filter((playlist) => playlist.id !== playlistId);
		playlistsVar(updatedPlaylists);
		localStorage.setItem("playlists", JSON.stringify(updatedPlaylists));
		// Navigate back to the playlists page after deletion
		if (playlistData) {
			navigate("/playlists", { state: { deletedPlaylistId: playlistData.id } });
		}
	};

	return (
		<section aria-label={`Dynamic view for playlist: ${playlistData.name}`}>
			{/* Render the DisplayPlaylist component for the current playlist */}
			<DisplayPlaylist playlistId={playlistData.id} onDelete={handleDelete} />
		</section>
	);
};

export default DynamicPlaylist;
