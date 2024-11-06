import React, { useState, useEffect } from "react";
import { PlaylistData } from "../../pages/Playlists/Playlists";
import "./DisplayPlaylist.css";
import { AllSongsList } from "../AllSongsComponents/AllSongsList";

interface DisplayPlaylistProps {
    playlist: PlaylistData;
    onDelete: () => void;
}

const DisplayPlaylist: React.FC<DisplayPlaylistProps> = ({ playlist, onDelete }) => {
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [currentPlaylist, setCurrentPlaylist] = useState<PlaylistData>(playlist);

    const updatePlaylistFromStorage = () => {
        const storedPlaylists = JSON.parse(localStorage.getItem("playlists") || "[]");
        const updatedPlaylist = storedPlaylists.find((pl: PlaylistData) => pl.id === playlist.id);
        if (updatedPlaylist) {
            setCurrentPlaylist(updatedPlaylist);
        }
    };

    useEffect(() => {
        updatePlaylistFromStorage();

        const handleStorageChange = () => {
            updatePlaylistFromStorage();
        };

        window.addEventListener("storage", handleStorageChange);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, [playlist.id]);

    const handleSongRemoved = () => {
        updatePlaylistFromStorage(); // Oppdater currentPlaylist umiddelbart
    };

    return (
        <section className="playlist-details">
            <div className="playlist-details-container">
                <button onClick={() => setShowConfirmDelete(true)} className="delete-button">
                    Delete Playlist
                </button>
                <h1>{currentPlaylist.name + " " + currentPlaylist.icon}</h1>
                <div className="songs-container">
                    {currentPlaylist.songs.length > 0 ? (
                        <AllSongsList
                            songs={currentPlaylist.songs}
                            genres={[]}
                            isInPlaylist
                            playlistId={currentPlaylist.id}
                            onSongRemoved={handleSongRemoved} // Send callback til AllSongsList
                        />
                    ) : (
                        <p>No songs here yet.</p>
                    )}
                </div>

                {showConfirmDelete && (
                    <div className="modal-overlay">
                        <div className="modal">
                            <p>Are you sure you want to delete this playlist?</p>
                            <div className="modal-buttons">
                                <button onClick={() => setShowConfirmDelete(false)} className="cancel-button">
                                    No
                                </button>
                                <button onClick={() => { onDelete(); setShowConfirmDelete(false); }} className="confirm-button">
                                    Yes
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default DisplayPlaylist;
