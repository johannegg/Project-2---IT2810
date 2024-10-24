import React from 'react';
import { PlaylistData } from '../../pages/Playlists/Playlists'; 
import './DisplayPlaylist.css';

interface DisplayPlaylistProps {
    playlist: PlaylistData;
}

const DisplayPlaylist: React.FC<DisplayPlaylistProps> = ({ playlist }) => {
    return (
        <div className="playlist-details">
            <h1>{playlist.name}</h1>
            <section className="songs-list">
                <h2>Songs in this playlist</h2>
                {playlist.songs.length > 0 ? (
                    <ul>
                        {playlist.songs.map((song) => (
                            <li key={song.id}>
                                {song.title} by {song.artist}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No songs available</p>
                )}
            </section>
        </div>
    );
};

export default DisplayPlaylist;
