import { useLocation, useNavigate } from "react-router-dom";
import { PlaylistData } from "../../pages/Playlists/Playlists";
import DisplayPlaylist from "./DisplayPlaylist";
import { useEffect, useState } from "react";

const DynamicPlaylist = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [playlistData, setPlaylistData] = useState<PlaylistData | null>(null);

    useEffect(() => {
        const initialPlaylistData = location.state?.playlist as PlaylistData | null;
        if (initialPlaylistData) {
            setPlaylistData(initialPlaylistData);
        } else {
            const storedPlaylists = JSON.parse(localStorage.getItem("playlists") || "[]");
            const playlistId = location.pathname.split("/").pop();
            const foundPlaylist = storedPlaylists.find((pl: PlaylistData) => pl.id === playlistId);
            setPlaylistData(foundPlaylist || null);
        }
    }, [location.state, location.pathname]);

    const handleDelete = () => {
        if (playlistData) {
            // Navigate back to Playlists page and pass a deletion flag
            navigate("/playlists", { state: { deletedPlaylistId: playlistData.id } });
        }
    };

    if (!playlistData) {
        return <div>Playlist not found</div>;
    }

    return <DisplayPlaylist playlist={playlistData} onDelete={handleDelete} />;
};

export default DynamicPlaylist;
