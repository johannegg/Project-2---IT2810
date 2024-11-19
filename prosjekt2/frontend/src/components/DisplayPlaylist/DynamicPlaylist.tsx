import { useParams, useNavigate } from "react-router-dom";
import { useReactiveVar } from "@apollo/client";
import { playlistsVar } from "../../apollo/cache";
import DisplayPlaylist from "./DisplayPlaylist";

const DynamicPlaylist = () => {
	const { playlistId } = useParams<{ playlistId: string }>();
	const navigate = useNavigate();
	const playlists = useReactiveVar(playlistsVar);
	const playlistData = playlists.find((playlist) => playlist.id === playlistId);

	if (!playlistData) {
		navigate("/not-found", { replace: true });
		return null;
	}

	const handleDelete = () => {
		const updatedPlaylists = playlists.filter((playlist) => playlist.id !== playlistId);
		playlistsVar(updatedPlaylists);
		localStorage.setItem("playlists", JSON.stringify(updatedPlaylists));
		navigate("/playlists");
	};

	return <DisplayPlaylist playlistId={playlistData.id} onDelete={handleDelete} />;
};

export default DynamicPlaylist;
