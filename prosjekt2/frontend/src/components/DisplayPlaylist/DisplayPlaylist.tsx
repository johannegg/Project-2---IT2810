import React from "react";
import { PlaylistData } from "../../pages/Playlists/Playlists";
import "./DisplayPlaylist.css";
import { AllSongsList } from "../AllSongsComponents/AllSongsList";

interface DisplayPlaylistProps {
	playlist: PlaylistData;
	onDelete: () => void;
}

const DisplayPlaylist: React.FC<DisplayPlaylistProps> = ({ playlist, onDelete }) => {
	return (
		<section className="playlist-details">
			<button onClick={onDelete} className="delete-button">
				Delete Playlist
			</button>
			<h1>{playlist.name + " " + playlist.icon}</h1>
			<div className="songs-container">
				{playlist.songs.length > 0 ? (
					<AllSongsList songs={playlist.songs} genres={[]} />
				) : (
					<p>No songs here yet.</p>
				)}
			</div>
		</section>
	);
};

export default DisplayPlaylist;
