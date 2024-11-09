import { useLocation, useNavigate } from "react-router-dom";
import { PlaylistData } from "../../pages/Playlists/Playlists";
import DisplayPlaylist from "./DisplayPlaylist";

const DynamicPlaylist = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const playlistData = location.state?.playlist as PlaylistData | null;

	if (!playlistData) return <div>Playlist not found</div>;

	const handleDelete = () => {
		const storedPlaylists = localStorage.getItem("playlists");
		const playlists = storedPlaylists ? JSON.parse(storedPlaylists) : [];

		const updatedPlaylists = playlists.filter(
			(playlist: PlaylistData) => playlist.id !== playlistData.id,
		);

		localStorage.setItem("playlists", JSON.stringify(updatedPlaylists));

		navigate("/playlists");
	};

	return <DisplayPlaylist playlist={playlistData} onDelete={handleDelete} />;
};

export default DynamicPlaylist;
