import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { PlaylistData } from "../../pages/Playlists/Playlists";
import DisplayPlaylist from "./DisplayPlaylist";

const DynamicPlaylist = () => {
    const [playlistData, setPlaylistData] = useState<PlaylistData | null>(null);
    const location = useLocation();

    useEffect(() => {
        if (location.state) {
            const playlist = location.state as PlaylistData;
            setPlaylistData(playlist);
        } else {
            setPlaylistData(null);
        }
    }, [location.state]);

    if (!playlistData) return <div>Playlist not found</div>;

    return <DisplayPlaylist playlist={playlistData} />;
};

export default DynamicPlaylist;
