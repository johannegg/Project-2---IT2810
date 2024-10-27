import React from "react";
import { PlaylistData } from "../../pages/Playlists/Playlists";
import "./DisplayPlaylist.css";
import { AllSongsList } from "../AllSongsComponents/AllSongsList";

interface DisplayPlaylistProps {
	playlist: PlaylistData;
}

const DisplayPlaylist: React.FC<DisplayPlaylistProps> = ({ playlist }) => {
	return (
		<section className="playlist-details">
			<h1>{playlist.name + " " + playlist.icon}</h1>
			<div className="songs-container">
				{playlist.songs.length > 0 ? (
					<AllSongsList songs={playlist.songs} genres={[]} />
				) : (
					<p>No songs available</p>
				)}
			</div>
		</section>
	);
};

export default DisplayPlaylist;
