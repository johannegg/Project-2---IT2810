import React, { useState } from "react";
import "./DisplayPlaylist.css";
import { AllSongsList } from "../AllSongsComponents/AllSongsList";
import { AiOutlineDelete } from "react-icons/ai";
import BackButton from "../BackButton/BackButton";
import { useReactiveVar } from "@apollo/client";
import { playlistsVar } from "../../apollo/cache";
import { PlaylistData } from "../../pages/Playlists/Playlists";

interface DisplayPlaylistProps {
  playlistId: string;
  onDelete: () => void;
}

const DisplayPlaylist: React.FC<DisplayPlaylistProps> = ({ playlistId, onDelete }) => {
  const playlists = useReactiveVar(playlistsVar); 
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const currentPlaylist = playlists.find((pl) => pl.id === playlistId);

  if (!currentPlaylist) return <div>Playlist not found</div>;

  const handleSongRemoved = (songId: string) => {
    const updatedPlaylist: PlaylistData = {
      ...currentPlaylist,
      songs: currentPlaylist.songs.filter((song) => song.id !== songId),
    };

    const updatedPlaylists = playlists.map((pl) =>
      pl.id === playlistId ? updatedPlaylist : pl
    );

    playlistsVar(updatedPlaylists);
    localStorage.setItem("playlists", JSON.stringify(updatedPlaylists)); 
  };

  return (
    <section className="playlist-details">
      <div className="playlist-details-container">
        <header className="playlist-header">
          <BackButton />
          <button onClick={() => setShowConfirmDelete(true)} className="delete-playlist-button">
            <AiOutlineDelete />
          </button>
        </header>
        <h1>{currentPlaylist.name + " " + currentPlaylist.icon}</h1>
        <div className="songs-container">
          {currentPlaylist.songs.length > 0 ? (
            <AllSongsList
              songs={currentPlaylist.songs}
              genres={[]}
              isInPlaylist
              playlistId={currentPlaylist.id}
              onSongRemoved={(songId: string) => handleSongRemoved(songId)}
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
                <button
                  onClick={() => {
                    onDelete();
                    setShowConfirmDelete(false);
                  }}
                  className="confirm-button"
                >
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
