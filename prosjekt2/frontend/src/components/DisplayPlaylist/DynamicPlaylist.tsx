import { useLocation } from "react-router-dom";
import { PlaylistData } from "../../pages/Playlists/Playlists"; 
import DisplayPlaylist from "./DisplayPlaylist";

const DynamicPlaylist = () => {
    const location = useLocation();
    const playlistData = location.state?.playlist as PlaylistData | null;

    if (!playlistData) return <div>Playlist not found</div>;

    return <DisplayPlaylist playlist={playlistData} />;
};

export default DynamicPlaylist;
