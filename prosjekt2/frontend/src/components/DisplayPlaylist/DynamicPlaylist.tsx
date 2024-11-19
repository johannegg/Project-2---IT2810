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
		const storedPlaylists = JSON.parse(localStorage.getItem("playlists") || "[]");
		playlistsVar(storedPlaylists);
	}, []);

	if (!playlistData) {
		navigate("/not-found", { replace: true });
		return null;
	}

	const handleDelete = () => {
		const updatedPlaylists = playlists.filter((playlist) => playlist.id !== playlistId);
		playlistsVar(updatedPlaylists);
		localStorage.setItem("playlists", JSON.stringify(updatedPlaylists));
		if (playlistData) {
			// Navigate back to Playlists page and pass a deletion flag
			navigate("/playlists", { state: { deletedPlaylistId: playlistData.id } });
		}
	};

	return <DisplayPlaylist playlistId={playlistData.id} onDelete={handleDelete} />;
};

export default DynamicPlaylist;
