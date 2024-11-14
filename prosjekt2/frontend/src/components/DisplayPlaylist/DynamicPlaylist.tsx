import { useLocation, useNavigate } from "react-router-dom";
import { PlaylistData } from "../../pages/Playlists/Playlists";
import DisplayPlaylist from "./DisplayPlaylist";
import { playlistsVar } from "../../apollo/cache";

const DynamicPlaylist = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const playlistData = location.state?.playlist as PlaylistData | null;

	if (!playlistData) return <div>Playlist not found</div>;

	const playlistId = playlistData.id;

	const handleDelete = () => {
		const playlists = playlistsVar();

		const updatedPlaylists = playlists.filter(
			(playlist: PlaylistData) => playlist.id !== playlistId
		);

		playlistsVar(updatedPlaylists);
		localStorage.setItem("playlists", JSON.stringify(updatedPlaylists));

		navigate("/playlists");
	};

	return (
		<DisplayPlaylist playlistId={playlistId} onDelete={handleDelete} />
	);
};

export default DynamicPlaylist;

